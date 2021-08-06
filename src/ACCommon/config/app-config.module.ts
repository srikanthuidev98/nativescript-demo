import { NgModule, InjectionToken, enableProdMode } from '@angular/core';
import { AppConfig } from '../models/core/app-config.model';
import { isAndroid } from 'tns-core-modules/ui/page/page';
import { AppType } from '../enums';

import { getVersionName } from 'nativescript-appversion';
import { BehaviorSubject } from 'rxjs';

// To suppress fake errors.
declare var global;

const appConfig = global.TNS_WEBPACK ?
    <AppConfig>require(`../environments/mobile/app.config.${global.ENV_NAME}.json`) :
    <AppConfig>require('./app.config.dev.json');


isAndroid ? appConfig.appType = AppType.Android : appConfig.appType = AppType.iOS;

// Only used for local API testing
// appConfig.apiEndpoint = 'http://jfowler-lap.ad.assuricare.com:50787/api/';

console.log('APPTYPE', appConfig.appType);
console.log('ENDPOINT', appConfig.apiEndpoint);

export let currentEnvironment = appConfig.environment.toString();

/**
 * BehaviorSubject
 * Subscribe to get the current Endpoint. (Defaults to appConfig.apiEndpoint)
 */
export let currentEndpoint = new BehaviorSubject<string>(appConfig.apiEndpoint);
export let currentNewEndpoint = new BehaviorSubject<string>(appConfig.newApiEndpoint);
export let currentCareWhenEndpoint = new BehaviorSubject<string>(appConfig.careWhenEndpoint);
export let currentEnvironmentSubject = new BehaviorSubject<string>(appConfig.environment.toString());

export function updateEnvironmentAndEndpoint(environment: string) {
    if (environment === 'Production') {
        return;
    }

    if (environment === 'Release1') {
        currentEnvironment = 'Release1';
        currentEnvironmentSubject.next('Release1');
        currentEndpoint.next('https://release1.assuricare.com/MobileRestAPI/api/');
        currentNewEndpoint.next('https://release1.assuricare.com/AssuriCareAPI/External/');
        currentCareWhenEndpoint.next('https://apirel.registryconnect.com/api/');
    } else if (environment === 'Integration') {
        currentEnvironment = 'Integration';
        currentEnvironmentSubject.next('Integration');
        currentEndpoint.next('https://uat.assuricare.com/MobileRestAPI/api/');
        currentNewEndpoint.next('https://uat.assuricare.com/AssuriCareAPI/External/');
        currentCareWhenEndpoint.next('https://apiint.registryconnect.com/api/');
    } else {
        currentEnvironment = 'Dev';
        currentEnvironmentSubject.next('Dev');
        currentEndpoint.next('https://dev.assuricare.com/MobileRestAPI/api/');
        currentNewEndpoint.next('https://dev.assuricare.com/AssuriCareAPI/External/');
        currentCareWhenEndpoint.next('https://apiint.registryconnect.com/api/');
    }

    console.log(currentEnvironment, currentEndpoint.getValue());
}

if (currentEnvironment !== 'Dev') {
    enableProdMode();
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

@NgModule({
    providers: [
        { provide: APP_CONFIG, useValue: appConfig },
    ],
})
export class AppConfigModule { }
