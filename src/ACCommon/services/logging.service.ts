import { Injectable } from '@angular/core';
import { AppCenterAnalytics } from 'nativescript-microsoft-appcenter';
import { LocalStorageService } from '../storage/local-storage';

@Injectable()
export class LoggingService {
    private appCenterAnalytics: AppCenterAnalytics;
    private caregiverId = '0';

    constructor() {
        if (!this.appCenterAnalytics) {
            console.log('Setting up AppCenterAnalytics');
            this.appCenterAnalytics = new AppCenterAnalytics;

            this.updateCaregiverId();
        }
    }

    private updateCaregiverId() {
        const caregiverState = LocalStorageService.getAppState();

        if (caregiverState && caregiverState.caregiver) {
            this.caregiverId = `${caregiverState.caregiver.Id}`;
        } else {
            this.caregiverId = '0';
        }
    }

    trackEvent(eventName: string, eventValue: string, updateCaregiverId = false) {
        if (updateCaregiverId) {
            this.updateCaregiverId();
        }

        const date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000)
                    .toISOString().substr(0, 19).replace('T', ' ');

        const eventLog = `${date} -> ${this.caregiverId} - ${eventName}: ${eventValue}`;

        console.log(eventLog);

        this.appCenterAnalytics.trackEvent(`${this.caregiverId}`, [{key: eventName, value: eventValue}]);
    }
}
