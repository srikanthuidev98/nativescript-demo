import { Injectable } from '@angular/core';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { TNSRecorder } from 'nativescript-audio';
import { requestCameraPermissions, requestPhotosPermissions } from 'nativescript-camera';
import { TranslateService } from '@ngx-translate/core';
import { LocalNotifications } from 'nativescript-local-notifications';
import * as Permissions from "nativescript-permissions";
import { DialogHelper } from '../helpers';
import { first } from 'rxjs/operators';
import { enableLocationRequest } from 'nativescript-geolocation';
import * as dialogs from 'tns-core-modules/ui/dialogs';
// To suppress fake errors.
declare var AVAudioSession, AVAudioSessionRecordPermission: any;

/**
 * This service is used to check permissions for the app
 */
@Injectable()
export class CheckPermissionService {

    constructor(private dialogHelper: DialogHelper, private translate: TranslateService) {
      this.androidShowDialog = false;
    }

    private _recorder: TNSRecorder;
    private androidShowDialog: boolean;

    /**
     * Checks audio permission
     * Returns boolean if permission is granted or not.
     */
    async checkAudio(): Promise<void> {
      if (isIOS) {
        switch (AVAudioSession.sharedInstance().recordPermission) {
          // case AVAudioSessionRecordPermission.Granted:
          //   break;
          case AVAudioSessionRecordPermission.Denied:
            this.dialogHelper.alert('Please give AssuriCare permissions to use Microphone in order to continue ' +
                '(System Settings -> AssuriCare -> Microphone -> Enable)', 'Please give audio permission').then(() => {
              this.checkAudio();
            });
            break;
          case AVAudioSessionRecordPermission.Undetermined: // This is the initial state before a user has made any choice
            AVAudioSession.sharedInstance().requestRecordPermission(granted => {
              if (!granted) {
                this.checkAudio();
              }
            });
            break;
        }
      } else {
        this._recorder = new TNSRecorder();

        if (!this._recorder.hasRecordPermission()) {
          return this._recorder.requestRecordPermission().then(
            () => {}, // Has permission
            () => {   // Does NOT have permission
              if (this.androidShowDialog) {
                this.dialogHelper.alert('AssuriCare needs permission to record visit details.', 'Please accept audio').then(() => {
                  this.checkAudio();
                });
              } else {
                this.androidShowDialog = true;
                this.checkAudio();
              }
              throw 'User does not have audio permissions.';
          });
        }
      }
    }

    checkLocationPermission(): Promise<void> {
        return enableLocationRequest(true).then(
            () => {},
            () => {
                this.showNoPermissionDialog('LOCATION');
                throw 'User does not have Location permissions.';
            }
        );
    }

    /**
     * Checks camera permission
     * Returns a promise.
     * Then (Success) = has permissions
     * catch (Fail) = does not have permissions
     */
    checkCamera(): Promise<void> {
      return requestCameraPermissions().then(
        () => {}, // Has permission
        () => {   // Does NOT have permission
          this.showNoPermissionDialog('CAMERA');
          throw 'User does not have camera permissions.';
        }
      );
    }

    /**
     * Checks photo library permission
     * Returns a promise.
     * Then (Success) = has permissions
     * catch (Fail) = does not have permissions
     */
    checkPhotos(): Promise<void> {
      return requestPhotosPermissions().then(
        () => {}, // Has permission
        () => {   // Does NOT have permission
          this.showNoPermissionDialog('PHOTO');
          throw 'User does not have photos permissions.';
        }
      );
    }

    checkNotification() {
        return LocalNotifications.requestPermission().then(
            () => {}, // Has permission
            () => {   // Does NOT have permission
              this.showNoPermissionDialog('NOTIFICATION');
              throw 'User does not have notification permissions.';
            }
        );
    }

    async backgroundLocationInfo() {
      if (!isIOS) {
        if (!Permissions.hasPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION)) {
        return this.dialogHelper.alert('This app collects location data to confirm where you are during the time you begin and end your shifts even when the app is closed or not in use.', 'Background Location', 'OK', false);
       }
      }
    }   

    /**
     * Checks if app has permission for Location, Microphone, and Notifications.
     */
    public async requestAccessToNeededPermissions() {
        await this.backgroundLocationInfo()
        await this.checkNotification();
        await this.checkLocationPermission();
        await this.checkAudio();
       
    }

    private showNoPermissionDialog(permission: 'AUDIO' | 'CAMERA' | 'PHOTO' | 'LOCATION' | 'NOTIFICATION') {
      let os = '';
      isIOS ? os = 'IOS' : os = 'ANDROID';

      this.translate.get(`ALERT.PERMISSION.${os}.${permission}`).pipe(first()).subscribe(text => {
        this.dialogHelper.alert(text);
      });
    }
}
