"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var api_helper_service_1 = require("./api-helper.service");
var helpers_1 = require("../../../ACCommon/helpers");
var operators_1 = require("rxjs/operators");
var AuthService = /** @class */ (function () {
    function AuthService(http, apiHelper, uuidHelper) {
        this.http = http;
        this.apiHelper = apiHelper;
        this.uuidHelper = uuidHelper;
    }
    AuthService.prototype.login = function (loginInfo) {
        var uuid = this.uuidHelper.getUuid();
        return this.http.post(this.apiHelper.authenticationUrl(), { Email: loginInfo.Email, Password: loginInfo.Password, UniqueId: uuid })
            .pipe(operators_1.map(function (res) {
            res.Uuid = uuid;
            return res;
        }));
    };
    AuthService.prototype.resetPassword = function (token, email, info) {
        var uuid = this.uuidHelper.getUuid();
        return this.http.post(this.apiHelper.resetPasswordUrl(), { Email: email, OldPassword: info.OldPassword, NewPassword: info.NewPassword, UniqueId: uuid }, { headers: this.apiHelper.getAuthHeader(token) })
            .pipe(operators_1.map(function (res) {
            res.Uuid = uuid;
            return res;
        }));
    };
    AuthService.prototype.recoverPassword = function (email) {
        var uuid = this.uuidHelper.getUuid();
        return this.http.post(this.apiHelper.recoverPasswordUrl(), { Email: email, UniqueId: uuid });
    };
    AuthService.prototype.getAuthorizationStatus = function (token) {
        return this.http.get(this.apiHelper.getUserAuthorizationStatusUrl(), { headers: this.apiHelper.getAuthHeader(token) }).pipe(operators_1.timeout(7000));
    };
    AuthService.prototype.uploadPushToken = function (tokenObject, authToken) {
        return this.http.post(this.apiHelper.pushTokenUploadUrl(), tokenObject, { headers: this.apiHelper.getAuthHeader(authToken) });
    };
    AuthService.prototype.deletePushToken = function (tokenObject, authToken) {
        return this.http.post(this.apiHelper.pushTokenUploadUrl(), tokenObject, { headers: this.apiHelper.getAuthHeader(authToken) });
    };
    AuthService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            api_helper_service_1.ApiHelperService,
            helpers_1.UuidHelper])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
