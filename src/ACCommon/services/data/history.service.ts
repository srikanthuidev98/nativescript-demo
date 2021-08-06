import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { IADL, Visit, Payroll, EditVisit } from '../../models';
import { ApiHelperService } from './api-helper.service';
import { map } from 'rxjs/operators';


@Injectable()
export class HistoryService {

    constructor(
        private http: HttpClient,
        private apiHelper: ApiHelperService) { }

    getIADLS(token: string) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<IADL[]>(this.apiHelper.IADLSUrl(),
            { headers: this.apiHelper.getAuthHeader(token) }).pipe(map((res: IADL[]) => {
                for (let i = 0; i < res.length; i++) {
                    res[i].Value = 0;
                }
                return res;
        }));
    }

    /**
     * New Token is required!!
     */
    apiGetPayroll(token: string, customerId: number, UCGID: number): Observable<Payroll[]> {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<Payroll[]>(this.apiHelper.getPayrollUrl(customerId, UCGID),
            { headers: this.apiHelper.getNewAuthHeader(token) }
        );
    }

    /**
     * New Token is required!!
     */
    apiGetVisits(token: string, payrollId: number, iadlDefault: { string: string; dictionary: any; }): Observable<Visit[]> {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<Visit[]>(this.apiHelper.getVisitsUrl(payrollId),
            { headers: this.apiHelper.getNewAuthHeader(token) }).pipe(map((res: Visit[]) => {
                for (let i = 0; i < res.length; i++) {
                    if (!res[i].IADLS) {
                        res[i].IADLS = iadlDefault.string;
                        res[i].AdditionalServices = iadlDefault.dictionary;
                    }
                }
                return res;
        }));
    }

    /**
     * New Token is required!!
     */
    updateVisit(editVisits: EditVisit[], token: string): Observable<Visit> {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.put<Visit>(this.apiHelper.updateVisitUrl(), editVisits,
            { headers: this.apiHelper.getNewAuthHeader(token) }
        );
    }
}
