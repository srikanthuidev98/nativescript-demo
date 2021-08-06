"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page/page");
var nativescript_audio_1 = require("nativescript-audio");
var nativescript_camera_1 = require("nativescript-camera");
var core_2 = require("@ngx-translate/core");
var helpers_1 = require("../helpers");
var operators_1 = require("rxjs/operators");
/**
 * This service is used to check permissions for the app
 */
var CheckPermissionService = /** @class */ (function () {
    function CheckPermissionService(dialogHelper, translate) {
        this.dialogHelper = dialogHelper;
        this.translate = translate;
        this.androidShowDialog = false;
    }
    /**
     * Checks audio permission
     * Returns boolean if permission is granted or not.
     */
    CheckPermissionService.prototype.checkAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (page_1.isIOS) {
                    switch (AVAudioSession.sharedInstance().recordPermission) {
                        // case AVAudioSessionRecordPermission.Granted:
                        //   break;
                        case AVAudioSessionRecordPermission.Denied:
                            this.dialogHelper.alert('Please give AssuriCare permissions to use Microphone in order to continue ' +
                                '(System Settings -> AssuriCare -> Microphone -> Enable)', 'Please give audio permission').then(function () {
                                _this.checkAudio();
                            });
                            break;
                        case AVAudioSessionRecordPermission.Undetermined: // This is the initial state before a user has made any choice
                            AVAudioSession.sharedInstance().requestRecordPermission(function (granted) {
                                if (!granted) {
                                    _this.checkAudio();
                                }
                            });
                            break;
                    }
                }
                else {
                    this._recorder = new nativescript_audio_1.TNSRecorder();
                    if (!this._recorder.hasRecordPermission()) {
                        return [2 /*return*/, this._recorder.requestRecordPermission().then(function () { }, // Has permission
                            function () {
                                if (_this.androidShowDialog) {
                                    _this.dialogHelper.alert('AssuriCare needs permission to record shift details.', 'Please accept audio').then(function () {
                                        _this.checkAudio();
                                    });
                                }
                                else {
                                    _this.androidShowDialog = true;
                                    _this.checkAudio();
                                }
                                throw 'User does not have audio permissions.';
                            })];
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Checks camera permission
     * Returns a promise.
     * Then (Success) = has permissions
     * catch (Fail) = does not have permissions
     */
    CheckPermissionService.prototype.checkCamera = function () {
        var _this = this;
        return nativescript_camera_1.requestCameraPermissions().then(function () { }, // Has permission
        function () {
            _this.showNoPermissionDialog('CAMERA');
            throw 'User does not have camera permissions.';
        });
    };
    /**
     * Checks photo library permission
     * Returns a promise.
     * Then (Success) = has permissions
     * catch (Fail) = does not have permissions
     */
    CheckPermissionService.prototype.checkPhotos = function () {
        var _this = this;
        return nativescript_camera_1.requestPhotosPermissions().then(function () { }, // Has permission
        function () {
            _this.showNoPermissionDialog('PHOTO');
            throw 'User does not have photos permissions.';
        });
    };
    /**
     * Checks both camera and photo library permissions
     * Returns a promise.
     * Then (Success) = has permissions
     * catch (Fail) = does not have permissions
     */
    CheckPermissionService.prototype.checkCameraAndPhotos = function () {
        var _this = this;
        return nativescript_camera_1.requestPermissions().then(function () { }, // Has permission
        function () {
            _this.showNoPermissionDialog('PHOTO');
            throw 'User does not have camera and/or photos permissions.';
        });
    };
    CheckPermissionService.prototype.showNoPermissionDialog = function (permission) {
        var _this = this;
        var os = '';
        page_1.isIOS ? os = 'IOS' : os = 'ANDROID';
        this.translate.get("ALERT.PERMISSION." + os + "." + permission).pipe(operators_1.first()).subscribe(function (text) {
            _this.dialogHelper.alert(text);
        });
    };
    CheckPermissionService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [helpers_1.DialogHelper, core_2.TranslateService])
    ], CheckPermissionService);
    return CheckPermissionService;
}());
exports.CheckPermissionService = CheckPermissionService;
