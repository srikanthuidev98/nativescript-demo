import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { schedulerRoutes } from './scheduler.routing';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';



@NgModule({
    imports: [
        NativeScriptRouterModule.forChild(schedulerRoutes),
        AcSharedLogicModule, // Import into all Modules
        SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
    ],
    exports: [],
    declarations: [
        MyScheduleComponent,
        VisitDetailsComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SchedulerModule { }
