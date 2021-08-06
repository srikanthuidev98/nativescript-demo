import { Injectable } from '@angular/core';
import { File } from 'tns-core-modules/file-system';
import { Mediafilepicker, FilePickerOptions } from 'nativescript-mediafilepicker';
import { isIOS } from 'tns-core-modules/ui/page';
import { confirm } from 'tns-core-modules/ui/dialogs';
import { convertToBase64String } from '.';

/**
 * This service is used to select a file from user's storage.
 */
@Injectable({ providedIn: 'root' })
export class FilePickerHelper {

    private mediafilepicker: Mediafilepicker;

    constructor() {
        this.mediafilepicker = new Mediafilepicker();
    }

    private getFileExtensions(): string[] {
        if (isIOS) {
            return [
                kUTTypeText,
                kUTTypePDF,
                kUTTypeSpreadsheet,
                kUTTypeGIF,
                'org.openxmlformats.wordprocessingml.document',
                'com.microsoft.powerpoint.​ppt',
                'org.openxmlformats.spreadsheetml.sheet',
                'org.openxmlformats.presentationml.presentation',
                'com.microsoft.excel.xls'
            ];
        } else {
            return ['pdf', 'txt', 'doc', 'docx', 'gif', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'];
        }
    }

    /**
     * Choose a single file from user's device.
     * Can choose from these extensions:
     * ['pdf', 'txt', 'doc', 'docx', 'gif', 'csv', 'xls', 'xlsx', 'ppt', 'pptx']
     */
    chooseSingleFile(): Promise<{ filename: string, base64String: string }> {
        return new Promise((resolve, reject) => {
            const extensions = this.getFileExtensions();

            const options: FilePickerOptions = {
                android: {
                    extensions: extensions,
                    maxNumberFiles: 1
                },
                ios: {
                    extensions: extensions,
                    multipleSelection: false
                }
            };

            this.mediafilepicker.openFilePicker(options);

            this.mediafilepicker.on('getFiles', (res) => {
                this.unsubscribeFromMediaPicker();
                const result = <{type: string, file: string, rawData: any}>res.object.get('results')[0];

                if (isIOS && result.file.startsWith('file://')) {
                    result.file = result.file.substr(7);
                }

                const file: File = File.fromPath(decodeURI(result.file));
                const base64String = convertToBase64String(result.file);

                if (isIOS) {
                    this.mediafilepicker.off('getFiles');
                    confirm({
                        title: 'Confirm Attachment',
                        message: file.name,
                        okButtonText: 'Yes',
                        cancelButtonText: 'No',
                    }).then(answer => {
                        if (answer) {
                            resolve({ filename: file.name, base64String: base64String });
                        } else {
                            reject('Canceled attachment');
                        }
                    });
                } else {
                    resolve({ filename: file.name, base64String: base64String });
                }
            });

            this.mediafilepicker.on('error', (res) => {
                this.unsubscribeFromMediaPicker();
                console.log('error');
                reject(res.object.get('msg'));
            });

            this.mediafilepicker.on('cancel', (res) => {
                this.unsubscribeFromMediaPicker();
                console.log('cancel');
                reject(res.object.get('msg'));
            });
        });
    }

    private unsubscribeFromMediaPicker() {
        this.mediafilepicker.off('getFiles');
        this.mediafilepicker.off('error');
        this.mediafilepicker.off('cancel');
    }
}
