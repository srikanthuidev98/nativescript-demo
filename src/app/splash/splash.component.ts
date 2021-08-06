import { Component, OnInit, Inject } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first, take } from 'rxjs/operators';

import { RouterExtensions } from 'nativescript-angular/router';
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from '@nstudio/nativescript-cardview';
import { Page } from 'tns-core-modules/ui/page/page';
import { device } from 'tns-core-modules/platform/platform';

import { CheckPermissionService } from '../../ACCommon/services/check-permission.service';
import { AppState } from '../../ACCommon/states/app.state';
import { InvalidLocationReason, SubmitActionType } from '../../ACCommon/enums';
import { Client, Caregiver, DualClient, Visit, SubmitActionRequest, LastVisit } from '../../ACCommon/models';
import { LanguageService } from '../../ACCommon/services/language.service';
import { APP_CONFIG } from '../../ACCommon/config/app-config.module';
import { AppConfig } from '../../ACCommon/models/core/app-config.model';
import { ConnectivityHelper } from '../../ACCommon/helpers/connectivity.helper';
import { PushToken } from '../../ACCommon/models/push-token.model';
import { isAndroid } from 'tns-core-modules/ui/page/page';
import { TimerService } from '../../ACCommon/services/timer.service';
import { RouterHelper, LocalNotificationHelper, LocationHelper, LoadingHelper } from '../../ACCommon/helpers';
import { LocalStorageService } from '../../ACCommon/storage/local-storage';
import { LoginForm } from '../../ACCommon/models/forms';
import { messaging } from 'nativescript-plugin-firebase/messaging';
import { DateService } from '../../ACCommon/services/date.service';

// Registering elements for the entire application.
registerElement('CardView', () => CardView);
registerElement('PullToRefresh', () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh);


