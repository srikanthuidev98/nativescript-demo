import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Visit, Question, TimecardSubmitRequest, LocationAlertOption } from '../../../ACCommon/models';
import { ApiHelperService } from './api-helper.service';

@Injectable()
export class ShiftService {

    constructor(private http: HttpClient, private apiHelper: ApiHelperService) {}

    submitAction(token: string, submitRequest: TimecardSubmitRequest) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.post<Visit>(this.apiHelper.submitActionUrl(), submitRequest,
            { headers: this.apiHelper.getNewAuthHeader(token) });
    }

    /**
     * New Token is required!!
     */
    apiGetLastVisit(token: string, uniqueCaregiverId: number): Observable<Visit[]> {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<Visit[]>(this.apiHelper.lastVisitUrl(uniqueCaregiverId),
            { headers: this.apiHelper.getNewAuthHeader(token) }
        );
    }

    /**
     * New Token is required!!
     * @param questions - answers varible must cannot be null
     */
    submitAdditionalQuestions(token: string, questions: Question[], caregiverId: number) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.post<Question[]>(this.apiHelper.submitAdditionalQuestionsUrl(caregiverId), questions,
            { headers: this.apiHelper.getNewAuthHeader(token) });
    }

    apiLocationAlertOptions(token: string) {
        // const check = this.apiHelper.verifyInternet();
        // if (!check.result) {
        //     return throwError(check);
        // }

        const test: LocationAlertOption[] = [
            {
                id: 0,
                text: 'I transported my client',
                commentRequired: true
            }, {
                id: 1,
                text: 'I ran errands for my client',
                commentRequired: true
            }, {
                id: 2,
                text: 'I did not leave the location',
                commentRequired: false
            }, {
                id: 3,
                text: 'Other',
                commentRequired: true
            }
        ];
        return test;
        // return this.http.post<Question[]>(this.apiHelper.submitAdditionalQuestionsUrl(caregiverId), questions,
        //     { headers: this.apiHelper.getNewAuthHeader(token) });
    }
}
