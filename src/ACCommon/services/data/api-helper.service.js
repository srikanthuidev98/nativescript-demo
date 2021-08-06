"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var logging_service_1 = require("../logging.service");
var app_config_module_1 = require("../../config/app-config.module");
/**
 * This static service is used to grab the header for API calls.
 *
 * !!Only use this class in API services!!
 */
var ApiHelperService = /** @class */ (function () {
    function ApiHelperService(logger) {
        var _this = this;
        this.logger = logger;
        app_config_module_1.currentEndpoint.subscribe(function (newEndpoint) {
            _this.endpoint = newEndpoint;
        });
        app_config_module_1.currentNewEndpoint.subscribe(function (newEndpoint) {
            _this.newApiEndpoint = newEndpoint;
        });
    }
    // The reason why we grabbing the URL with a function is to be able to dynamically change the URL
    // ********** Old Endpoint URLS **********
    // Authentication
    ApiHelperService.prototype.authenticationUrl = function () { return this.endpoint + "Authentication/LogIn"; };
    ApiHelperService.prototype.resetPasswordUrl = function () { return this.endpoint + "Authentication/ResetPassword"; };
    ApiHelperService.prototype.recoverPasswordUrl = function () { return this.endpoint + "Authentication/RecoverPassword"; };
    ApiHelperService.prototype.getUserAuthorizationStatusUrl = function () { return this.endpoint + "Authentication/GetAuthorizationStatus"; };
    // Histories
    ApiHelperService.prototype.historyUrl = function () { return this.endpoint + "Histories/GetHistories"; };
    ApiHelperService.prototype.getLastShiftsUrl = function () { return this.endpoint + "Histories/GetLastShifts"; };
    // Clients
    ApiHelperService.prototype.clientsUrl = function () { return this.endpoint + "Clients/Get"; };
    // Profile
    ApiHelperService.prototype.profileUrl = function () { return this.endpoint + "Profile/Get"; };
    ApiHelperService.prototype.uploadPictureUrl = function () { return this.endpoint + "Profile/UploadPicture"; };
    ApiHelperService.prototype.deletePictureUrl = function () { return this.endpoint + "Profile/DeletePicture"; };
    ApiHelperService.prototype.getPictureUrl = function () { return this.endpoint + "Profile/GetPicture"; };
    // ETC
    ApiHelperService.prototype.IADLSUrl = function () { return this.endpoint + "IADLS/Get"; };
    ApiHelperService.prototype.locationHistoryUrl = function () { return this.endpoint + "LocationServicesLog/Create"; };
    ApiHelperService.prototype.pushTokenUploadUrl = function () { return this.endpoint + "PushToken/Register"; };
    // API endpoints with URL GET data
    ApiHelperService.prototype.getHistoryDetailUrl = function (startTime, caregiverId) {
        return this.endpoint + "Histories/GetDetail?startTime=" + startTime + "&caregiverId=" + caregiverId;
    };
    ApiHelperService.prototype.getHistoryDetailAdjustmentsUrl = function (procdate, caregiverId) {
        return this.endpoint + "Histories/GetDetailsWithAdjustments?procdate=" + procdate + "&caregiverId=" + caregiverId;
    };
    ApiHelperService.prototype.submitActionUrl = function (actionType) {
        return this.endpoint + "Submit/submitAction?action=" + actionType;
    };
    ApiHelperService.prototype.getClientContactsUrl = function (caregiverId, customerId) {
        return this.endpoint + "Clients/GetClientContacts?caregiverId=" + caregiverId + "&customerId=" + customerId;
    };
    // ********** New Endpoint URLS **********
    ApiHelperService.prototype.updateVisitUrl = function () { return this.newApiEndpoint + "Visit/ACUpdate"; };
    ApiHelperService.prototype.handleHttpError = function (methodName, error) {
        if (!error) {
            console.log('Error is undefined at method name:', methodName);
            return;
        }
        if (error.status === 0) {
            console.log("Not connected to the internet for method: " + methodName);
            console.dir(error);
        }
        else {
            console.log(methodName + " ERROR: ");
            console.log(error);
            if (error.error) {
                this.logger.trackEvent("HTTP Error - " + methodName, error.error);
            }
        }
    };
    /**
     * Returns the Header for authentication when calling the API.
     *
     * !!Only use this method in API services!!
     */
    ApiHelperService.prototype.getAuthHeader = function (token) {
        var auth_header = ('Basic ' + token).toString().trim();
        return new http_1.HttpHeaders({
            Authorization: auth_header
        });
    };
    /**
     * Used to send back Authorization string.
     *
     * Only use for headers that have multiple HttpHeaders
     */
    ApiHelperService.prototype.getAuthHeaderAsString = function (token) {
        var auth_header = ('Basic ' + token).toString().trim();
        return auth_header;
    };
    // Static URLs
    ApiHelperService.privacyPolicyUrl = 'https://www2.assuricare.com/about-assuricare/privacy-policy';
    ApiHelperService.termsAndConditionsUrl = 'https://www2.assuricare.com/about-assuricare/terms-of-use';
    ApiHelperService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [logging_service_1.LoggingService])
    ], ApiHelperService);
    return ApiHelperService;
}());
exports.ApiHelperService = ApiHelperService;
