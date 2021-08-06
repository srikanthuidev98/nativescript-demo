"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var helpers_1 = require("../../../ACCommon/helpers");
var multipart_handler_service_1 = require("./multipart-handler.service");
var api_helper_service_1 = require("./api-helper.service");
var ProfileService = /** @class */ (function () {
    function ProfileService(http, apiHelper, httpGetImageHelper, filePathHelper, multipartHandler) {
        this.http = http;
        this.apiHelper = apiHelper;
        this.httpGetImageHelper = httpGetImageHelper;
        this.filePathHelper = filePathHelper;
        this.multipartHandler = multipartHandler;
    }
    /**
     * Get Caregiver profile information.
     */
    ProfileService.prototype.getProfileInfo = function (token) {
        return this.http.get(this.apiHelper.profileUrl(), { headers: this.apiHelper.getAuthHeader(token) });
    };
    /**
     * This will get the image from the DB and save it locally.
     * The picture name is 'profile-pic.jpeg'
     *
     * Returns a promise. If true, the image was saved successfully.
     */
    ProfileService.prototype.getProfilePictureAndSaveLocally = function (token) {
        var url = this.apiHelper.getPictureUrl();
        return this.httpGetImageHelper.getProfilePictureAndSaveLocally(token, url);
    };
    ProfileService.prototype.uploadPicture = function (token) {
        var pictureFile = this.filePathHelper.getFilePath('profile-pic.jpeg');
        var url = this.apiHelper.uploadPictureUrl();
        var params = [
            { name: 'picture', filename: pictureFile, mimeType: 'image/jpeg' }
        ];
        console.log(JSON.parse(JSON.stringify(params)));
        return this.multipartHandler.multipartUpload(url, token, 'profilePictureUpload', params, 'Picture updated!');
    };
    ProfileService.prototype.deletePicture = function (token) {
        return this.http.delete(this.apiHelper.deletePictureUrl(), { headers: this.apiHelper.getAuthHeader(token) });
    };
    ProfileService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient,
            api_helper_service_1.ApiHelperService,
            helpers_1.HttpGetImageHelper,
            helpers_1.FilePathHelper,
            multipart_handler_service_1.MultipartHandlerService])
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;
