import { Routes } from '@angular/router';
import { HistoryListComponent } from './history-list/history-list.component';
import { PeriodDetailsComponent } from './period-details/period-details.component';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';
import { EditCheckInTimeComponent } from './edit-check-in-time/edit-check-in-time.component';
import { EditCheckOutTimeComponent } from './edit-check-out-time/edit-check-out-time.component';
import { EditChangesComponent } from './edit-changes/edit-changes.component';
import { EditVisitContainerComponent } from './edit-visit-container/edit-visit-container.component';
import { CheckoutActivitiesComponent } from '../status/checkout-activities/checkout-activities.component';


export const historyRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: HistoryListComponent },
            { path: 'period-details', component: PeriodDetailsComponent },
            { path: 'shift-details', component: ShiftDetailsComponent },
            {
                path: 'edit-visit', component: EditVisitContainerComponent, children: [
                    { path: 'edit-check-in-time', component: EditCheckInTimeComponent,
                    outlet: 'editVisitRouterOutlet', data: { animation: { value: 'edit-check-in-time' } } },
                    { path: 'edit-check-out-time', component: EditCheckOutTimeComponent,
                    outlet: 'editVisitRouterOutlet', data: { animation: { value: 'edit-check-out-time' } } },
                    { path: 'checkout-activities', component: CheckoutActivitiesComponent,
                    outlet: 'editVisitRouterOutlet', data: { animation: { value: 'checkout-activities' } } },
                    { path: 'edit-changes', component: EditChangesComponent,
                    outlet: 'editVisitRouterOutlet', data: { animation: { value: 'edit-changes' } } },
                ]
            },
        ]
    },
];
