"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("tns-core-modules/utils/utils");
var page_1 = require("tns-core-modules/ui/page/page");
var app = require("tns-core-modules/application");
var api_helper_service_1 = require("../services/data/api-helper.service");
/**
 * Used to let the user navigate outside of the app for Android and iOS.
 */
var RedirectHelper = /** @class */ (function () {
    function RedirectHelper() {
    }
    /**
     * Will navigate to the settings.
     */
    RedirectHelper.goToAppSettings = function () {
        if (page_1.isAndroid) {
            app.android.foregroundActivity.startActivity(new android.content.Intent(android.provider.Settings.ACTION_SETTINGS));
        }
        else {
            utils.openUrl('App-prefs:root=General');
        }
    };
    /**
     * Will open url to the Privacy Policy Webpage
     */
    RedirectHelper.openPrivacyPolicyWebpage = function () {
        utils.openUrl(api_helper_service_1.ApiHelperService.privacyPolicyUrl);
    };
    /**
     * Will open url to the Terms of use Webpage
     */
    RedirectHelper.openTermsOfUseWebpage = function () {
        utils.openUrl(api_helper_service_1.ApiHelperService.termsAndConditionsUrl);
    };
    return RedirectHelper;
}());
exports.RedirectHelper = RedirectHelper;
