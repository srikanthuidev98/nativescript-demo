"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var services_1 = require("./services");
var app_config_module_1 = require("./config/app-config.module");
var guards_1 = require("./guards");
var ACCommonModule = /** @class */ (function () {
    function ACCommonModule(parentModule) {
        if (parentModule) {
            throw new Error('ACCommonModule has already been loaded. Import ACCommonModule from AppModule only.');
        }
    }
    ACCommonModule = __decorate([
        core_1.NgModule({
            imports: [
                app_config_module_1.AppConfigModule,
            ],
            exports: [],
            declarations: [],
            providers: __spreadArrays(services_1.SERVICES, guards_1.GUARDS),
        }),
        __param(0, core_1.Optional()), __param(0, core_1.SkipSelf()),
        __metadata("design:paramtypes", [ACCommonModule])
    ], ACCommonModule);
    return ACCommonModule;
}());
exports.ACCommonModule = ACCommonModule;
