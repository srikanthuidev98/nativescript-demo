import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { Schedule } from '../../../ACCommon/models';
import { ApiHelperService } from './api-helper.service';
import { map } from 'rxjs/operators';
import { DateService } from '../date.service';

@Injectable()
export class ScheduleService {

    constructor(private http: HttpClient, private apiHelper: ApiHelperService) { }

    apiGetSchedule(token: string, caregiverId: number, fromDate: Date, toDate: Date) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<Schedule>(
            this.apiHelper.getScheduleUrl(caregiverId, fromDate.toISOString(), toDate.toISOString()),
            { headers: this.apiHelper.getNewAuthHeader(token) }
            ).pipe(map((res: Schedule) => { // The dates come back as strings, so convert to Dates before using.
                for (let i = 0; i < res.visits.length; i++) {
                    const checkInDate = res.visits[i].checkInTime as any;
                    const checkOutDate = res.visits[i].checkOutTime as any;
                    res.visits[i].checkInTime = DateService.getDate(checkInDate as string, true);
                    res.visits[i].checkOutTime = DateService.getDate(checkOutDate as string, true);
                }
                return res;
            }));
    }
}
