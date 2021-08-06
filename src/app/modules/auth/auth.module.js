"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var login_component_1 = require("./login/login.component");
var angular_1 = require("nativescript-ui-dataform/angular");
var forgot_password_component_1 = require("./forgot-password/forgot-password.component");
var hideActionBar_directive_1 = require("../../../ACCommon/directives/hideActionBar.directive");
var ac_shared_logic_module_1 = require("../../../ACCommon/ac-shared-logic.module");
var router_1 = require("nativescript-angular/router");
var auth_routing_1 = require("./auth.routing");
var shared_components_module_1 = require("../shared/shared-components.module");
var touch_id_terms_component_1 = require("./touch-id-terms/touch-id-terms.component");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.NativeScriptRouterModule.forChild(auth_routing_1.authRoutes),
                angular_1.NativeScriptUIDataFormModule,
                ac_shared_logic_module_1.AcSharedLogicModule,
                shared_components_module_1.SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
            ],
            exports: [],
            declarations: [
                login_component_1.LoginComponent,
                forgot_password_component_1.ForgotPasswordComponent,
                hideActionBar_directive_1.HideActionBarDirective,
                touch_id_terms_component_1.TouchIdTermsComponent
            ],
            providers: [],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
