import { Injectable } from '@angular/core';
import { ContinuousService_CLASSNAME } from './android/continuous-service.android';
import * as application from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { RedirectHelper } from '../../helpers';

declare const android: any;

@Injectable({providedIn: 'root'})
export class BackgroundService {
    constructor(private redirectHelper: RedirectHelper) {
        setTimeout(() => {
            if (BackgroundService.showLocationAlert) {
              dialogs.alert({
                  title: 'AssuriCare needs location Permission',
                  message: 'Please change your location permission to \'Always\'',
                  okButtonText: 'Go to Permissions'
              }).then(() => {
                this.redirectHelper.goToAppPermissions();
                BackgroundService.showLocationAlert = false;
              });
            }
          }, 1000);
     }

    public static killProcess = false;
    public static showLocationAlert = false;

    public startBackgroundProcess() {
        BackgroundService.killProcess = false;
        const context = application.android.context;
        const intent = new android.content.Intent();
        intent.setClassName(context, ContinuousService_CLASSNAME);
        context.startService(intent);
    }

    public stopBackgroundProcess() {
        BackgroundService.killProcess = true;
        const context = application.android.context;
        const intent = new android.content.Intent();
        intent.setClassName(context, ContinuousService_CLASSNAME);
        context.stopService(intent);
    }
}
