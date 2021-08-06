import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HistoryListComponent } from './history-list/history-list.component';
import { PeriodDetailsComponent } from './period-details/period-details.component';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { historyRoutes } from './history.routing';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';
import { EditCheckInTimeComponent } from './edit-check-in-time/edit-check-in-time.component';
import { EditCheckOutTimeComponent } from './edit-check-out-time/edit-check-out-time.component';
import { EditChangesComponent } from './edit-changes/edit-changes.component';
import { EditVisitContainerComponent } from './edit-visit-container/edit-visit-container.component';


@NgModule({
    imports: [
        NativeScriptRouterModule.forChild(historyRoutes),
        AcSharedLogicModule, // Import into all Modules
        SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
    ],
    exports: [],
    declarations: [
        HistoryListComponent,
        PeriodDetailsComponent,
        ShiftDetailsComponent,
        EditCheckInTimeComponent,
        EditCheckOutTimeComponent,
        EditChangesComponent,
        EditVisitContainerComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HistoryModule { }
