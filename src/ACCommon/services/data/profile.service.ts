import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Profile } from '../../../ACCommon/models/profile.model';
import { HttpGetImageHelper } from '../../../ACCommon/helpers';
import { MultipartHandlerService } from './multipart-handler.service';
import { ApiHelperService } from './api-helper.service';
import { FileStorageService } from '../../../ACCommon/storage/file-storage';


@Injectable()
export class ProfileService {
    constructor(
        private http: HttpClient,
        private apiHelper: ApiHelperService,
        private httpGetImageHelper: HttpGetImageHelper,
        private multipartHandler: MultipartHandlerService) { }

        /**
         * Get Caregiver profile information.
         */
        getProfileInfo(token: string): Observable<Profile> {
            const check = this.apiHelper.verifyInternet();
            if (!check.result) {
                return throwError(check);
            }

            return this.http.get<Profile>(this.apiHelper.profileUrl(),
                { headers: this.apiHelper.getAuthHeader(token) });
        }

        /**
         * This will get the image from the DB and save it locally.
         * The picture name is 'profile-pic.jpeg'
         *
         * Returns a promise. If true, the image was saved successfully.
         */
        getProfilePictureAndSaveLocally(token: string): Promise<boolean> {
            return this.httpGetImageHelper.getProfilePictureAndSaveLocally(token, this.apiHelper.getPictureUrl());
        }

        uploadPicture(token: string): Observable<{responseCode: number, data: any}> {
            const check = this.apiHelper.verifyInternet();
            if (!check.result) {
                return throwError(check);
            }

            const params = [{
                name: 'picture',
                filename: FileStorageService.getFilePath('profile-pic.jpeg'),
                mimeType: 'image/jpeg'
            }];

            return this.multipartHandler.multipartUpload(this.apiHelper.uploadPictureUrl(),
                token, 'profilePictureUpload', params, 'Picture updated!');
        }

        deletePicture(token: string) {
            const check = this.apiHelper.verifyInternet();
            if (!check.result) {
                return throwError(check);
            }

            return this.http.delete(this.apiHelper.deletePictureUrl(),
                { headers: this.apiHelper.getAuthHeader(token) });
        }
}
