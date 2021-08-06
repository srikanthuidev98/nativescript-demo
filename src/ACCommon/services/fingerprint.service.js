"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_fingerprint_auth_1 = require("nativescript-fingerprint-auth");
var helpers_1 = require("../helpers");
var states_1 = require("../states");
var emitter_1 = require("@ngxs-labs/emitter");
var store_1 = require("@ngxs/store");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var local_storage_1 = require("../storage/local-storage");
var page_1 = require("tns-core-modules/ui/page/page");
var FingerprintService = /** @class */ (function () {
    function FingerprintService(dialogHelper) {
        var _this = this;
        this.dialogHelper = dialogHelper;
        this.fingerprintString = '';
        this.fingerprintAuth = new nativescript_fingerprint_auth_1.FingerprintAuth();
        this.fingerprintStringType().then(function (type) {
            _this.fingerprintString = type;
        });
    }
    FingerprintService.prototype.available = function () {
        return this.fingerprintAuth.available().then(function (result) {
            console.log("Biometric ID available1? " + result.any);
            console.log("Touch? " + result.touch);
            console.log("Face? " + result.face);
            if (result.touch) {
                return 'touch';
            }
            else if (result.face) {
                return 'face';
            }
            return undefined;
        });
    };
    FingerprintService.prototype.fingerprintStringType = function () {
        return this.fingerprintAuth.available().then(function (result) {
            var type = 'Fingerprint';
            if (page_1.isIOS) {
                type = 'Touch ID';
            }
            else {
                type = 'Fingerprint';
            }
            if (result.face) {
                type = 'Face ID';
            }
            return type;
        });
    };
    FingerprintService.prototype.isFingerprintEnabled = function () {
        var data = local_storage_1.LocalStorageService.getFingerprintData();
        if (data && data.Name !== 'temp') {
            return true;
        }
        else {
            return false;
        }
    };
    FingerprintService.prototype.loginFingerprintSetup = function () {
        var _this = this;
        return this.fingerprintAuth.available().then(function (result) {
            if (result.any) {
                return _this.fingerprintAuth.verifyFingerprint({
                    message: "Set up " + _this.fingerprintString,
                    authenticationValidityDuration: 10,
                    useCustomAndroidUI: true // set to true to use a different authentication screen (see below)
                })
                    .then(function () {
                    var caregiverTemp = {
                        Name: 'temp',
                        Token: 'temp',
                        Id: 0
                    };
                    local_storage_1.LocalStorageService.setFingerprintData(caregiverTemp); // Creating temp caregiver
                })
                    .catch(function (err) {
                    _this.dialogHelper.alert(_this.fingerprintString + " not recognised, please try again", 'Fail', 'Close');
                    console.log("Biometric ID NOT OK: " + JSON.stringify(err));
                    throw _this.fingerprintString + " not recognised";
                });
            }
            else {
                _this.showNoFingerprintDialog();
            }
        });
    };
    FingerprintService.prototype.setUpFingerprint = function () {
        var _this = this;
        return this.fingerprintAuth.available().then(function (result) {
            if (result.any) {
                return _this.fingerprintAuth.verifyFingerprint({
                    message: "Set up " + _this.fingerprintString,
                    authenticationValidityDuration: 10,
                    useCustomAndroidUI: true // set to true to use a different authentication screen (see below)
                })
                    .then(function () {
                    _this.caregiver$.pipe(operators_1.first()).subscribe(function (caregiver) {
                        local_storage_1.LocalStorageService.setFingerprintData(caregiver);
                        // this.updateFingerprintData.emit(caregiver);
                        _this.dialogHelper.alert(_this.fingerprintString + " enabled!", 'Success!', 'Close');
                        Promise.resolve();
                    });
                })
                    .catch(function (err) {
                    _this.dialogHelper.alert(_this.fingerprintString + " not recognised, please try again", 'Fail', 'Close');
                    console.log("Biometric ID NOT OK: " + JSON.stringify(err));
                    throw 'Fingerprint not recognised';
                });
            }
            else {
                _this.showNoFingerprintDialog();
            }
        });
    };
    FingerprintService.prototype.showNoFingerprintDialog = function () {
        var _this = this;
        var timeout = 0;
        if (page_1.isIOS) { // iOS needs a timeout because of the animation with the modal is blocking the alert from appearing.
            timeout = 600;
        }
        setTimeout(function () {
            _this.dialogHelper.alert("It looks like there is no " + _this.fingerprintString + " saved on this device." +
                ("Please go to your device Settings > Security and enroll your " + _this.fingerprintString), "No " + _this.fingerprintString + " Found", 'Close');
        }, timeout);
        throw 'No fingerprints';
    };
    FingerprintService.prototype.removeFingerprint = function () {
        local_storage_1.LocalStorageService.setFingerprintData(null);
    };
    FingerprintService.prototype.verifyFingerprint = function () {
        var _this = this;
        this.fingerprintAuth.available().then(function (result) {
            if (!result) {
                return;
            }
            _this.fingerprintAuth.didFingerprintDatabaseChange().then(function (changed) {
                if (changed) { // Fingerprint has changed on iOS, need to re-authenticate user
                    _this.removeFingerprint();
                    _this.dialogHelper.alert('Please re-login using your email and password.', _this.fingerprintString + " data has changed", 'Close');
                }
                else {
                    var message = '';
                    if (result.face) {
                        message = 'Use Face ID to continue.';
                    }
                    else {
                        message = "Place your finger on your device's " + _this.fingerprintString + " sensor to continue";
                    }
                    _this.fingerprintAuth.verifyFingerprint({
                        message: message,
                        authenticationValidityDuration: 10,
                        useCustomAndroidUI: true // set to true to use a different authentication screen (see below)
                    })
                        .then(function () {
                        _this.fingerprintLogin.emit();
                    })
                        .catch(function (err) {
                        _this.dialogHelper.alert('Please re-login using your email and password.', _this.fingerprintString + " not recognised", 'Close');
                        console.log("Biometric ID NOT OK: " + JSON.stringify(err));
                    });
                }
            });
        });
    };
    __decorate([
        store_1.Select(states_1.CaregiverState.getCaregiver),
        __metadata("design:type", rxjs_1.Observable)
    ], FingerprintService.prototype, "caregiver$", void 0);
    __decorate([
        emitter_1.Emitter(states_1.CaregiverState.fingerprintLogin),
        __metadata("design:type", Object)
    ], FingerprintService.prototype, "fingerprintLogin", void 0);
    FingerprintService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [helpers_1.DialogHelper])
    ], FingerprintService);
    return FingerprintService;
}());
exports.FingerprintService = FingerprintService;
