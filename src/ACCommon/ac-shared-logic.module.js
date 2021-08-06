"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("nativescript-angular/common");
var core_2 = require("@ngx-translate/core");
var directives_1 = require("./directives");
var hideKeyboard_directive_1 = require("./directives/hideKeyboard.directive");
var AcSharedLogicModule = /** @class */ (function () {
    function AcSharedLogicModule() {
    }
    AcSharedLogicModule = __decorate([
        core_1.NgModule({
            declarations: __spreadArrays(directives_1.DIRECTIVES, [
                hideKeyboard_directive_1.HideKeyboardDirective
            ]),
            exports: __spreadArrays([
                common_1.NativeScriptCommonModule,
                core_2.TranslateModule
            ], directives_1.DIRECTIVES, [
                hideKeyboard_directive_1.HideKeyboardDirective
            ])
        })
    ], AcSharedLogicModule);
    return AcSharedLogicModule;
}());
exports.AcSharedLogicModule = AcSharedLogicModule;
