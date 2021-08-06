"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_microsoft_appcenter_1 = require("nativescript-microsoft-appcenter");
var local_storage_1 = require("../storage/local-storage");
var LoggingService = /** @class */ (function () {
    function LoggingService() {
        this.caregiverId = '0';
        if (!this.appCenterAnalytics) {
            console.log('Setting up AppCenterAnalytics');
            this.appCenterAnalytics = new nativescript_microsoft_appcenter_1.AppCenterAnalytics;
            this.updateCaregiverId();
        }
    }
    LoggingService.prototype.updateCaregiverId = function () {
        var caregiverState = local_storage_1.LocalStorageService.getCaregiverState();
        if (caregiverState && caregiverState.caregiver) {
            this.caregiverId = "" + caregiverState.caregiver.Id;
        }
        else {
            this.caregiverId = '0';
        }
    };
    LoggingService.prototype.trackEvent = function (eventName, eventValue, updateCaregiverId) {
        if (updateCaregiverId === void 0) { updateCaregiverId = false; }
        if (updateCaregiverId) {
            this.updateCaregiverId();
        }
        var date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
            .toISOString().substr(0, 19).replace('T', ' ');
        var eventLog = date + " -> " + this.caregiverId + " - " + eventName + ": " + eventValue;
        console.log(eventLog);
        this.appCenterAnalytics.trackEvent("" + this.caregiverId, [{ key: eventName, value: eventValue }]);
    };
    LoggingService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], LoggingService);
    return LoggingService;
}());
exports.LoggingService = LoggingService;
