"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_1 = require("tns-core-modules/platform");
/**
 * Used to get the UUID for a device.
 * UUID is the unique identifier for Android and iOS.
 */
var UuidHelper = /** @class */ (function () {
    function UuidHelper() {
    }
    /**
     * Returns UUID, or empty string if ran on Web.
     */
    UuidHelper.prototype.getUuid = function () {
        return platform_1.device.uuid;
    };
    UuidHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [])
    ], UuidHelper);
    return UuidHelper;
}());
exports.UuidHelper = UuidHelper;
