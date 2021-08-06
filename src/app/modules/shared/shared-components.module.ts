import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { ShiftComponent } from './shift/shift.component';
import { PayDetailComponent } from './pay-detail/pay-detail.component';
import { TimerComponent } from './timer/timer.component';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { AcTextfieldComponent } from './ac-textfield/ac-textfield.component';
import { PayrateScrollerComponent } from './payrate-scroller/payrate-scroller.component';
import { QuestionComponent } from './question/question.component';
import { AcDropdownComponent } from './ac-dropdown/ac-dropdown.component';
import { EditVisitHeaderComponent } from './edit-visit-header/edit-visit-header.component';
import { AcTimePickerComponent } from './ac-time-picker/ac-time-picker.component';
import { AcCalendarComponent } from './ac-calendar/ac-calendar.component';
import { CalendarCardComponent } from './calendar-card/calendar-card.component';
import { CalendarServicesComponent } from './calendar-card/calendar-services/calendar-services.component';
import { ServicesModalComponent } from './calendar-card/services-modal/services-modal.component';
import { AcRadioButtonComponent } from './ac-radio-button/ac-radio-button.component';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';


@NgModule({
    imports: [
        AcSharedLogicModule
    ],
    declarations: [
        ActionBarComponent,
        ShiftComponent,
        PayDetailComponent,
        TimerComponent,
        NotificationCardComponent,
        AcTextfieldComponent,
        PayrateScrollerComponent,
        QuestionComponent,
        AcDropdownComponent,
        EditVisitHeaderComponent,
        AcTimePickerComponent,
        AcCalendarComponent,
        CalendarCardComponent,
        CalendarServicesComponent,
        ServicesModalComponent,
        AcRadioButtonComponent,
        CustomDialogComponent,
    ],
    exports: [
        ActionBarComponent,
        ShiftComponent,
        PayDetailComponent,
        TimerComponent,
        NotificationCardComponent,
        AcTextfieldComponent,
        PayrateScrollerComponent,
        QuestionComponent,
        AcDropdownComponent,
        EditVisitHeaderComponent,
        AcTimePickerComponent,
        AcCalendarComponent,
        CalendarCardComponent,
        CalendarServicesComponent,
        ServicesModalComponent,
        AcRadioButtonComponent,
        CustomDialogComponent,
    ],
    providers: [],
    entryComponents: [
        ServicesModalComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedComponentsModule { }
