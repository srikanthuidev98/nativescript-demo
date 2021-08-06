"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var checkin_status_component_1 = require("./checkin-status/checkin-status.component");
var checkout_status_component_1 = require("./checkout-status/checkout-status.component");
var clients_list_component_1 = require("./clients-list/clients-list.component");
var period_total_component_1 = require("./period-total/period-total.component");
var record_audio_component_1 = require("./record-audio/record-audio.component");
var router_1 = require("nativescript-angular/router");
var common_1 = require("@angular/common");
var status_routing_1 = require("./status.routing");
var ac_shared_logic_module_1 = require("../../../ACCommon/ac-shared-logic.module");
var shared_components_module_1 = require("../shared/shared-components.module");
var checkout_container_component_1 = require("./checkout-container/checkout-container.component");
var signature_component_1 = require("./signature/signature.component");
var checkout_activities_component_1 = require("./checkout-activities/checkout-activities.component");
var forms_1 = require("nativescript-angular/forms");
var client_available_component_1 = require("./client-available/client-available.component");
var timepoints_component_1 = require("./timepoints/timepoints.component");
var reminder_component_1 = require("./reminder/reminder.component");
var signature_pad_component_1 = require("./signature-pad/signature-pad.component");
var angular_1 = require("nativescript-drop-down/angular");
var angular_2 = require("@nstudio/nativescript-checkbox/angular");
var time_check_component_1 = require("./time-check/time-check.component");
var time_update_component_1 = require("./time-update/time-update.component");
var StatusModule = /** @class */ (function () {
    function StatusModule() {
    }
    StatusModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.NativeScriptRouterModule.forChild(status_routing_1.statusRoutes),
                ac_shared_logic_module_1.AcSharedLogicModule,
                shared_components_module_1.SharedComponentsModule,
                forms_1.NativeScriptFormsModule,
                angular_1.DropDownModule,
                angular_2.TNSCheckBoxModule
            ],
            exports: [],
            declarations: [
                checkin_status_component_1.CheckinStatusComponent,
                checkout_status_component_1.CheckoutStatusComponent,
                clients_list_component_1.ClientsListComponent,
                period_total_component_1.PeriodTotalComponent,
                record_audio_component_1.RecordAudioComponent,
                checkout_container_component_1.CheckoutContainerComponent,
                signature_component_1.SignatureComponent,
                checkout_activities_component_1.CheckoutActivitiesComponent,
                client_available_component_1.ClientAvailableComponent,
                timepoints_component_1.TimepointsComponent,
                reminder_component_1.ReminderComponent,
                signature_pad_component_1.SignaturePadComponent,
                time_check_component_1.TimeCheckComponent,
                time_update_component_1.TimeUpdateComponent
            ],
            providers: [
                common_1.DatePipe
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ],
            entryComponents: [
                signature_pad_component_1.SignaturePadComponent
            ]
        })
    ], StatusModule);
    return StatusModule;
}());
exports.StatusModule = StatusModule;
