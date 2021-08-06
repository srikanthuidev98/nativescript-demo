"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var action_bar_component_1 = require("./action-bar/action-bar.component");
var ac_shared_logic_module_1 = require("../../../ACCommon/ac-shared-logic.module");
var shift_component_1 = require("./shift/shift.component");
var pay_detail_component_1 = require("./pay-detail/pay-detail.component");
var timer_component_1 = require("./timer/timer.component");
var notification_card_component_1 = require("./notification-card/notification-card.component");
var ac_textfield_component_1 = require("./ac-textfield/ac-textfield.component");
var payrate_scroller_component_1 = require("./payrate-scroller/payrate-scroller.component");
var question_component_1 = require("./question/question.component");
var SharedComponentsModule = /** @class */ (function () {
    function SharedComponentsModule() {
    }
    SharedComponentsModule = __decorate([
        core_1.NgModule({
            imports: [
                ac_shared_logic_module_1.AcSharedLogicModule
            ],
            declarations: [
                action_bar_component_1.ActionBarComponent,
                shift_component_1.ShiftComponent,
                pay_detail_component_1.PayDetailComponent,
                timer_component_1.TimerComponent,
                notification_card_component_1.NotificationCardComponent,
                ac_textfield_component_1.AcTextfieldComponent,
                payrate_scroller_component_1.PayrateScrollerComponent,
                question_component_1.QuestionComponent
            ],
            exports: [
                action_bar_component_1.ActionBarComponent,
                shift_component_1.ShiftComponent,
                pay_detail_component_1.PayDetailComponent,
                timer_component_1.TimerComponent,
                notification_card_component_1.NotificationCardComponent,
                ac_textfield_component_1.AcTextfieldComponent,
                payrate_scroller_component_1.PayrateScrollerComponent,
                question_component_1.QuestionComponent
            ],
            providers: [],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        })
    ], SharedComponentsModule);
    return SharedComponentsModule;
}());
exports.SharedComponentsModule = SharedComponentsModule;
