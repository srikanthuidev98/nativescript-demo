"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var page_1 = require("tns-core-modules/ui/page/page");
/**
 * Only used for Mobile. This is a way to hide the action bar for Android on the login page.
 */
var HideActionBarDirective = /** @class */ (function () {
    function HideActionBarDirective(page) {
        this.page = page;
        this.page.actionBarHidden = true;
    }
    HideActionBarDirective = __decorate([
        core_1.Directive({
            selector: '[appHideActionBar]'
        }),
        __metadata("design:paramtypes", [page_1.Page])
    ], HideActionBarDirective);
    return HideActionBarDirective;
}());
exports.HideActionBarDirective = HideActionBarDirective;
