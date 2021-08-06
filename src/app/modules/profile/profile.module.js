"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var profile_component_1 = require("./profile/profile.component");
var router_1 = require("nativescript-angular/router");
var ac_shared_logic_module_1 = require("../../../ACCommon/ac-shared-logic.module");
var shared_components_module_1 = require("../shared/shared-components.module");
var profile_routing_1 = require("./profile.routing");
var image_helper_1 = require("../../../ACCommon/helpers/image.helper");
var ProfileModule = /** @class */ (function () {
    function ProfileModule() {
    }
    ProfileModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.NativeScriptRouterModule.forChild(profile_routing_1.profileRoutes),
                ac_shared_logic_module_1.AcSharedLogicModule,
                shared_components_module_1.SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
            ],
            exports: [],
            declarations: [
                profile_component_1.ProfileComponent
            ],
            providers: [
                image_helper_1.ImageHelper
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], ProfileModule);
    return ProfileModule;
}());
exports.ProfileModule = ProfileModule;
