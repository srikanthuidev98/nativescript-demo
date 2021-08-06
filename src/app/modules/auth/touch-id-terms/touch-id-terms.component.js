"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialogs_1 = require("nativescript-angular/directives/dialogs");
var fingerprint_service_1 = require("../../../../ACCommon/services/fingerprint.service");
var TouchIdTermsComponent = /** @class */ (function () {
    function TouchIdTermsComponent(mParams, fingerprintService) {
        this.mParams = mParams;
        this.fingerprintService = fingerprintService;
    }
    TouchIdTermsComponent.prototype.ngOnInit = function () { };
    TouchIdTermsComponent.prototype.acceptTap = function () {
        this.mParams.closeCallback('accept');
    };
    TouchIdTermsComponent.prototype.declineTap = function () {
        this.mParams.closeCallback('decline');
    };
    TouchIdTermsComponent = __decorate([
        core_1.Component({
            selector: 'app-touch-id-terms',
            templateUrl: './touch-id-terms.component.html',
            styleUrls: ['./touch-id-terms.component.scss']
        }),
        __metadata("design:paramtypes", [dialogs_1.ModalDialogParams, fingerprint_service_1.FingerprintService])
    ], TouchIdTermsComponent);
    return TouchIdTermsComponent;
}());
exports.TouchIdTermsComponent = TouchIdTermsComponent;
