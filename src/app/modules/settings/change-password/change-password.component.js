"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var validate_service_1 = require("../../../../ACCommon/services/validate.service");
var emitter_1 = require("@ngxs-labs/emitter");
var states_1 = require("../../../../ACCommon/states");
var helpers_1 = require("../../../../ACCommon/helpers");
var store_1 = require("@ngxs/store");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ChangePasswordComponent = /** @class */ (function () {
    function ChangePasswordComponent(validateService, toolsHelper, routerHelper) {
        this.validateService = validateService;
        this.toolsHelper = toolsHelper;
        this.routerHelper = routerHelper;
        this.currentPass = '';
        this.newPass = '';
        this.confirmPass = '';
        this.strength = 0;
        this.strengthText = '';
        this.strengthTextColor = '#e00720';
        this.lengthLabelColor = '#6d7278';
        this.lettersLabelColor = '#6d7278';
        this.numberSymbolLabelColor = '#6d7278';
        this.errorText = '';
        this.oldPass = '';
        this.enableBtn = false;
    }
    ChangePasswordComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.changePasswordForm$.pipe(operators_1.first()).subscribe(function (changePassForm) {
            _this.oldPass = changePassForm.Password;
        });
    };
    ChangePasswordComponent.prototype.valueChanged = function (value, type) {
        this.enableBtn = false;
        if (type === 'current') {
            this.currentPass = value;
        }
        else if (type === 'new') {
            this.newPass = value;
            this.updateView(value);
        }
        else {
            this.confirmPass = value;
        }
        if (this.currentPass && this.newPass && this.confirmPass && this.strength === 3) {
            this.enableBtn = true;
        }
    };
    ChangePasswordComponent.prototype.updateView = function (text) {
        var result = this.validateService.validateNewPassword(text);
        this.strength = 0;
        if (result.length) {
            this.strength++;
            this.lengthLabelColor = '#038424';
        }
        else {
            this.lengthLabelColor = '#6d7278';
        }
        if (result.letters) {
            this.strength++;
            this.lettersLabelColor = '#038424';
        }
        else {
            this.lettersLabelColor = '#6d7278';
        }
        if (result.numberSymbol) {
            this.strength++;
            this.numberSymbolLabelColor = '#038424';
        }
        else {
            this.numberSymbolLabelColor = '#6d7278';
        }
        switch (this.strength) {
            case 0:
                this.strengthText = '';
                break;
            case 1:
                this.strengthText = 'Weak';
                this.strengthTextColor = '#e00720';
                break;
            case 2:
                this.strengthText = 'Good';
                this.strengthTextColor = '#593c81';
                break;
            case 3:
                this.strengthText = 'Strong';
                this.strengthTextColor = '#038424';
                break;
        }
    };
    ChangePasswordComponent.prototype.confirmTap = function () {
        this.toolsHelper.closeKeyboard();
        this.errorText = '';
        if (/['"]/g.test(this.newPass)) {
            this.errorText = 'Passwords cannot contain \' or \"';
            return;
        }
        if (this.newPass !== this.confirmPass) {
            this.errorText = 'Your Passwords do not match';
            return;
        }
        var resetForm = {
            OldPassword: this.currentPass,
            NewPassword: this.newPass
        };
        this.resetPassword.emit(resetForm);
    };
    __decorate([
        store_1.Select(states_1.CaregiverState.getChangePasswordForm),
        __metadata("design:type", rxjs_1.Observable)
    ], ChangePasswordComponent.prototype, "changePasswordForm$", void 0);
    __decorate([
        emitter_1.Emitter(states_1.CaregiverState.resetPassword),
        __metadata("design:type", Object)
    ], ChangePasswordComponent.prototype, "resetPassword", void 0);
    ChangePasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-change-password',
            templateUrl: './change-password.component.html',
            styleUrls: ['./change-password.component.scss']
        }),
        __metadata("design:paramtypes", [validate_service_1.ValidateService, helpers_1.ToolsHelper, helpers_1.RouterHelper])
    ], ChangePasswordComponent);
    return ChangePasswordComponent;
}());
exports.ChangePasswordComponent = ChangePasswordComponent;
