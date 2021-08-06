"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calendar_component_1 = require("./calendar/calendar.component");
var visit_details_component_1 = require("./visit-details/visit-details.component");
exports.schedulerRoutes = [
    {
        path: '',
        children: [
            { path: '', component: calendar_component_1.CalendarComponent },
            { path: 'visit-details', component: visit_details_component_1.VisitDetailsComponent },
        ]
    },
];
