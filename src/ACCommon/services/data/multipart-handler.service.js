"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var bgHttp = require("nativescript-background-http");
var rxjs_1 = require("rxjs");
var api_helper_service_1 = require("./api-helper.service");
var MultipartHandlerService = /** @class */ (function () {
    function MultipartHandlerService(apiHelper) {
        this.apiHelper = apiHelper;
        this.events = [];
        this.lastEvent = '';
        this.counter = 0;
        this.finishedUploading = false;
        /**
         * Subscribe on this Subject (Observable) to get the response code and data (if any) from the HTTP call.
         */
        this.response = new rxjs_1.Subject();
        this.lastEvent = '';
    }
    /**
     * Upload multipart HTTP request.
     *
     * @param url - Full API URL
     * @param token - token
     * @param bgSessionName - Name of the HTTP session name
     * @param params - Params: The actual data that will be passed to the API
     * @param androidNotificationTitle - Notification title for Android after upload.
     */
    MultipartHandlerService.prototype.multipartUpload = function (url, token, bgSessionName, params, androidNotificationTitle) {
        var _this = this;
        if (androidNotificationTitle === void 0) { androidNotificationTitle = 'Sync complete'; }
        var session = bgHttp.session(bgSessionName);
        var name = 'test';
        var description = name + " (" + ++this.counter + ")";
        var request = {
            url: url,
            method: 'POST',
            headers: {
                Authorization: this.apiHelper.getAuthHeaderAsString(token),
                'Content-Disposition': 'form-data; name=' + name + 'filename=' + name,
                'Content-Type': 'application/octet-stream'
            },
            description: description,
            androidAutoDeleteAfterUpload: false,
            androidNotificationTitle: androidNotificationTitle,
            androidAutoClearNotification: true
        };
        setTimeout(function () {
            if (!_this.finishedUploading) {
                _this.response.next({ responseCode: 408, data: 'Multipart upload timed out' });
            }
        }, 20000);
        var task = session.multipartUpload(params, request);
        this.bindTask(task);
        return this.response;
    };
    /**
     * Bind the task to the events. This will create callbacks for every stage of the call.
     * (responsed, progress, complete, error)
     *
     * To get the response code and data from the response, please subscribe on MultipartHandlerService.response
     *
     * @param task - bgHttp.Task
     */
    MultipartHandlerService.prototype.bindTask = function (task) {
        task.on('progress', this.onEvent.bind(this));
        task.on('error', this.onEvent.bind(this));
        task.on('responded', this.onEvent.bind(this));
        task.on('complete', this.onEvent.bind(this));
        this.lastEvent = '';
    };
    MultipartHandlerService.prototype.onEvent = function (e) {
        if (this.lastEvent !== e.eventName) {
            // suppress all repeating progress events and only show the first one
            this.lastEvent = e.eventName;
        }
        else {
            return;
        }
        if (e.eventName === 'complete') {
            this.finishedUploading = true;
            this.response.next({ responseCode: e.responseCode, data: JSON.parse(this.data) });
        }
        if (e.eventName === 'responded') {
            this.data = e.data;
        }
        if (e.eventName === 'error') {
            console.log("Multipart HTTP error.\n                        ResponseCode: " + e.responseCode + ",\n                        Response: " + e.response);
        }
        this.events.push({
            eventTitle: e.eventName + ' ' + e.object.description,
            eventData: JSON.stringify({
                error: e.error ? e.error.toString() : e.error,
                currentBytes: e.currentBytes,
                totalBytes: e.totalBytes,
                body: e.data,
                responseCode: e.responseCode
            })
        });
    };
    MultipartHandlerService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [api_helper_service_1.ApiHelperService])
    ], MultipartHandlerService);
    return MultipartHandlerService;
}());
exports.MultipartHandlerService = MultipartHandlerService;
