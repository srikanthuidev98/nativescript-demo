"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var states_1 = require("../../../../ACCommon/states");
var store_1 = require("@ngxs/store");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ShiftDetailsComponent = /** @class */ (function () {
    function ShiftDetailsComponent() {
    }
    ShiftDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.iadls = [];
        this.adls = [];
        this.iadlKeys$.pipe(operators_1.first()).subscribe(function (iadlKeys) {
            _this.historyDetail$.pipe(operators_1.first()).subscribe(function (historyDetail) {
                iadlKeys.forEach(function (element) {
                    if (historyDetail.OtherServices[element.Key] === 1) {
                        _this.iadls.push(element.Title);
                    }
                });
                Object.keys(historyDetail.Services).forEach(function (key) {
                    if (historyDetail.Services[key] === 1) {
                        if (key === 'Supervision') {
                            _this.adls.push({ key: key, val: 'Provided' });
                        }
                        else {
                            _this.adls.push({ key: key, val: 'Hands On' });
                        }
                    }
                    else if (historyDetail.Services[key] === 2) {
                        _this.adls.push({ key: key, val: 'Standby' });
                    }
                });
            });
        });
    };
    __decorate([
        store_1.Select(states_1.HistoryState.getHistoryClient),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftDetailsComponent.prototype, "client$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getSelectedHistoryDetail),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftDetailsComponent.prototype, "historyDetail$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getSelectedHistory),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftDetailsComponent.prototype, "history$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getIADLKeys),
        __metadata("design:type", rxjs_1.Observable)
    ], ShiftDetailsComponent.prototype, "iadlKeys$", void 0);
    ShiftDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-shift-details',
            templateUrl: './shift-details.component.html',
            styleUrls: ['./shift-details.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], ShiftDetailsComponent);
    return ShiftDetailsComponent;
}());
exports.ShiftDetailsComponent = ShiftDetailsComponent;
