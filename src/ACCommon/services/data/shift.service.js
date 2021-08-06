"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var enums_1 = require("../../../ACCommon/enums");
var multipart_handler_service_1 = require("./multipart-handler.service");
var helpers_1 = require("../../../ACCommon/helpers");
var api_helper_service_1 = require("./api-helper.service");
var ShiftService = /** @class */ (function () {
    function ShiftService(http, apiHelper, filePathHelper, multipartHandler) {
        this.http = http;
        this.apiHelper = apiHelper;
        this.filePathHelper = filePathHelper;
        this.multipartHandler = multipartHandler;
    }
    ShiftService.prototype.submitAction = function (token, submitRequest, actionType) {
        var url = this.apiHelper.submitActionUrl(actionType);
        // Adds the submitRequest to the multipart HTTP request.
        var params = [{ name: 'body', value: JSON.stringify(submitRequest) }];
        if (actionType === enums_1.SubmitActionType.Both) {
            var checkinPath = this.filePathHelper.getFilePath(submitRequest.HistoryDetail.checkInAudio);
            var checkoutPath = this.filePathHelper.getFilePath(submitRequest.HistoryDetail.checkOutAudio);
            params.push({ name: 'checkinAudio', filename: checkinPath, mimeType: 'audio/m4a' });
            params.push({ name: 'checkoutAudio', filename: checkoutPath, mimeType: 'audio/m4a' });
        }
        else {
            var audioFileName = '';
            var signatureName = '';
            if (actionType === enums_1.SubmitActionType.CheckIn) {
                audioFileName = submitRequest.HistoryDetail.checkInAudio;
            }
            else {
                audioFileName = submitRequest.HistoryDetail.checkOutAudio;
            }
            var audioFilePath = this.filePathHelper.getFilePath(audioFileName);
            console.log("Audio Path: " + audioFilePath);
            params.push({ name: 'audio', filename: audioFilePath, mimeType: 'audio/m4a' });
            if (submitRequest.HistoryDetail.SignatureContact !== 0) {
                console.log('Signature Exists');
                signatureName = submitRequest.HistoryDetail.signatureName.toString();
                console.log("Signature Name: " + signatureName);
                var signaturePath = this.filePathHelper.getFilePath(signatureName);
                console.log("Signature Path: " + signaturePath);
                params.push({ name: signatureName, filename: signaturePath, mimeType: 'image/jpeg' });
            }
        }
        return this.multipartHandler.multipartUpload(url, token, 'submitAction', params, 'Check In uploaded!');
    };
    ShiftService.prototype.getLastShifts = function (token) {
        return this.http.get(this.apiHelper.getLastShiftsUrl(), { headers: this.apiHelper.getAuthHeader(token) });
    };
    ShiftService.prototype.updateVisit = function (editVisits, token) {
        return this.http.put(this.apiHelper.updateVisitUrl(), editVisits
        // { headers: this.apiHelper.getAuthHeader(token) }
        );
    };
    ShiftService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            api_helper_service_1.ApiHelperService,
            helpers_1.FilePathHelper,
            multipart_handler_service_1.MultipartHandlerService])
    ], ShiftService);
    return ShiftService;
}());
exports.ShiftService = ShiftService;
