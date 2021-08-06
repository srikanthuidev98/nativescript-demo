"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("tns-core-modules/file-system");
/**
 * This STATIC File Storage Service is only used for local files. Ex: pictures, recordings, etc.
 * Ex: Recordings and profile picture.
 */
var FileStorageService = /** @class */ (function () {
    function FileStorageService() {
    }
    /**
     * Saves the local profile picture on to the device.
    */
    FileStorageService.saveProfilePicture = function (picture) {
        picture.saveToFile(file_system_1.knownFolders.documents().path + "/profile-pic.jpeg", 'jpeg');
    };
    /**
     * Deletes the local profile picture on the device.
    */
    FileStorageService.deleteProfilePicture = function () {
        var folder = file_system_1.knownFolders.documents();
        var file = folder.getFile('profile-pic.jpeg');
        file.removeSync();
    };
    /**
     * Saves the local recording on to the device.
     *
     * @param audioFile - Audio file name. Inculde the extension. Ex: .m4a
    */
    FileStorageService.saveAudioFile = function (audioFile) {
    };
    /**
     * Deletes the local recording on the device.
     *
     * @param audioFile - Audio file name. Inculde the extension. Ex: .m4a
    */
    FileStorageService.deleteAudioFile = function (audioFile) {
        var folder = file_system_1.knownFolders.documents();
        var file = folder.getFile(audioFile);
        file.removeSync();
    };
    return FileStorageService;
}());
exports.FileStorageService = FileStorageService;
