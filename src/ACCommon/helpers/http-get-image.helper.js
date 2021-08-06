"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("tns-core-modules/http");
var file_storage_1 = require("../storage/file-storage");
var api_helper_service_1 = require("../services/data/api-helper.service");
/**
 * This helper is needed because of how NativeScript gets images via HTTP.
 * NativeScript uses getImage() and HttpRequestOptions, which are tns methods.
 */
var HttpGetImageHelper = /** @class */ (function () {
    function HttpGetImageHelper(apiHelper) {
        this.apiHelper = apiHelper;
    }
    /**
     * This helper is needed because of how NativeScript gets images via HTTP.
     * NativeScript uses getImage() and HttpRequestOptions, which are tns methods.
     *
     * @param token - Caregiver Token
     * @param url - API endpoint
     * @param imageName - Image name. (Do not include .jpeg) It will automaticly be .jpeg.
     */
    HttpGetImageHelper.prototype.getProfilePictureAndSaveLocally = function (token, url) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            url: url,
                            headers: {
                                Authorization: this.apiHelper.getAuthHeaderAsString(token),
                                'Content-Disposition': 'form-data; name="body"',
                            },
                        };
                        return [4 /*yield*/, http_1.getImage(options).then(function (picture) {
                                file_storage_1.FileStorageService.saveProfilePicture(picture);
                                return true;
                            }).catch(function (err) {
                                console.log('GETIMAGE ERROR', err);
                                return Promise.reject();
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HttpGetImageHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [api_helper_service_1.ApiHelperService])
    ], HttpGetImageHelper);
    return HttpGetImageHelper;
}());
exports.HttpGetImageHelper = HttpGetImageHelper;
