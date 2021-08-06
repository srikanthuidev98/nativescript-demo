import { knownFolders, Folder, File, path } from 'tns-core-modules/file-system';
import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { isAndroid, isIOS } from 'tns-core-modules/ui/page';
import { openFile } from 'tns-core-modules/utils/utils';
import { encoding } from 'tns-core-modules/text';
import { Toast } from '../helpers';

declare var NSObject, interop, UIImage, NSError, UIImageWriteToSavedPhotosAlbum, PHPhotoLibrary, PHAuthorizationStatus: any;

const permissions = require('nativescript-permissions');

/**
 * This STATIC File Storage Service is only used for local files. Ex: pictures, recordings, etc.
 * Ex: Recordings and profile picture.
 */
export class FileStorageService {

    /**
     * Gets the file path where all files are located.
     *
     * @param fileName - File name. Include the extension. EX: .m4a
     *
     * Don't pass a fileName if you just want the path of the folder
     */
    static getFilePath(fileName: string = ''): string {
        return `${knownFolders.documents().path}/${fileName}`;
    }

    /**
     * Checks to see if a file exists.
     *
     * @param filepath - Path of file. Use FileStorageService.getFilePath() if you don't know path.
     */
    static checkIfFileExists(filepath: string = '') {
        return File.exists(filepath);
    }

    /**
     * Creates file name with fileName + date (year + month + day + hour + minute + second) + extension
     * EX: recording_20197115485.m4a
     *
     * @param fileName - Name of the file. EX: checkin, checkout, signature, etc.
     * @param extension - Exension of the file. EX: .m4a, etc (INCLUDE THE . (DOT))
     */
    static createFileName(fileName: string, extension: string): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`;
        const day = `${date.getDate()}`;
        const hour = `${date.getHours()}`;
        const min = `${date.getMinutes()}`;
        const sec = `${date.getSeconds()}`;
        return `${fileName}_${year}${month}${day}${hour}${min}${sec}${extension}`;
    }

    /**
     * Saves the local profile picture on to the device.
    */
    static saveProfilePicture(picture: ImageSource) {
        picture.saveToFile(`${knownFolders.documents().path}/profile-pic.jpeg`, 'jpeg');
    }

    /**
     * Deletes the local profile picture on the device.
    */
    static deleteProfilePicture() {
        const folder: Folder = <Folder>knownFolders.documents();
        const file: File = <File>folder.getFile('profile-pic.jpeg');
        file.removeSync();
    }


    /**
     * Deletes all files (Pictures, Audio recordings, etc)
     */
    static deleteAllFiles() {
        FileStorageService.iosDeleteTempFolderContents();

        const folder: Folder = <Folder>knownFolders.documents();
        folder.getEntities().then((entities) => {
            // On Android, The files are located in a folder with other folders. So skips those folders when deleting.
            entities.forEach((entity) => {
                if (entity.name.includes('.')) { // Folders don't have '.'
                    const file: File = <File>folder.getFile(entity.name);
                    file.removeSync();
                }
            });
        }).catch((err) => {
            console.log(err.stack);
        });
    }

    /**
     * Deletes the local recording on the device.
     *
     * @param audioFile - Audio file name. Inculde the extension. Ex: .m4a
    */
    static deleteAudioFile(audioFile: string) {
        const folder: Folder = <Folder>knownFolders.documents();
        const file: File = <File>folder.getFile(audioFile);
        file.removeSync();
    }

    /**
     * - iOS Only -
     * In order to show file to user, app has to temporlarty save file.
     * So this will delete all temp files in that folder.
     */
    static iosDeleteTempFolderContents() {
        if (isIOS) {
            const assuricareFolder = path.join(knownFolders.documents().path, 'AssuriCare');
            const folder: Folder = Folder.fromPath(assuricareFolder);
            folder.clear().then(() => {
                console.log('Temp files deleted');
            }).catch((err) => {
                console.log('Couldnt clear files');
                console.log(err.stack);
            });
        }
    }

    static saveFileToDownloads(file, fileName) {
        if (isAndroid) {
            permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
            'AssuriCare Needs this permission to save files to the device.').then(() => {

                const androidDownloadsPath = android.os.Environment.getExternalStoragePublicDirectory(
                    android.os.Environment.DIRECTORY_DOWNLOADS).toString();

                const folder: Folder = Folder.fromPath(androidDownloadsPath);
                const newFile = folder.getFile(fileName);

                newFile.writeTextSync(file, err => {
                    console.log('Error saving file');
                    console.log(err);
                }, encoding.ISO_8859_1);

                new Toast().show(`File: ${fileName} downloaded.`);

                openFile(newFile.path);
            }).catch(() => {
                console.log('Not authorized');
            });
        } else {
            const assuricareFolder = path.join(knownFolders.documents().path, 'AssuriCare');
            const folder: Folder = Folder.fromPath(assuricareFolder);
            const newFile = folder.getFile(fileName);

            newFile.writeTextSync(file, err => {
                console.log('Error saving file');
                console.log(err);
            }, encoding.ISO_8859_1);

            openFile(newFile.path);
        }
    }

    static saveImageToGallery(image: ImageSource, imageName: string) {
        const re = /(?:\.([^.]+))?$/;
        const ext = re.exec(imageName)[1].toLowerCase();

        if (ext === 'jpeg' || ext === 'png' || ext === 'jpg') {
            if (isAndroid) {
                permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                'AssuriCare Needs this permission to save image to the device.').then(() => {

                    const androidPicturesPath = android.os.Environment.getExternalStoragePublicDirectory(
                        android.os.Environment.DIRECTORY_PICTURES).toString();

                    const assuricareFolder = path.join(androidPicturesPath, 'AssuriCare');

                    const folder: Folder = Folder.fromPath(assuricareFolder);
                    const actualPath: string = path.join(assuricareFolder, imageName);
                    // const exists: boolean = File.exists(myPath);

                    const saved: boolean = image.saveToFile(actualPath, ext);
                    if (saved) {
                        new Toast().show('Image saved successfully.');
                    } else {
                        new Toast().show('Could not save image.');
                    }
                }).catch(() => {
                    console.log('Not authorized');
                });
            } else {
                PHPhotoLibrary.requestAuthorization((result) => {
                    if (result === PHAuthorizationStatus.Authorized) {
                        const CompletionTarget = NSObject.extend({
                            'thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:': function(savedImage, error, context) {
                                if (error) {
                                    new Toast().show('Could not save image.');
                                } else {
                                    new Toast().show('Image saved successfully.');
                                }
                            }
                        }, {
                            exposedMethods: {
                                'thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:': {
                                    returns: interop.types.void, params: [UIImage, NSError, interop.Pointer]
                                }
                            }
                        });
                        const completionTarget = CompletionTarget.new();
                        UIImageWriteToSavedPhotosAlbum(image.ios, completionTarget,
                            'thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:', null);
                    } else {
                        console.log('not authorized');
                    }
                });
            }
        } else {
            new Toast().show(`Image Extension: ${ext} is incorrect. Could not save to device.`);
        }
    }
}
