"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_list_component_1 = require("./history-list/history-list.component");
var period_details_component_1 = require("./period-details/period-details.component");
var shift_details_component_1 = require("./shift-details/shift-details.component");
exports.historyRoutes = [
    {
        path: '',
        children: [
            { path: '', component: history_list_component_1.HistoryListComponent },
            { path: 'period-details', component: period_details_component_1.PeriodDetailsComponent },
            { path: 'shift-details', component: shift_details_component_1.ShiftDetailsComponent },
        ]
    },
];
