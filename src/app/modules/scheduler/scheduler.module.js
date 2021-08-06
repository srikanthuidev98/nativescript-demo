"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var ac_shared_logic_module_1 = require("../../../ACCommon/ac-shared-logic.module");
var shared_components_module_1 = require("../shared/shared-components.module");
var scheduler_routing_1 = require("./scheduler.routing");
var calendar_component_1 = require("./calendar/calendar.component");
var calendar_card_component_1 = require("./calendar-card/calendar-card.component");
var visit_details_component_1 = require("./visit-details/visit-details.component");
var SchedulerModule = /** @class */ (function () {
    function SchedulerModule() {
    }
    SchedulerModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.NativeScriptRouterModule.forChild(scheduler_routing_1.schedulerRoutes),
                ac_shared_logic_module_1.AcSharedLogicModule,
                shared_components_module_1.SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
            ],
            exports: [],
            declarations: [calendar_component_1.CalendarComponent, calendar_card_component_1.CalendarCardComponent, visit_details_component_1.VisitDetailsComponent],
            providers: [],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], SchedulerModule);
    return SchedulerModule;
}());
exports.SchedulerModule = SchedulerModule;
