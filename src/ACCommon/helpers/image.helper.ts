import { Injectable } from '@angular/core';

import { ImageSource } from 'tns-core-modules/image-source/image-source';
import * as imagepicker from 'nativescript-imagepicker';
import { takePicture } from 'nativescript-camera';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

import { AppState } from '../states/app.state';
import { FileStorageService } from '../storage/file-storage';
import { CheckPermissionService } from '../services/check-permission.service';
import { PhotoEditor, PhotoEditorControl } from 'nativescript-photo-editor';
import { ImagePickerMediaType } from 'nativescript-imagepicker';


/**
 * Helper Service Only used in Profile Module.
 * So this helper is only providered in the profile module.
 *
 * This helper is used to take and choose pictures from the device.
 */
@Injectable()
export class ImageHelper {

    @Emitter(AppState.uploadProfilePicture)
    private uploadProfilePicture: Emittable<null>;

    private width = 320;
    private height = 240;

    constructor(private permissionService: CheckPermissionService) { }

    /**
     * Checks if user has permission,
     * Then lets the user select a signle picture.
     * Then saves to the device.
     */
    public choosePicture(sendImageBack = false): Promise<ImageSource>  {
        return new Promise((resolve, reject) => {
            this.permissionService.checkPhotos().then(async () => {
                const context = imagepicker.create({
                    mode: 'single',
                    mediaType: ImagePickerMediaType.Image
                });

                await context.present().then(async (selection) => {
                    selection[0].options.width = this.width;
                    selection[0].options.height = this.height;

                    await ImageSource.fromAsset(selection[0]).then((imageSource) => {
                        resolve(this.editPhoto(imageSource, sendImageBack));
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(function (e) {
                    console.log('choosePicture Catch: ' + e);
                    reject('No Picture was selected.');
                });
            });
        });
    }

    /**
     * Checks if user has permission,
     * Then lets the user take a signle picture.
     * Then saves to the device.
     */
    public async takePicture(sendImageBack = false): Promise<ImageSource> {
        return new Promise((resolve, reject) => {
            this.permissionService.checkCamera().then(
                async () => {
                    await takePicture({ width: this.width, height: this.height, keepAspectRatio: true,
                                        saveToGallery: false, allowsEditing: false })
                        .then(async (imageAsset: any) => {
                            const that = this;

                            if (imageAsset) {
                                await ImageSource.fromAsset(imageAsset).then(async (imageSource) => {
                                    resolve(that.editPhoto(imageSource, sendImageBack));
                                });
                            }
                        }, (error) => {
                            console.log('takePicture Catch: ' + error);
                            reject('No Picture was taken.');
                        });
                }
            );
        });
    }

    private editPhoto(imageSource: ImageSource, sendImageBack): Promise<ImageSource> {
        const photoEditor = new PhotoEditor();

        return new Promise((resolve) => {
            photoEditor.editPhoto({
                imageSource: imageSource,
                hiddenControls: [
                    PhotoEditorControl.Clear,
                    PhotoEditorControl.Draw,
                    PhotoEditorControl.Text
                ],
            }).then((newImage: ImageSource) => {
                if (sendImageBack) {
                    resolve(newImage);
                } else {
                    this.saveImage(newImage);
                }
            }).catch((e) => {
                console.error(e);
            });
        });
    }

    private saveImage(imageSource: ImageSource) {
        FileStorageService.saveProfilePicture(imageSource);
        this.uploadProfilePicture.emit(null);
    }
}
