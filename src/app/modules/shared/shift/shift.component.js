"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var store_1 = require("@ngxs/store");
var states_1 = require("../../../../ACCommon/states");
var helpers_1 = require("../../../../ACCommon/helpers");
/**
 * Two ways to use this component.
 *
 * 1. Send a shift$ observable. - Needs client$ object also.
 * 2. Send a historyDetail object. - Needs client$ object also.
 *
 * Ends up giving the same information, just from different sources.
 */
var ShiftComponent = /** @class */ (function () {
    function ShiftComponent(routerHelper) {
        this.routerHelper = routerHelper;
        // Option 1 - Send a shift$ observable. - Needs client$ object also.
        this.shift$ = undefined;
        // Option 2 - Send a historyDetail object. - Needs client$ object also.
        this.historyDetail = undefined;
        this.client$ = undefined;
        this.client = undefined;
        this.dualClient = undefined;
        this.showReminder = false;
        this.showChevron = false;
        this.showDualClient = false;
    }
    ShiftComponent.prototype.ngOnInit = function () { };
    ShiftComponent.prototype.reminderTap = function () {
        console.log('Set Reminder');
        this.routerHelper.navigate(['/status/reminder']);
    };
    __decorate([
        store_1.Select(states_1.ShiftState.getReminderDate),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftComponent.prototype, "reminderDate$", void 0);
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentDualClient),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftComponent.prototype, "dualClient$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftComponent.prototype, "shift$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ShiftComponent.prototype, "historyDetail", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftComponent.prototype, "client$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ShiftComponent.prototype, "client", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ShiftComponent.prototype, "dualClient", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ShiftComponent.prototype, "showReminder", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ShiftComponent.prototype, "showChevron", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ShiftComponent.prototype, "showDualClient", void 0);
    ShiftComponent = __decorate([
        core_1.Component({
            selector: 'app-shift',
            templateUrl: './shift.component.html',
            styleUrls: ['./shift.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.RouterHelper])
    ], ShiftComponent);
    return ShiftComponent;
}());
exports.ShiftComponent = ShiftComponent;
