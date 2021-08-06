"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page/page");
var enums_1 = require("../enums");
var nativescript_appversion_1 = require("nativescript-appversion");
var rxjs_1 = require("rxjs");
var appConfig = global.TNS_WEBPACK ?
    require("../environments/mobile/app.config." + global.ENV_NAME + ".json") :
    require('./app.config.dev.json');
page_1.isAndroid ? appConfig.appType = enums_1.AppType.Android : appConfig.appType = enums_1.AppType.iOS;
// Only used for local API testing
// appConfig.apiEndpoint = 'http://jfowler-lap.ad.assuricare.com:50787/api/';
console.log('APPTYPE', appConfig.appType);
console.log('ENDPOINT', appConfig.apiEndpoint);
/**
 * This will give you the current app version number only
 */
exports.currentAppVersionNumber = '0.0.0';
exports.currentEnvironment = appConfig.environment.toString();
/**
 * BehaviorSubject
 * Subscribe to get the current Endpoint. (Defaults to appConfig.apiEndpoint)
 */
exports.currentEndpoint = new rxjs_1.BehaviorSubject(appConfig.apiEndpoint);
exports.currentNewEndpoint = new rxjs_1.BehaviorSubject(appConfig.newApiEndpoint);
exports.currentEnvironmentSubject = new rxjs_1.BehaviorSubject(appConfig.environment.toString());
function updateEnvironmentAndEndpoint(environment) {
    if (environment === 'Production') {
        return;
    }
    if (environment === 'Release1') {
        exports.currentEnvironment = 'Release1';
        exports.currentEnvironmentSubject.next('Release1');
        exports.currentEndpoint.next('https://release1.assuricare.com/MobileRestAPI/api/');
        exports.currentNewEndpoint.next('https://release1.assuricare.com/AssuriCareAPI/External/');
    }
    else if (environment === 'Integration') {
        exports.currentEnvironment = 'Integration';
        exports.currentEnvironmentSubject.next('Integration');
        exports.currentEndpoint.next('https://uat.assuricare.com/MobileRestAPI/api/');
        exports.currentNewEndpoint.next('https://uat.assuricare.com/AssuriCareAPI/External/');
    }
    else {
        exports.currentEnvironment = 'Dev';
        exports.currentEnvironmentSubject.next('Dev');
        exports.currentEndpoint.next('https://test.assuricare.com/MobileRestAPI/api/');
        exports.currentNewEndpoint.next('https://test.assuricare.com/AssuriCareAPI/External/');
    }
    console.log(exports.currentEnvironment, exports.currentEndpoint.getValue());
}
exports.updateEnvironmentAndEndpoint = updateEnvironmentAndEndpoint;
if (exports.currentEnvironment !== 'Dev') {
    core_1.enableProdMode();
}
nativescript_appversion_1.getVersionName().then(function (version) {
    exports.currentAppVersionNumber = version;
});
exports.APP_CONFIG = new core_1.InjectionToken('app.config');
var AppConfigModule = /** @class */ (function () {
    function AppConfigModule() {
    }
    AppConfigModule = __decorate([
        core_1.NgModule({
            providers: [
                { provide: exports.APP_CONFIG, useValue: appConfig },
            ],
        })
    ], AppConfigModule);
    return AppConfigModule;
}());
exports.AppConfigModule = AppConfigModule;
