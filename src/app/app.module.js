"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var http_client_1 = require("nativescript-angular/http-client");
var angular_1 = require("nativescript-ui-sidedrawer/angular");
var store_1 = require("@ngxs/store");
var emitter_1 = require("@ngxs-labs/emitter");
var app_component_1 = require("./app.component");
var auth_module_1 = require("./modules/auth/auth.module");
var states_1 = require("../ACCommon/states");
var accommon_module_1 = require("../ACCommon/accommon.module");
var http_1 = require("@angular/common/http");
var core_2 = require("@ngx-translate/core");
var http_loader_1 = require("@ngx-translate/http-loader");
var ac_shared_logic_module_1 = require("../ACCommon/ac-shared-logic.module");
var router_1 = require("nativescript-angular/router");
var app_routing_1 = require("./app.routing");
var shared_components_module_1 = require("./modules/shared/shared-components.module");
var splash_component_1 = require("./splash/splash.component");
var nativescript_microsoft_appcenter_1 = require("nativescript-microsoft-appcenter");
var angular_2 = require("nativescript-ui-calendar/angular");
function HttpLoaderFactory(http) {
    return new http_loader_1.TranslateHttpLoader(http);
}
exports.HttpLoaderFactory = HttpLoaderFactory;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                splash_component_1.SplashComponent,
            ],
            imports: [
                router_1.NativeScriptRouterModule.forRoot(app_routing_1.appRoutes),
                accommon_module_1.ACCommonModule,
                ac_shared_logic_module_1.AcSharedLogicModule,
                shared_components_module_1.SharedComponentsModule,
                auth_module_1.AuthModule,
                http_client_1.NativeScriptHttpClientModule,
                angular_1.NativeScriptUISideDrawerModule,
                nativescript_module_1.NativeScriptModule,
                angular_2.NativeScriptUICalendarModule,
                core_2.TranslateModule.forRoot({
                    loader: {
                        provide: core_2.TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [http_1.HttpClient]
                    }
                }),
                store_1.NgxsModule.forRoot(__spreadArrays(states_1.STATES)),
                emitter_1.NgxsEmitPluginModule.forRoot(),
            ],
            exports: [],
            providers: [
                nativescript_microsoft_appcenter_1.AppCenter,
                nativescript_microsoft_appcenter_1.AppCenterAnalytics,
                nativescript_microsoft_appcenter_1.AppCenterCrashes
            ],
            bootstrap: [app_component_1.AppComponent],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
