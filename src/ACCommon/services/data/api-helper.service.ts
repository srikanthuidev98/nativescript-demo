import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggingService } from '../logging.service';
import { currentEndpoint, currentNewEndpoint, currentCareWhenEndpoint } from '../../config/app-config.module';
import { ConnectivityHelper } from '../../../ACCommon/helpers/connectivity.helper';
import { throwError } from 'rxjs';
import { Caregiver, RefreshTokenResponse } from '../../../ACCommon/models';
import { map } from 'rxjs/operators';
import { DateService } from '../date.service';
import { alert } from 'tns-core-modules/ui/dialogs';

/**
 * This static service is used to grab the header for API calls.
 *
 * !!Only use this class in API services!!
 */
@Injectable()
export class ApiHelperService {

    constructor(private logger: LoggingService, private connection: ConnectivityHelper, private http: HttpClient) {
        currentEndpoint.subscribe((newEndpoint) => {
            this.endpoint = newEndpoint;
        });

        currentNewEndpoint.subscribe((newEndpoint) => {
            this.newApiEndpoint = newEndpoint;
        });

        currentCareWhenEndpoint.subscribe((newEndpoint) => {
            this.careWhenEndpoint = newEndpoint;
        });
    }

    // Static URLs
    public static privacyPolicyUrl = 'https://www2.assuricare.com/about-assuricare/privacy-policy';
    public static termsAndConditionsUrl = 'https://www2.assuricare.com/about-assuricare/terms-of-use';

    public static lastFunctionCalled = { name: '', date: new Date()};

    private endpoint;
    private newApiEndpoint;
    private careWhenEndpoint;

    /* tslint:disable:max-line-length */

    // The reason why we grabbing the URL with a function is to be able to dynamically change the URL

    // ********** Old Endpoint URLS **********
    // Authentication
    public authenticationUrl(): string { return `${this.endpoint}Authentication/LogIn`; }
    public resetPasswordUrl(): string { return `${this.endpoint}Authentication/ResetPassword`; }
    public recoverPasswordUrl(): string { return `${this.endpoint}Authentication/RecoverPassword`; }
    public getUserAuthorizationStatusUrl(): string { return `${this.endpoint}Authentication/GetAuthorizationStatus`; }

    // Profile
    public profileUrl(): string { return `${this.endpoint}Profile/Get`; }
    public uploadPictureUrl(): string { return `${this.endpoint}Profile/UploadPicture`; }
    public deletePictureUrl(): string { return `${this.endpoint}Profile/DeletePicture`; }
    public getPictureUrl(): string { return `${this.endpoint}Profile/GetPicture`; }

    // ETC
    public IADLSUrl(): string { return `${this.endpoint}IADLS/Get`; }
    public pushTokenUploadUrl(): string { return `${this.endpoint}PushToken/Register`; }

    // ********** New Endpoint URLS **********
    // Clients
    public newClientsUrl(uniqueCaregiverId: number): string { return `${this.newApiEndpoint}Client/GetClients/${uniqueCaregiverId}`; }

    // Submit Action
    public submitActionUrl(): string { return `${this.newApiEndpoint}Mobile/SubmitAction`; }

    // Payrolls & Visit history
    public getPayrollUrl(customerId: number, UCGID: number): string { return `${this.newApiEndpoint}TimeEntry/GetCaregiverPayrolls?customerId=${customerId}&caregiverId=${UCGID}`; }
    public getVisitsUrl(payrollId: number): string { return `${this.newApiEndpoint}Visit/ACGet?payrollId=${payrollId}`; }
    public updateVisitUrl(): string { return `${this.newApiEndpoint}Visit/ACUpdate`; }
    public lastVisitUrl(uniqueCaregiverId: number): string { return `${this.newApiEndpoint}Visit/GetLastCaregiverVisit?uniqueCaregiverId=${uniqueCaregiverId}`; }

    // ETC
    public appUpdaterUrl(version: string, os: 'iOS' | 'Android'): string { return `${this.newApiEndpoint}Mobile/GetVersion?version=${version}&os=${os}`; }
    public refreshTokenUrl(uniqueCaregiverId: number): string { return `${this.newApiEndpoint}login/ReNew/${uniqueCaregiverId}`; }
    public submitAdditionalQuestionsUrl(caregiverId: number): string { return `${this.newApiEndpoint}caregiver/SubmitAnswers?caregiverId=${caregiverId}`; }

    // ********** CareWhen URLS **********
    public getScheduleUrl(uniqueCaregiverId: number, from: string, to: string): string { return `${this.careWhenEndpoint}schedule/${uniqueCaregiverId}?fromDate=${from}&toDate=${to}`; }

