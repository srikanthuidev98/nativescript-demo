"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var emitter_1 = require("@ngxs-labs/emitter");
var states_1 = require("../../../../ACCommon/states");
var helpers_1 = require("../../../../ACCommon/helpers");
var fingerprint_service_1 = require("../../../../ACCommon/services/fingerprint.service");
var touch_id_terms_component_1 = require("../../auth/touch-id-terms/touch-id-terms.component");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(routerHelper, fingerprintService, switchHelper, dialog, modalHelper, vcRef) {
        this.routerHelper = routerHelper;
        this.fingerprintService = fingerprintService;
        this.switchHelper = switchHelper;
        this.dialog = dialog;
        this.modalHelper = modalHelper;
        this.vcRef = vcRef;
        this.fingerprintEnabled = false;
        this.fingerprintString = '';
    }
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.fingerprintEnabled = this.fingerprintService.isFingerprintEnabled();
        this.fingerprintService.fingerprintStringType().then(function (type) {
            _this.fingerprintString = type;
        });
    };
    SettingsComponent.prototype.onCheckedChange = function (args) {
        this.switchHelper.switch(args);
    };
    SettingsComponent.prototype.linkTap = function (link) {
        var _this = this;
        switch (link) {
            case 1: // Frequently Asked Questions
                this.routerHelper.navigate(['settings/faq']);
                break;
            case 2: // Customer Support
                this.routerHelper.navigate(['/settings/contact-us', { from: 'settings' }]);
                break;
            case 3: // Report a Bug
                break;
            case 4: // Rate This App
                break;
            case 5: // Privacy Policy
                helpers_1.RedirectHelper.openPrivacyPolicyWebpage();
                break;
            case 6: // Terms of Use
                helpers_1.RedirectHelper.openTermsOfUseWebpage();
                break;
            case 7: // Enable Fingerprint
                if (this.fingerprintEnabled) { // Fingerprint is enabled.
                    this.dialog.confirmAlert("Are you sure you want to disable " + this.fingerprintString + " sign on?", "Disable " + this.fingerprintString, 'Confirm', 'Cancel').then(function (result) {
                        if (result) {
                            _this.fingerprintEnabled = false;
                            _this.fingerprintService.removeFingerprint();
                        }
                    });
                }
                else { // Fingerprint is disabled or not been set up.
                    this.modalHelper.openFullscreenModal(touch_id_terms_component_1.TouchIdTermsComponent, this.vcRef).then(function (res) {
                        if (res === 'accept') {
                            _this.fingerprintService.setUpFingerprint().then(function () {
                                _this.fingerprintEnabled = true;
                            }).catch(function (e) {
                                console.log(e);
                            });
                        }
                    });
                }
                break;
            case 8: // Change Password
                this.routerHelper.navigate(['/settings/change-password']);
                break;
            case 9: // Log Out
                this.logout.emit();
                break;
            default:
                console.log('Incorrect link number was passed.');
                break;
        }
    };
    __decorate([
        emitter_1.Emitter(states_1.CaregiverState.logout),
        __metadata("design:type", Object)
    ], SettingsComponent.prototype, "logout", void 0);
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.component.html',
            styleUrls: ['./settings.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.RouterHelper, fingerprint_service_1.FingerprintService,
            helpers_1.SwitchHelper, helpers_1.DialogHelper,
            helpers_1.ModalHelper, core_1.ViewContainerRef])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
