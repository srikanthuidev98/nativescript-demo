"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkin_status_component_1 = require("./checkin-status/checkin-status.component");
var clients_list_component_1 = require("./clients-list/clients-list.component");
var period_total_component_1 = require("./period-total/period-total.component");
var record_audio_component_1 = require("./record-audio/record-audio.component");
var checkout_container_component_1 = require("./checkout-container/checkout-container.component");
var signature_component_1 = require("./signature/signature.component");
var checkout_activities_component_1 = require("./checkout-activities/checkout-activities.component");
var client_available_component_1 = require("./client-available/client-available.component");
var timepoints_component_1 = require("./timepoints/timepoints.component");
var reminder_component_1 = require("./reminder/reminder.component");
var time_check_component_1 = require("./time-check/time-check.component");
var time_update_component_1 = require("./time-update/time-update.component");
exports.statusRoutes = [
    {
        path: '',
        children: [
            { path: 'checkin', component: checkin_status_component_1.CheckinStatusComponent },
            { path: 'checkout', component: checkout_container_component_1.CheckoutContainerComponent },
            { path: 'clients-list/:from', component: clients_list_component_1.ClientsListComponent },
            { path: 'period-total', component: period_total_component_1.PeriodTotalComponent },
            { path: 'record-audio', component: record_audio_component_1.RecordAudioComponent },
            { path: 'signature', component: signature_component_1.SignatureComponent },
            { path: 'checkout-activities', component: checkout_activities_component_1.CheckoutActivitiesComponent },
            { path: 'client-available', component: client_available_component_1.ClientAvailableComponent },
            { path: 'timepoints', component: timepoints_component_1.TimepointsComponent },
            { path: 'reminder', component: reminder_component_1.ReminderComponent },
            { path: 'time-check', component: time_check_component_1.TimeCheckComponent },
            { path: 'time-update', component: time_update_component_1.TimeUpdateComponent },
        ]
    },
];
