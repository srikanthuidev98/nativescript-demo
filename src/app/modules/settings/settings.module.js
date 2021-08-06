"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var settings_component_1 = require("./settings/settings.component");
var router_1 = require("nativescript-angular/router");
var settings_routing_1 = require("./settings.routing");
var ac_shared_logic_module_1 = require("../../../ACCommon/ac-shared-logic.module");
var shared_components_module_1 = require("../shared/shared-components.module");
var change_password_component_1 = require("./change-password/change-password.component");
var contact_us_component_1 = require("./contact-us/contact-us.component");
var faq_component_1 = require("./faq/faq.component");
var SettingsModule = /** @class */ (function () {
    function SettingsModule() {
    }
    SettingsModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.NativeScriptRouterModule.forChild(settings_routing_1.settingsRoutes),
                ac_shared_logic_module_1.AcSharedLogicModule,
                shared_components_module_1.SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
            ],
            exports: [],
            declarations: [
                settings_component_1.SettingsComponent,
                change_password_component_1.ChangePasswordComponent,
                contact_us_component_1.ContactUsComponent,
                faq_component_1.FaqComponent
            ],
            providers: [],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], SettingsModule);
    return SettingsModule;
}());
exports.SettingsModule = SettingsModule;