    // Messaging URLs
    public getMessageRecipientsUrl(uniqueCaregiverId: number): string { return `${this.careWhenEndpoint}messageRecipients/${uniqueCaregiverId}`; }
    public getMessageThreadsUrl(uniqueCaregiverId: number): string { return `${this.careWhenEndpoint}message/${uniqueCaregiverId}?isMessageThread=false`; }
    public getMessagesUrl(uniqueCaregiverId: number, parentMessageId: number): string { return `${this.careWhenEndpoint}message/${uniqueCaregiverId}?isMessageThread=true&parentMessageId=${parentMessageId}`; }
    public postMessageUrl(): string { return `${this.careWhenEndpoint}message/`; }
    public deleteMessagesUrl(uniqueCaregiverId: number, parentMessageId: number): string { return `${this.careWhenEndpoint}message/${parentMessageId}?appUser=${uniqueCaregiverId}`; }
    public getAttachmentUrl(uniqueCaregiverId: number, parentMessageId: number, filename: string): string { return `${this.careWhenEndpoint}fileAttachment/${parentMessageId}?appUser=${uniqueCaregiverId}&filename=${filename}`; }

    /* tslint:enable:max-line-length */

    /**
     * Checks if user has internet.
     * Use this method before every API call. Use these 4 lines:
     *
     * const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }
     */
    public verifyInternet(): {result, message?, status?} {
        if (this.connection.checkInternet()) {
            return { result: true };
        }
        return { result: false, message: 'Not connected to the internet.', status: 0 };
    }

    public async handleHttpError (methodName: string, error: any, caregiver?: Caregiver) {
        if (!error) {
            console.log('Error is undefined at method name:', methodName);
            return;
        }

        if (ApiHelperService.lastFunctionCalled.name === methodName &&
            DateService.durationBetweenDates(ApiHelperService.lastFunctionCalled.date, new Date(), 'asSeconds') < 5) {
            console.log('Stop calling it.', methodName);
            throw new Error('401 Happened twice.');
        }

        if (error.status === 0) {
            console.log(`Not connected to the internet for method: ${methodName}`);
        } else if (error.status === 401) { // Token is bad. Refresh token
            this.logger.trackEvent(`401: Unauthorized `, `For method: ${methodName}`);

            // Calls API refresh token.
            if (caregiver) {
                ApiHelperService.lastFunctionCalled = { name: methodName, date: new Date() } ;

                return this.apiRefreshToken(caregiver).toPromise();
            }
        } else if (error.status === 777) {
            this.logger.trackEvent(`777: AssuriCare Error `, `For method: ${methodName}`);

            setTimeout(() => {
                alert({ title: 'Error occurred', message: error.error, okButtonText: 'Ok' });
            }, 1000);
        } else {
            console.log(`${methodName} ERROR: `);
            console.log(error);
            if (error.error) {
                this.logger.trackEvent(`HTTP Error - ${methodName}`, error.error);
            }
        }
    }

    /**
     * Used to refresh the new API token. This can be called 2 ways:
     * 1. On any HTTP call that fails with a 401.
     * 2. On start up, by using AppState.isTokenExpired() Receiver
     */
    apiRefreshToken(caregiver: Caregiver) {
        const check = this.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.post<Caregiver>(this.refreshTokenUrl(caregiver.Id), {},
            { headers: this.getNewAuthHeader(caregiver.RefreshToken) })
            .pipe(map((res: RefreshTokenResponse) => {
                caregiver.APIToken = res.APIToken;
                caregiver.Expires = res.Expires;
                caregiver.RefreshToken = res.RefreshToken;

                return caregiver;
            }));
    }

    /**
     * Returns the Header for authentication when calling the API.
     *
     * !!Only use this method in API services!!
     */
    public getAuthHeader(token: string): HttpHeaders {
        const auth_header = ('Basic ' + token).toString().trim();
        return new HttpHeaders({
            Authorization: auth_header
        });
    }

    /**
     * Returns the Header for the authentication when calling the NEW API.
     *
     * !!Only use this method in API services!!
     */
    public getNewAuthHeader(token: string): HttpHeaders {
        return new HttpHeaders({
            Authorization: token
        });
    }

    /**
     * Used to send back Authorization string.
     *
     * Only use for headers that have multiple HttpHeaders
     */
    public getAuthHeaderAsString(token: string): string {
        const auth_header = ('Basic ' + token).toString().trim();
        return auth_header;
    }

    /**
     * Returns the Header for the authentication when calling the NEW API.
     *
     * !!Only use this method in API services!!
     */
    public getNewAuthHeaderAsString(token: string): string {
        const auth_header = token.toString().trim();
        return auth_header;
    }
}
