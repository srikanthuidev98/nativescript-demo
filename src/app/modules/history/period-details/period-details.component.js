"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_helper_1 = require("../../../../ACCommon/helpers/router.helper");
var store_1 = require("@ngxs/store");
var states_1 = require("../../../../ACCommon/states");
var rxjs_1 = require("rxjs");
var emitter_1 = require("@ngxs-labs/emitter");
var operators_1 = require("rxjs/operators");
var helpers_1 = require("../../../../ACCommon/helpers");
var PeriodDetailsComponent = /** @class */ (function () {
    function PeriodDetailsComponent(routerHelper, loadingHelper) {
        this.routerHelper = routerHelper;
        this.loadingHelper = loadingHelper;
        this.allHistories = [];
        this.filter = 0;
        this.payRateSelected = '';
        this.hasShift = true;
    }
    PeriodDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.histories$.pipe(operators_1.first()).subscribe(function (histories) {
            _this.history$.pipe(operators_1.first()).subscribe(function (history) {
                var selectedHistories = histories.filter(function (h) { return h.ServiceStartDate === history.ServiceStartDate; });
                _this.clients$.pipe(operators_1.first()).subscribe(function (clients) {
                    clients.forEach(function (c, index) {
                        var selectedH = selectedHistories.find(function (h) { return h.CaregiverId === c.CaregiverId; });
                        if (selectedH) {
                            _this.allHistories.push(selectedH);
                        }
                        if (index === clients.length - 1) {
                            _this.pullAllHistoryDetailDataWithAdjustments.emit(_this.allHistories);
                            setTimeout(function () {
                                _this.loadingHelper.hideIndicator();
                            }, 300);
                        }
                    });
                });
            });
        });
    };
    PeriodDetailsComponent.prototype.shiftTap = function (index) {
        var _this = this;
        this.historyDetails$.pipe(operators_1.first()).subscribe(function (hd) {
            var selectedH = _this.allHistories.find(function (h) { return h.CaregiverId === hd[index].CaregiverId; });
            _this.setSelectedHistory.emit(selectedH);
            _this.setSelectedHistoryDetail.emit(hd[index]);
            _this.routerHelper.navigate(['history/shift-details']);
        });
    };
    PeriodDetailsComponent.prototype.filterChanged = function (filter) {
        var _this = this;
        this.filter = filter.caregiverId;
        this.historyDetails$.pipe(operators_1.first()).subscribe(function (hd) {
            var shift = hd.find(function (h) { return h.CaregiverId === filter.caregiverId; });
            if (shift || filter.caregiverId === 0) {
                _this.hasShift = true;
            }
            else {
                _this.hasShift = false;
                _this.payRateSelected = filter.payRateComment;
            }
        });
    };
    __decorate([
        store_1.Select(states_1.HistoryState.getHistoryClient),
        __metadata("design:type", rxjs_1.Observable)
    ], PeriodDetailsComponent.prototype, "client$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getSelectedHistory),
        __metadata("design:type", rxjs_1.Observable)
    ], PeriodDetailsComponent.prototype, "history$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getHistoryClients),
        __metadata("design:type", rxjs_1.Observable)
    ], PeriodDetailsComponent.prototype, "clients$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getHistories),
        __metadata("design:type", rxjs_1.Observable)
    ], PeriodDetailsComponent.prototype, "histories$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getHistoryDetail),
        __metadata("design:type", rxjs_1.Observable)
    ], PeriodDetailsComponent.prototype, "historyDetails$", void 0);
    __decorate([
        store_1.Select(states_1.CaregiverState.getHasInternet),
        __metadata("design:type", rxjs_1.Observable)
    ], PeriodDetailsComponent.prototype, "hasInternet$", void 0);
    __decorate([
        emitter_1.Emitter(states_1.HistoryState.pullAllHistoryDetailDataWithAdjustments),
        __metadata("design:type", Object)
    ], PeriodDetailsComponent.prototype, "pullAllHistoryDetailDataWithAdjustments", void 0);
    __decorate([
        emitter_1.Emitter(states_1.HistoryState.setSelectedHistoryDetail),
        __metadata("design:type", Object)
    ], PeriodDetailsComponent.prototype, "setSelectedHistoryDetail", void 0);
    __decorate([
        emitter_1.Emitter(states_1.HistoryState.setSelectedHistory),
        __metadata("design:type", Object)
    ], PeriodDetailsComponent.prototype, "setSelectedHistory", void 0);
    PeriodDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-period-details',
            templateUrl: './period-details.component.html',
            styleUrls: ['./period-details.component.scss']
        }),
        __metadata("design:paramtypes", [router_helper_1.RouterHelper, helpers_1.LoadingHelper])
    ], PeriodDetailsComponent);
    return PeriodDetailsComponent;
}());
exports.PeriodDetailsComponent = PeriodDetailsComponent;
