"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativescript_secure_storage_1 = require("nativescript-secure-storage");
var secureStorage = new nativescript_secure_storage_1.SecureStorage();
var AcSecureStorage = /** @class */ (function () {
    function AcSecureStorage() {
    }
    AcSecureStorage.set = function (key, value) {
        var valueJSON = JSON.stringify(value);
        secureStorage.setSync({ key: key, value: valueJSON });
    };
    AcSecureStorage.get = function (key) {
        var valueJSON = secureStorage.getSync({ key: key });
        return JSON.parse(valueJSON);
    };
    AcSecureStorage.remove = function (key) {
        secureStorage.removeSync({ key: key });
    };
    return AcSecureStorage;
}());
exports.AcSecureStorage = AcSecureStorage;
