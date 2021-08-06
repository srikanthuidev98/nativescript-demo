"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
/**
 * This RouterHelper is used to navigate around the app.
 *
 * Please only use this RouterHelper when navigating.
 */
var RouterHelper = /** @class */ (function () {
    function RouterHelper(router) {
        this.router = router;
    }
    /**
     * Used to replace the current view and not give the user a way to go back.
     *
     * @param commands The actual link to the component you want to go to.
     *
     * EX: ['/status/checkin']
     */
    RouterHelper.prototype.replace = function (commands) {
        this.router.navigate(commands, { clearHistory: true });
    };
    /**
     * Used to replace the current view and will let the user go back.
     *
     * @param commands The actual link to the component you want to go to.
     *
     * EX: ['/status/checkin']
     */
    RouterHelper.prototype.navigate = function (commands) {
        this.router.navigate(commands, { transition: { name: 'slide' } });
    };
    RouterHelper.prototype.backToPreviousPage = function () {
        this.router.backToPreviousPage();
    };
    RouterHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], RouterHelper);
    return RouterHelper;
}());
exports.RouterHelper = RouterHelper;
