import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Client } from '../../../ACCommon/models';
import { ApiHelperService } from './api-helper.service';
import { customSort } from '../../../ACCommon/helpers/sort.helper';

@Injectable()
export class ClientService {

    constructor(private http: HttpClient, private apiHelper: ApiHelperService) { }

    apiGetClients(token: string, caregiverId: number): Observable<Client[]> {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<Client[]>(this.apiHelper.newClientsUrl(caregiverId),
            { headers: this.apiHelper.getNewAuthHeader(token) })
            .pipe(map((res: Client[]) => {
                customSort(res, 'Name');
                return res;
        }));
    }
}
