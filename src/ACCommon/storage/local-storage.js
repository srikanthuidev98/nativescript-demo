"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ac_secure_storage_1 = require("./ac-secure-storage");
var application_settings_1 = require("tns-core-modules/application-settings");
var LocalStorageService = /** @class */ (function () {
    function LocalStorageService() {
    }
    LocalStorageService.setCaregiverState = function (state) {
        ac_secure_storage_1.AcSecureStorage.set('caregiverState', state);
    };
    LocalStorageService.getCaregiverState = function () {
        return ac_secure_storage_1.AcSecureStorage.get('caregiverState');
    };
    LocalStorageService.setHistoryState = function (state) {
        ac_secure_storage_1.AcSecureStorage.set('historyState', state);
    };
    LocalStorageService.getHistoryState = function () {
        return ac_secure_storage_1.AcSecureStorage.get('historyState');
    };
    LocalStorageService.setShiftState = function (state) {
        ac_secure_storage_1.AcSecureStorage.set('shiftState', state);
    };
    LocalStorageService.getShiftState = function () {
        return ac_secure_storage_1.AcSecureStorage.get('shiftState');
    };
    LocalStorageService.setEmail = function (email) {
        ac_secure_storage_1.AcSecureStorage.set('email', email);
    };
    LocalStorageService.getEmail = function () {
        return ac_secure_storage_1.AcSecureStorage.get('email');
    };
    LocalStorageService.setEnvironment = function (environment) {
        ac_secure_storage_1.AcSecureStorage.set('environment', environment);
    };
    LocalStorageService.getEnvironment = function () {
        return ac_secure_storage_1.AcSecureStorage.get('environment');
    };
    LocalStorageService.setFingerprintData = function (data) {
        ac_secure_storage_1.AcSecureStorage.set('fingerprintData', data);
    };
    LocalStorageService.getFingerprintData = function () {
        return ac_secure_storage_1.AcSecureStorage.get('fingerprintData');
    };
    LocalStorageService.setOtherDataOnLogout = function () {
        var email = LocalStorageService.getEmail();
        var fingerprintData = LocalStorageService.getFingerprintData();
        if (email) {
            LocalStorageService.setEmail(email);
        }
        if (fingerprintData) {
            LocalStorageService.setFingerprintData(fingerprintData);
        }
    };
    LocalStorageService.isFirstRun = function () {
        var isFirst = application_settings_1.getBoolean('isFirst', true);
        if (isFirst) {
            console.log('Is first run. Deleting all data on iOS.');
            application_settings_1.setBoolean('isFirst', false);
            LocalStorageService.setEmail('');
            LocalStorageService.setFingerprintData(null);
            return true;
        }
        return false;
    };
    return LocalStorageService;
}());
exports.LocalStorageService = LocalStorageService;
