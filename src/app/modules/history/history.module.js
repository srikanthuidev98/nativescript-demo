"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var history_list_component_1 = require("./history-list/history-list.component");
var period_details_component_1 = require("./period-details/period-details.component");
var router_1 = require("nativescript-angular/router");
var history_routing_1 = require("./history.routing");
var ac_shared_logic_module_1 = require("../../../ACCommon/ac-shared-logic.module");
var shared_components_module_1 = require("../shared/shared-components.module");
var shift_details_component_1 = require("./shift-details/shift-details.component");
var HistoryModule = /** @class */ (function () {
    function HistoryModule() {
    }
    HistoryModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.NativeScriptRouterModule.forChild(history_routing_1.historyRoutes),
                ac_shared_logic_module_1.AcSharedLogicModule,
                shared_components_module_1.SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
            ],
            exports: [],
            declarations: [
                history_list_component_1.HistoryListComponent,
                period_details_component_1.PeriodDetailsComponent,
                shift_details_component_1.ShiftDetailsComponent
            ],
            providers: [],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], HistoryModule);
    return HistoryModule;
}());
exports.HistoryModule = HistoryModule;
