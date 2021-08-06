"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("@ngxs/store");
var states_1 = require("../../../../ACCommon/states");
var rxjs_1 = require("rxjs");
var CheckoutContainerComponent = /** @class */ (function () {
    function CheckoutContainerComponent() {
        this.selectedTab = 0;
    }
    CheckoutContainerComponent.prototype.ngOnInit = function () { };
    CheckoutContainerComponent.prototype.tabTap = function (tabNumber) {
        this.selectedTab = tabNumber;
    };
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentShift),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckoutContainerComponent.prototype, "shift$", void 0);
    CheckoutContainerComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-container',
            templateUrl: './checkout-container.component.html',
            styleUrls: ['./checkout-container.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], CheckoutContainerComponent);
    return CheckoutContainerComponent;
}());
exports.CheckoutContainerComponent = CheckoutContainerComponent;
