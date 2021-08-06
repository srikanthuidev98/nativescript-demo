import { Routes } from '@angular/router';
import { CheckinStatusComponent } from './checkin-status/checkin-status.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { CurrentPeriodComponent } from './current-period/current-period.component';
import { RecordAudioComponent } from './record-audio/record-audio.component';
import { CheckoutContainerComponent } from './checkout-container/checkout-container.component';
import { SignatureComponent } from './signature/signature.component';
import { CheckoutActivitiesComponent } from './checkout-activities/checkout-activities.component';
import { ClientAvailableComponent } from './client-available/client-available.component';
import { LocationAlertComponent } from './location-alert/location-alert.component';
import { ReminderComponent } from './reminder/reminder.component';
import { AdditionalQuestionsComponent } from './additional-questions/additional-questions.component';
import { AddShiftComponent } from './add-shift/add-shift.component';


export const statusRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'checkin', component: CheckinStatusComponent },
            { path: 'checkout', component: CheckoutContainerComponent },
            { path: 'clients-list/:from', component: ClientsListComponent },
            { path: 'current-period', component: CurrentPeriodComponent },
            { path: 'record-audio', component: RecordAudioComponent },
            { path: 'signature', component: SignatureComponent },
            { path: 'add-shift', component: AddShiftComponent },
            { path: 'checkout-activities', component: CheckoutActivitiesComponent },
            { path: 'client-available', component: ClientAvailableComponent },
            { path: 'location-alert', component: LocationAlertComponent },
            { path: 'reminder', component: ReminderComponent },
            { path: 'additional-questions', component: AdditionalQuestionsComponent },
        ]
    },
];
