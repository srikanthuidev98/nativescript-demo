import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm } from '../../models/forms/login-form.model';
import { Observable, throwError } from 'rxjs';
import { Caregiver } from '../../models/caregiver.model';
import { ApiHelperService } from './api-helper.service';
import { UuidHelper } from '../../../ACCommon/helpers';
import { map, timeout } from 'rxjs/operators';
import { ResetPassForm } from '../../../ACCommon/models/forms/reset-pass-form.model';
import { PushToken } from '../../../ACCommon/models/push-token.model';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private apiHelper: ApiHelperService,
        private uuidHelper: UuidHelper
    ) { }

    login(loginInfo: LoginForm): Observable<Caregiver>  {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        const uuid = this.uuidHelper.getUuid();

        return this.http.post<Caregiver>(this.apiHelper.authenticationUrl(),
                {Email: loginInfo.Email, Password: loginInfo.Password, UniqueId: uuid})
                .pipe(map(res => {
                    res.Uuid = uuid;
                    return res;
                }));
    }

    resetPassword(token: string, email: string, info: ResetPassForm) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        const uuid = this.uuidHelper.getUuid();

        return this.http.post<Caregiver>(this.apiHelper.resetPasswordUrl(),
            { Email: email, OldPassword: info.OldPassword, NewPassword: info.NewPassword, UniqueId: uuid},
            { headers: this.apiHelper.getAuthHeader(token) })
                .pipe(map(res => {
                    res.Uuid = uuid;
                    return res;
                }));
    }

    recoverPassword(email: string) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        const uuid = this.uuidHelper.getUuid();

        return this.http.post<any>(this.apiHelper.recoverPasswordUrl(), { Email: email, UniqueId: uuid});
    }

    getAuthorizationStatus(token: string) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<any>(this.apiHelper.getUserAuthorizationStatusUrl(),
            { headers: this.apiHelper.getAuthHeader(token) }).pipe(timeout(7000));
    }

    uploadPushToken(tokenObject: PushToken, authToken: string) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.post<PushToken>(this.apiHelper.pushTokenUploadUrl(), tokenObject,
            { headers: this.apiHelper.getAuthHeader(authToken) });
    }

    deletePushToken(tokenObject: PushToken, authToken: string) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.post<PushToken>(this.apiHelper.pushTokenUploadUrl(), tokenObject,
            { headers: this.apiHelper.getAuthHeader(authToken) });
    }

    appUpdater(token: string, version: string, os: 'iOS' | 'Android') {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<string>(this.apiHelper.appUpdaterUrl(version, os),
            { headers: this.apiHelper.getNewAuthHeader(token)});
    }
}
