// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';
import { TimerComponent } from './app/modules/shared/timer/timer.component';
import * as application from 'tns-core-modules/application';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { AppCenterSettings, AppCenter } from 'nativescript-microsoft-appcenter';
import { currentEnvironment } from './ACCommon/config/app-config.module';
import { LocalStorageService } from './ACCommon/storage/local-storage';
import { SplashComponent } from './app/splash/splash.component';
import { InvalidLocationReason } from './ACCommon/enums';

const firebase = require('nativescript-plugin-firebase');

application.on(application.suspendEvent, () => { // This is cancelling the animation on TimerComponent if app is suspended.
    if (TimerComponent.animation !== undefined) {
        TimerComponent.animation.cancel();
    }
});

application.on(application.exitEvent, (args) => {
  if (isIOS && SplashComponent.isCheckedIn) {
      console.log('Setting iOS Force close flag.');

      LocalStorageService.addLocationInvaildForVisit(InvalidLocationReason.ForceCloseIOS);
  }
});

firebase.addOnPushTokenReceivedCallback(
    function(token) {
      console.log('Firebase Token: ' + token);
    }
  );

  firebase.getCurrentPushToken().then((token: any) => {
    // may be null if not known yet
    console.log(`Current Firebase push token: ${token}`);
  });


  firebase.init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
  }).then(
    () => {
      console.log('firebase.init done');

    },
    error => {
      console.log(`firebase.init error: ${error}`);
    }
  );


if (isIOS) {
    const appCenterSettings: AppCenterSettings = {
        analytics: true,
        crashes: true
    };

    if (currentEnvironment === 'Production') {
        appCenterSettings.appSecret = '0a1e3804-b0bc-4bb2-8b23-1726ae3f3d37';
    } else if (currentEnvironment === 'Integration') {
        appCenterSettings.appSecret = '367beec6-9413-4e0a-abba-f328f147ee0e';
    } else if (currentEnvironment === 'Release1') {
      appCenterSettings.appSecret = '8762e9e0-d976-4bc3-9c5b-40ec499d1957';
    } else {
        appCenterSettings.appSecret = '84e84c2e-ec5a-4c0b-bb82-b28a6f7e9ff4';
    }

    const appCenter = new AppCenter();
    appCenter.start(appCenterSettings);
}

// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object,
// platformNativeScriptDynamic, that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);
