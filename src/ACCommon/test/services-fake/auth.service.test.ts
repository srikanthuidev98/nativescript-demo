import { Injectable } from '@angular/core';
import { LoginForm } from '../../models/forms/login-form.model';
import { Observable, of, throwError } from 'rxjs';
import { Caregiver } from '../../models';

@Injectable()
export class FakeAuthService {

    constructor() {}

    public login(loginInfo: LoginForm): Observable<Caregiver>  {
        if (loginInfo.Email === 'test@email.com' && loginInfo.Password === 'Password') {
            return of({
                'Name': 'Evangeline Baigan',
                'Token': 'OjQxMDE5OmouZm93bGVyQGFzc3VyaWNhcmUuY29tOlBhc3N3b3JkMTE=',
                'APIToken': 'Z+CfDS8FB0HaNFsN0XeD0ACyuE8gI4P8yjLlFl6wkz5UiNjeyCEQ5s79TsPyp9XG',
                'Expires': new Date(),
                'RefreshToken': 'Q5dSGbSvl3qSIU6VXRj4xfkiHB/3HoTNT6fTpXXswKsZHJzos4tSHCCTJzFR3YVkq+sExMIK+'
                + 'vwPq2F13FQsSvq1CYd29e2MWGce55EwBvKqlzfM7xchBFrdtcjUVik9',
                'Id': 41019
            });
        } else {
            return throwError('Failed login');
        }
    }
}
