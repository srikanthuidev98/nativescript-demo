"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var api_helper_service_1 = require("./api-helper.service");
var sort_helper_1 = require("../../../ACCommon/helpers/sort.helper");
var ClientService = /** @class */ (function () {
    function ClientService(http, apiHelper) {
        this.http = http;
        this.apiHelper = apiHelper;
    }
    ClientService.prototype.getClients = function (token) {
        return this.http.get(this.apiHelper.clientsUrl(), { headers: this.apiHelper.getAuthHeader(token) })
            .pipe(operators_1.map(function (res) {
            sort_helper_1.customSort(res, 'Name');
            return res;
        }));
    };
    ClientService.prototype.getClientContacts = function (token, caregiverId, customerId) {
        return this.http.get(this.apiHelper.getClientContactsUrl(caregiverId, customerId), { headers: this.apiHelper.getAuthHeader(token) });
    };
    ClientService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            api_helper_service_1.ApiHelperService])
    ], ClientService);
    return ClientService;
}());
exports.ClientService = ClientService;
