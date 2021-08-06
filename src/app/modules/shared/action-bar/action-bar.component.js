"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app = require("tns-core-modules/application");
var helpers_1 = require("../../../../ACCommon/helpers");
var ActionBarComponent = /** @class */ (function () {
    function ActionBarComponent(routerHelper) {
        this.routerHelper = routerHelper;
        this.backBtnText = undefined;
    }
    ActionBarComponent.prototype.onDrawerButtonTap = function () {
        var sideDrawer = app.getRootView();
        sideDrawer.showDrawer();
    };
    ActionBarComponent.prototype.onAndroidBack = function () {
        this.routerHelper.backToPreviousPage();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ActionBarComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ActionBarComponent.prototype, "backBtnText", void 0);
    ActionBarComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-action-bar',
            templateUrl: 'action-bar.component.html',
            styleUrls: ['action-bar.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.RouterHelper])
    ], ActionBarComponent);
    return ActionBarComponent;
}());
exports.ActionBarComponent = ActionBarComponent;
