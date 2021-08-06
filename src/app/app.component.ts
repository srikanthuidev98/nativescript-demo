import { Component, OnInit } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';

import { RadSideDrawer, DrawerTransitionBase, SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
import { RouterExtensions } from 'nativescript-angular/router';
import * as app from 'tns-core-modules/application';

import { AppState } from '../ACCommon/states/app.state';
import { Caregiver, Client, LastVisit } from '../ACCommon/models';
import { LocationHelper } from '../ACCommon/helpers';
import { PushToken } from '../ACCommon/models/push-token.model';
import { currentEnvironment, updateEnvironmentAndEndpoint, currentEnvironmentSubject } from '../ACCommon/config/app-config.module';
import { isAndroid } from 'tns-core-modules/ui/page/page';
import { AppCenter, AppCenterSettings } from 'nativescript-microsoft-appcenter';
import { LocalStorageService } from '../ACCommon/storage/local-storage';
import { getVersionName } from 'nativescript-appversion';
import { DateService } from '../ACCommon/services/date.service';
import { handleOpenURL, AppURL } from 'nativescript-urlhandler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Select(AppState.getSavedLastVisit) lastVisit$: Observable<LastVisit>;
  @Select(AppState.getIsAuth) isAuth$: Observable<boolean>;
  @Select(AppState.getClients) clients$: Observable<Client[]>;
  @Select(AppState.getCaregiver) caregiver$: Observable<Caregiver>;
  @Select(AppState.getPushToken) caregiverPushToken$: Observable<string>;
  @Select(AppState.getScheduleEnabled) scheduleEnabled$: Observable<boolean>;
  @Select(AppState.getMessagingEnabled) messagingEnabled$: Observable<boolean>;
  @Select(AppState.getUnreadMessages) unreadMessages$: Observable<number>;

  @Emitter(AppState.logout)
  public logout: Emittable<null>;

  @Emitter(AppState.deletePushToken)
  public deletePushToken: Emittable<PushToken>;

  private _activatedUrl: string;
  private _sideDrawerTransition: DrawerTransitionBase;

  public appVersion = '';
  public deviceId: string;

  constructor(private locationHelper: LocationHelper, private router: Router, private routerExtensions: RouterExtensions) {}

  ngOnInit(): void {
    // This is used for links that open the app outside of the app.
    handleOpenURL((appURL: AppURL) => {
      console.log('Got the following appURL', appURL);
    });
    const savedEnvironment = LocalStorageService.getEnvironment();
    if (savedEnvironment) {
        updateEnvironmentAndEndpoint(savedEnvironment);
    }

    if (isAndroid) {
      const appCenter: AppCenter = new AppCenter();

      const appCenterSettings: AppCenterSettings = {
        analytics: true,
        crashes: true
      };

      if (currentEnvironment === 'Production') {
        appCenterSettings.appSecret = 'fa70c6bc-d16e-4402-a700-cd0a8b520d7a';
      } else if (currentEnvironment === 'Integration') {
        appCenterSettings.appSecret = '05f90916-8728-4ca6-84ba-c6d388bc9db2';
      } else if (currentEnvironment === 'Release1') {
        appCenterSettings.appSecret = 'f20c255a-9662-4dc6-b957-67ff1a1f55dd';
      } else {
        appCenterSettings.appSecret = 'b0aecec0-5fda-4b37-b1d8-55d6e954277c';
      }

      appCenter.start(appCenterSettings);
    }

    this.routerExtensions.navigate(['splash'], { clearHistory: true});

    this._activatedUrl = '';
    this._sideDrawerTransition = new SlideInOnTopTransition();

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);


    getVersionName().then((version: string) => {
      currentEnvironmentSubject.subscribe(envrio => {
        if (envrio === 'Production') {
          this.appVersion = `Version ${version}`;
        } else {
          this.appVersion = `${envrio}: Version ${version}`;
        }
      });
    });
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  isComponentSelected(url: string): boolean {
      return this._activatedUrl === url;
  }

  onNavItemTap(navItemRoute: string): void {
    let route = navItemRoute;
    if (route === '/status/') {
      this.lastVisit$.pipe(first()).subscribe(lastVisit => {
        if (!lastVisit) {
          route = '/status/checkin';
        }
        const hoursSinceCheckIn = DateService.durationBetweenDates(lastVisit.Visit.CheckInTime, new Date(), 'asHours');
        if (lastVisit.Visit.CheckOutTime || hoursSinceCheckIn > 26) {
          route = '/status/checkin';
        } else {
          route = '/status/checkout';
        }
      });
    }
    this.routerExtensions.navigate([route], {
      transition: { name: 'fade' },
      clearHistory: true
    });

    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  logoutTap() {
    this.locationHelper.disableWatchLocation();
    this.deleteTokenRegistration();
    this.logout.emit(null);
    // this.routerExtensions.navigate(['/login'], { clearHistory: true, transition: { name: 'fade' }});
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  deleteTokenRegistration() {
    this.caregiver$.pipe(first()).subscribe(caregiver => {
      this.caregiverPushToken$.pipe(first()).subscribe(currentToken => {
        console.log(`Get Current Token to delete ${currentToken}`);

        const tokenObject: PushToken = {
          ContactId: null,
          PushToken: currentToken,
          Platform: '',
          DeviceId: caregiver.Uuid,
          Delete: true
        };

        console.log('Delete push Token');
        this.deletePushToken.emit(tokenObject);
      });
    });
  }
}
