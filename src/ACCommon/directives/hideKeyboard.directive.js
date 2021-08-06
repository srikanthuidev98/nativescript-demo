"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page/page");
var nativescript_swiss_army_knife_1 = require("nativescript-swiss-army-knife/nativescript-swiss-army-knife");
/**
 * Only used for Mobile. This is used to dismiss the keyboard by touching outside of the keyboard.
 *
 * Add this directive at the root layout of any component to give this functionality to the component.
 */
var HideKeyboardDirective = /** @class */ (function () {
    function HideKeyboardDirective() {
        if (page_1.isIOS && !this.iqKeyboard) {
            this.iqKeyboard = IQKeyboardManager.sharedManager();
            this.iqKeyboard.shouldResignOnTouchOutside = true;
        }
    }
    HideKeyboardDirective.prototype.onTap = function () {
        if (!page_1.isIOS) {
            nativescript_swiss_army_knife_1.SwissArmyKnife.dismissSoftKeyboard();
        }
    };
    __decorate([
        core_1.HostListener('tap'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], HideKeyboardDirective.prototype, "onTap", null);
    HideKeyboardDirective = __decorate([
        core_1.Directive({
            selector: '[appHideKeyboard]'
        }),
        __metadata("design:paramtypes", [])
    ], HideKeyboardDirective);
    return HideKeyboardDirective;
}());
exports.HideKeyboardDirective = HideKeyboardDirective;
