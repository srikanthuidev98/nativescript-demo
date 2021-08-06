import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckinStatusComponent } from './checkin-status/checkin-status.component';
import { CheckoutStatusComponent } from './checkout-status/checkout-status.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { CurrentPeriodComponent } from './current-period/current-period.component';
import { RecordAudioComponent } from './record-audio/record-audio.component';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { DatePipe } from '@angular/common';

import { statusRoutes } from './status.routing';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { CheckoutContainerComponent } from './checkout-container/checkout-container.component';
import { SignatureComponent } from './signature/signature.component';
import { CheckoutActivitiesComponent } from './checkout-activities/checkout-activities.component';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ClientAvailableComponent } from './client-available/client-available.component';
import { LocationAlertComponent } from './location-alert/location-alert.component';
import { ReminderComponent } from './reminder/reminder.component';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';
import { AdditionalQuestionsComponent } from './additional-questions/additional-questions.component';
import { AddShiftComponent } from './add-shift/add-shift.component';


@NgModule({
    imports: [
        NativeScriptRouterModule.forChild(statusRoutes),
        AcSharedLogicModule, // Import into all Modules
        SharedComponentsModule, // Import into any modules that need shared components ie: ActionBar
        NativeScriptFormsModule,
        TNSCheckBoxModule
    ],
    exports: [],
    declarations: [
        CheckinStatusComponent,
        CheckoutStatusComponent,
        ClientsListComponent,
        CurrentPeriodComponent,
        RecordAudioComponent,
        CheckoutContainerComponent,
        SignatureComponent,
        CheckoutActivitiesComponent,
        ClientAvailableComponent,
        LocationAlertComponent,
        ReminderComponent,
        SignaturePadComponent,
        AdditionalQuestionsComponent,
        AddShiftComponent,
    ],
    providers: [
        DatePipe
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        SignaturePadComponent
    ]
})
export class StatusModule { }
