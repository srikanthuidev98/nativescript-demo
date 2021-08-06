"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var helpers_1 = require("../../../../ACCommon/helpers");
var store_1 = require("@ngxs/store");
var states_1 = require("../../../../ACCommon/states");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var emitter_1 = require("@ngxs-labs/emitter");
var ClientAvailableComponent = /** @class */ (function () {
    function ClientAvailableComponent(routerHelper, dialogHelper) {
        this.routerHelper = routerHelper;
        this.dialogHelper = dialogHelper;
        this.title = '';
        this.yesSelected = false;
        this.noSelected = false;
        this.isDualClient = false;
    }
    ClientAvailableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.client$.pipe(operators_1.first()).subscribe(function (client) {
            _this.dualClient$.pipe(operators_1.first()).subscribe(function (dualClient) {
                if (dualClient) {
                    _this.isDualClient = true;
                    _this.title = "Are the Activities of Daily Living provided to " + dualClient.c1.Name + " during this shift the " +
                        ("same as were provided to " + dualClient.c2.Name + "?");
                }
                else {
                    _this.title = "Is your client " + client.Name + " available to approve this shift?";
                }
            });
        });
    };
    // This method is called everytime the layout is loaded. Used to reset the colors. Only need to reset the 'yes' colors.
    ClientAvailableComponent.prototype.loaded = function () {
        this.yesSelected = false;
        this.noSelected = false;
    };
    ClientAvailableComponent.prototype.yesTap = function () {
        var _this = this;
        this.yesSelected = true;
        setTimeout(function () {
            if (_this.isDualClient) {
                _this.shiftAction$.pipe(operators_1.first()).subscribe(function (shiftAction) {
                    setTimeout(function () {
                        _this.submitAction.emit(shiftAction);
                    }, 500);
                });
            }
            else {
                _this.routerHelper.navigate(['/status/checkout-activities']);
            }
        }, 50);
    };
    ClientAvailableComponent.prototype.noTap = function () {
        var _this = this;
        this.noSelected = true;
        if (this.isDualClient) {
            this.routerHelper.navigate(['/status/checkout-activities', { dualClientNum: '1' }]);
        }
        else {
            this.shiftAction$.pipe(operators_1.first()).subscribe(function (shiftAction) {
                if (shiftAction) {
                    _this.dialogHelper.alert('This shift has been saved and is awaiting approval.', 'Success!', 'Close');
                    setTimeout(function () {
                        _this.submitAction.emit(shiftAction);
                    }, 500);
                }
                else {
                    console.log('ERROR: No shift action to submit');
                    _this.dialogHelper.alert('Something went wrong...', 'Fail', 'Close');
                }
            });
        }
    };
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentClient),
        __metadata("design:type", rxjs_1.Observable)
    ], ClientAvailableComponent.prototype, "client$", void 0);
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentDualClient),
        __metadata("design:type", rxjs_1.Observable)
    ], ClientAvailableComponent.prototype, "dualClient$", void 0);
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentShiftAction),
        __metadata("design:type", rxjs_1.Observable)
    ], ClientAvailableComponent.prototype, "shiftAction$", void 0);
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.submitAction),
        __metadata("design:type", Object)
    ], ClientAvailableComponent.prototype, "submitAction", void 0);
    ClientAvailableComponent = __decorate([
        core_1.Component({
            selector: 'app-client-available',
            templateUrl: './client-available.component.html',
            styleUrls: ['./client-available.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.RouterHelper, helpers_1.DialogHelper])
    ], ClientAvailableComponent);
    return ClientAvailableComponent;
}());
exports.ClientAvailableComponent = ClientAvailableComponent;
