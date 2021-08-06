import { Injectable } from '@angular/core';

import { getImage, HttpRequestOptions} from 'tns-core-modules/http';

import { FileStorageService } from '../storage/file-storage';
import { ApiHelperService } from '../services/data/api-helper.service';

/**
 * This helper is needed because of how NativeScript gets images via HTTP.
 * NativeScript uses getImage() and HttpRequestOptions, which are tns methods.
 */
@Injectable({ providedIn: 'root' })
export class HttpGetImageHelper {

    constructor(private apiHelper: ApiHelperService) { }

    /**
     * This helper is needed because of how NativeScript gets images via HTTP.
     * NativeScript uses getImage() and HttpRequestOptions, which are tns methods.
     *
     * @param token - Caregiver Token
     * @param url - API endpoint
     * @param imageName - Image name. (Do not include .jpeg) It will automaticly be .jpeg.
     */
    async getProfilePictureAndSaveLocally(token: string, url: string): Promise<boolean> {
        const options: HttpRequestOptions = {
            method: 'GET',
            url: url,
            headers: {
                Authorization: this.apiHelper.getAuthHeaderAsString(token),
                'Content-Disposition': 'form-data; name="body"',
            },
        };

        return await getImage(options).then(picture => {
            FileStorageService.saveProfilePicture(picture);
            return true;
        }).catch(err => {
            return Promise.reject('No Image');
        });
    }
}