@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  public static isCheckedIn = false;

  @Select(AppState.getLoading) loading$: Observable<boolean>;
  @Select(AppState.getIsAuth) isAuth$: Observable<boolean>;
  @Select(AppState.getClients) clients$: Observable<Client[]>;
  @Select(AppState.getSavedLastVisit) lastVisit$: Observable<LastVisit>;
  @Select(AppState.getCurrentClient) client$: Observable<Client>;
  @Select(AppState.getCurrentDualClient) dualClient$: Observable<DualClient>;
  @Select(AppState.getCaregiver) caregiver$: Observable<Caregiver>;
  @Select(AppState.getPushToken) caregiverPushToken$: Observable<string>;
  @Select(AppState.getEditShift) editShift$: Observable<SubmitActionRequest>;
  @Select(AppState.getCurrentVisit) currentVisit$: Observable<Visit>;
  @Select(AppState.getChangePasswordForm) changePasswordForm$: Observable<LoginForm>;


  @Emitter(AppState.getClientsFromDb)
  public getClientsFromDb: Emittable<boolean>;

  @Emitter(AppState.getLastVisitFromDB)
  public getLastVisitFromDB: Emittable<null>;

  @Emitter(AppState.setCurrentClient)
  public setCurrentClient: Emittable<Client>;

  @Emitter(AppState.removeCurrnetClientAndShift)
  public removeCurrnetClientAndShift: Emittable<null>;

  @Emitter(AppState.submitAction)
  public submitAction: Emittable<SubmitActionRequest>;

  @Emitter(AppState.setEditShift)
  public setEditShift: Emittable<SubmitActionRequest>;

  @Emitter(AppState.setADLsKeys)
  public setADLsKeys: Emittable<null>;

  @Emitter(AppState.pullIADLsFromDB)
  public pullIADLsFromDB: Emittable<null>;

  @Emitter(AppState.getProfilePicture)
  public getProfilePicture: Emittable<null>;

  @Emitter(AppState.setProfileInfo)
  public setProfileInfo: Emittable<null>;

  @Emitter(AppState.rehydrateApp)
  public rehydrateApp: Emittable<null>;

  @Emitter(AppState.uploadPushToken)
  public uploadPushToken: Emittable<PushToken>;

  @Emitter(AppState.logout)
  public logout: Emittable<null>;

  @Emitter(AppState.isTokenExpired)
  public isTokenExpired: Emittable<null>;

  @Emitter(AppState.sendAllNeedsToSyncShifts)
  private syncOfflineShifts: Emittable<null>;

  @Emitter(AppState.sendAllNeedsToSyncAdditionalQuestions)
  private syncAdditionalQuestions: Emittable<null>;

  @Emitter(AppState.pullPayrollData)
  public pullPayrollData: Emittable<null>;

  @Emitter(AppState.checkAppVersion)
  private checkAppVersion: Emittable<null>;

  @Emitter(AppState.pullMessageThreads)
  public pullMessageThreads: Emittable<null>;

  @Emitter(AppState.fetchLocationAlertOptionsFromDB)
  public fetchLocationAlertOptionsFromDB: Emittable<null>;

  @Emitter(AppState.getSyncScheduleFromDb)
  public getSyncScheduleFromDb: Emittable<null>;

  public loadingTextColor = '#ffffff';
  public loadingIndicatorColor = '#ffffff';

  constructor(private routerHelper: RouterHelper, private routerExtensions: RouterExtensions, @Inject(APP_CONFIG) private config: AppConfig,
    private languageService: LanguageService, private checkPermissionService: CheckPermissionService,
    private connection: ConnectivityHelper, private page: Page, private timerService: TimerService,
    private locationNotificationHelper: LocalNotificationHelper, private locationHelper: LocationHelper,
    private loadingHelper: LoadingHelper) { }

  ngOnInit() {
    // This will show the loading Helpr anywhere in the app whn loading = true.
    this.loading$.subscribe(loading => {
      if (loading) {
        setTimeout(() => {
          this.loadingHelper.showIndicator();
        }, 10);
      } else {
        setTimeout(() => {
          this.loadingHelper.hideIndicator();
        }, 10);
      }
    });

    // If first install, will clear out storage. Used for iOS keychain data.
    if (LocalStorageService.isFirstRun()) {
      this.logout.emit(null);
      console.log('All Data has been deleted because of first run on iOS.');
    }

    const invaildLocationReasons = LocalStorageService.getLocationInvaildForVisit();
    if (invaildLocationReasons.length > 0) {
      const latestReason = invaildLocationReasons[invaildLocationReasons.length - 1];
      if (!latestReason.endDate) {
        if (latestReason.reason === InvalidLocationReason.ForceCloseIOS) {
          LocalStorageService.updateLocationInvaildForVisit(InvalidLocationReason.ForceCloseIOS);
        } else if (latestReason.reason === InvalidLocationReason.AlwaysLocationOff) {
          LocalStorageService.updateLocationInvaildForVisit(InvalidLocationReason.AlwaysLocationOff);
        }
      }
    }

    this.page.actionBarHidden = true; // Hide action bar for Android.

    // Setting Language
    this.languageService.setLanguage(device.language);

    // This rehydrates all the States. Add another rehydrate emitter if another state is created.
    this.rehydrateApp.emit(null);

    // Checks App Version
    this.checkAppVersion.emit(null);

    this.changePasswordForm$.subscribe(changePasswordForm => {
      if (changePasswordForm) {
        console.log('Change Password? ' + changePasswordForm.Password);
        this.routerHelper.navigate(['settings/change-password']);
      }
    });

    // This is the logic that will bring the user into status, or will bring the user to login.
    this.isAuth$.subscribe((auth) => { // If auth ever changes, it will redirect the user
      if (auth) {
        console.log('Fetching all information from server....');
        this.isTokenExpired.emit(null);
        this.getClientsFromDb.emit(true); // Clients + Client contacts
        this.setADLsKeys.emit(null);          // Setting ADL Keys
        this.pullIADLsFromDB.emit(null);      // Getting IADL Keys
        this.getLastVisitFromDB.emit(null);
        this.pullMessageThreads.emit(null);
        this.setProfileInfo.emit(null);       // Gets profile information
        this.getProfilePicture.emit(null); // Gets profile picture.
        this.pullPayrollData.emit(null); // Payroll and CurrentPayroll
        this.fetchLocationAlertOptionsFromDB.emit(null);

        this.caregiver$.pipe(first()).subscribe(caregiver => {
          this.caregiverPushToken$.pipe(first()).subscribe(currentToken => {
            // Register Push Notification Token with Azure Notification Hub
            this.registerPushToken(caregiver.Id, caregiver.Uuid, currentToken);
          });
        });

        // Checks if editShift exists. If it does, that means they were in the middle of checking out and the app
        // closed on them. So we submit what they were working on.
        this.editShift$.pipe(first()).subscribe(editShift => {
          if (editShift && editShift.visit.ActionType !== SubmitActionType.Daily) {
            this.submitAction.emit(editShift);
          } else {
            this.setEditShift.emit(undefined);
          }
        });

        setTimeout(() => {
          this.getSyncScheduleFromDb.emit(null);
        }, 5000);
      } else {
        setTimeout(() => {
          this.routerExtensions.navigate(['login'], { clearHistory: true, transition: { name: 'fade' }});
        }, 200);
      }
    });

    // If connection is true tries to sync offline shifts.
    this.connection.hasInternet$.subscribe(hasInternet => {
      if (hasInternet) {
        this.syncOfflineShifts.emit(null);
        this.syncAdditionalQuestions.emit(null);
      }
    });

    // isCheckedIn is used in main.ts for iOS to check if the user is checked in or not before closing.
    this.currentVisit$.subscribe(currentVisit => {
      if (currentVisit) {
        SplashComponent.isCheckedIn = true;
      } else {
        SplashComponent.isCheckedIn = false;
      }
    });

    // This is the main LastVisit subscription. This is where the routing happenes for check ins and check outs
    this.lastVisit$.subscribe(lastVisit => {
      this.isAuth$.pipe(first()).subscribe((auth) => {
        if (!lastVisit && auth) {
          this.routerExtensions.navigate(['status/checkin'], { clearHistory: true, transition: { name: 'fade' }});
        }
        if (lastVisit && auth) {
          if (lastVisit.Visit.CheckOutTime) {
            this.routerExtensions.navigate(['status/checkin'], { clearHistory: true, transition: { name: 'fade' }});
          } else {
            const hoursSinceCheckIn = DateService.durationBetweenDates(lastVisit.Visit.CheckInTime, new Date(), 'asHours');
            if (hoursSinceCheckIn > 26) {
              this.removeCurrnetClientAndShift.emit(null);
              this.routerExtensions.navigate(['status/checkin'], { clearHistory: true, transition: { name: 'fade' }});
            } else {
              // Unsubscribing and resubscribing to timer
              this.timerService.unsubscribeFromTimer();
              this.timerService.subscribeToTimer(this.currentVisit$);

              // Verifying that client exsists. If not, subscribes twice on clients to get the most up-to-date.
              this.clients$.pipe(take(2)).subscribe(clients => {
                this.currentVisit$.pipe(first()).subscribe(currentVisit => {
                  if (currentVisit) {
                    if (clients.length > 0) {
                      this.dualClient$.pipe(first()).subscribe(dualClient => {
                        if (!dualClient) {
                          const shiftClient = clients.find(c => c.CaregiverId === lastVisit.Visit.CaregiverId);
                          if (shiftClient) {
                            console.log('Updating to Current Shift\'s Client.');
                            this.setCurrentClient.emit(shiftClient);
                          }
                        }
                        this.routerExtensions.navigate(['status/checkout'], { clearHistory: true, transition: { name: 'fade' }});
                      });
                    }
                  }
                });
              });
            }
          }
        }
      });
    });

    this.connection.startMonitoring();

    setTimeout(() => { // Using setTimeout because iOS and Android loads too fast for the alert to show.
        // Request all needed permissions when app starts
        this.checkPermissionService.requestAccessToNeededPermissions();
    }, 100);
  }

  registerPushToken(uniqueCaregiverId: number, uuid: string, currentPushToken) {
    // Instantiate Firebase Push Notifications
    messaging.registerForPushNotifications({
    onPushTokenReceivedCallback: (token: string): void => {
        console.log('Firebase plugin received a push token: ' + token);
        console.log('Currently saved push token: ' + currentPushToken);

        const platform = isAndroid ? 'Android' : 'Ios';

        // Push token object to be sent to timecardapi for registration with Azure notification hub
        const tokenObject: PushToken = {
            ContactId: uniqueCaregiverId,
            PushToken: token,
            Platform: platform,
            DeviceId: uuid,
            Delete: false
        };

        if (currentPushToken !== token) {
            console.log('New push token recognized, uploading to SPANQI');
            this.uploadPushToken.emit(tokenObject);
        } else {
            console.log('Push token matches the currently saved token, no need to upload to SPANQI');
            this.uploadPushToken.emit(tokenObject);
        }
    },

    onMessageReceivedCallback: (message: any) => {
        let payload: string;
        let title: string;
        let id = 2;

        if (isAndroid) {
            payload = message.data.message.toString();
            console.log('Incomming Push Notification Package ANDROID: ' + payload);
        } else {
            if (message.data.aps) {
                payload = message.data.aps.alert.toString();
                console.log('Incomming Push Notification Package IOS: ' + payload);
            }
        }

        if (payload) {
            if (payload.includes('check-in') || payload.includes('check-out') ||
                payload.includes('daily check out') || payload.includes('time card')) {
                console.log('Received SubmitAction Push Notification');
                title = payload;
                id = 10;
                if (!payload.includes('check-in')) {
                  this.timerService.unsubscribeFromTimer();
                }
                this.getLastVisitFromDB.emit(null);

                if (payload.includes('check-out')) {
                  this.locationHelper.disableWatchLocation();
                }
            }

            this.locationNotificationHelper.showPushNotification(id, title, payload);
        }
    },
    // Whether you want this plugin to automatically display the notifications or just notify the callback.
    // Currently used on iOS only. Default true.
    showNotifications: true,

    // Whether you want this plugin to always handle the notifications when the app is in foreground.
    // Currently used on iOS only. Default false.
    showNotificationsWhenInForeground: false
    }).then(() => console.log('Firebase registered for push notifications finished'));

    messaging.getCurrentPushToken().then(token => console.log(`Current push token after: ${token}`));
  }
}
