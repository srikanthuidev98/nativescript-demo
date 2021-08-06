"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_loading_indicator_1 = require("@nstudio/nativescript-loading-indicator");
var page_1 = require("tns-core-modules/ui/page/page");
/**
 * Helper service to provide a loading indicator for Web, Android, iOS.
 *
 * If using for a API call, please use this helper in the State files.
 */
var LoadingHelper = /** @class */ (function () {
    function LoadingHelper() {
        this.loader = new nativescript_loading_indicator_1.LoadingIndicator();
    }
    /**
     * Show loading indicator.
     *
     * *MOBILE*
     * If you want additional message details, please pass a string parameter
     */
    LoadingHelper.prototype.showIndicator = function (message) {
        if (message === void 0) { message = 'Loading...'; }
        var options;
        if (page_1.isIOS) {
            options = {
                message: message,
                margin: 30,
                dimBackground: true,
                color: '#593c81',
                userInteractionEnabled: false
            };
        }
        else {
            options = {
                message: message,
                margin: 30,
                dimBackground: true,
                color: '#ffffff',
                hideBezel: true,
                userInteractionEnabled: false
            };
        }
        this.loader.show(options);
    };
    /**
     * Hide loading indicator.
     *
     * This will hide ANY loading indicator that may be showing.
     */
    LoadingHelper.prototype.hideIndicator = function () {
        this.loader.hide();
    };
    LoadingHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [])
    ], LoadingHelper);
    return LoadingHelper;
}());
exports.LoadingHelper = LoadingHelper;
