"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var api_helper_service_1 = require("./api-helper.service");
var HistoryService = /** @class */ (function () {
    function HistoryService(http, apiHelper) {
        this.http = http;
        this.apiHelper = apiHelper;
    }
    HistoryService.prototype.getHistories = function (token) {
        return this.http.get(this.apiHelper.historyUrl(), { headers: this.apiHelper.getAuthHeader(token) });
    };
    HistoryService.prototype.getHistoryDetails = function (token, startDate, caregiverId) {
        return this.http.get(this.apiHelper.getHistoryDetailUrl(startDate, caregiverId), { headers: this.apiHelper.getAuthHeader(token) });
    };
    HistoryService.prototype.getHistoryDetailsWithAdjustments = function (token, startDate, caregiverId) {
        return this.http.get(this.apiHelper.getHistoryDetailAdjustmentsUrl(startDate, caregiverId), { headers: this.apiHelper.getAuthHeader(token) });
    };
    HistoryService.prototype.getIADLS = function (token) {
        return this.http.get(this.apiHelper.IADLSUrl(), { headers: this.apiHelper.getAuthHeader(token) });
    };
    HistoryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            api_helper_service_1.ApiHelperService])
    ], HistoryService);
    return HistoryService;
}());
exports.HistoryService = HistoryService;
