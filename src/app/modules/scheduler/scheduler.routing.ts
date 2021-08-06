import { Routes } from '@angular/router';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';


export const schedulerRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: MyScheduleComponent},
            { path: 'visit-details', component: VisitDetailsComponent },
        ]
    },
];
