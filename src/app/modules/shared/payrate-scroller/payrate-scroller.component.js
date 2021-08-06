"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("@ngxs/store");
var states_1 = require("../../../../ACCommon/states");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var enums_1 = require("../../../../ACCommon/enums");
var PayrateScrollerComponent = /** @class */ (function () {
    function PayrateScrollerComponent() {
        this.client = undefined;
        this.filterChanged = new core_1.EventEmitter();
        this.clientList = [];
        this.payRateList = ['All'];
        this.filter = 0;
    }
    PayrateScrollerComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.client) {
            return;
        }
        this.clients$.pipe(operators_1.first()).subscribe(function (clients) {
            clients.forEach(function (c) {
                if (c.Id === _this.client.Id) {
                    _this.clientList.push(c);
                    var payRate = _this.payRateList.find(function (rate) { return rate === c.PayRateComment; });
                    if (!payRate) {
                        if (c.PayRateComment) {
                            _this.payRateList.push(c.PayRateComment);
                        }
                        else {
                            _this.payRateList.push(enums_1.PayRateType[c.PayRateType]);
                        }
                    }
                }
            });
        });
    };
    PayrateScrollerComponent.prototype.scrollBarLoaded = function (args) {
        var listView = args.object;
        if (listView.ios) {
            listView.ios.showsHorizontalScrollIndicator = false;
        }
        else {
            listView.android.setHorizontalScrollBarEnabled(false);
        }
    };
    PayrateScrollerComponent.prototype.filterTap = function (filterNumber) {
        this.filter = filterNumber;
        if (this.filter === 0) {
            this.filterChanged.emit({ caregiverId: 0, payRateComment: 'All' });
        }
        else {
            var client = this.clientList[filterNumber - 1];
            this.filterChanged.emit({ caregiverId: client.CaregiverId, payRateComment: client.PayRateComment });
        }
    };
    __decorate([
        store_1.Select(states_1.CaregiverState.getClients),
        __metadata("design:type", rxjs_1.Observable)
    ], PayrateScrollerComponent.prototype, "clients$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PayrateScrollerComponent.prototype, "client", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PayrateScrollerComponent.prototype, "filterChanged", void 0);
    PayrateScrollerComponent = __decorate([
        core_1.Component({
            selector: 'app-payrate-scroller',
            templateUrl: './payrate-scroller.component.html',
            styleUrls: ['./payrate-scroller.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], PayrateScrollerComponent);
    return PayrateScrollerComponent;
}());
exports.PayrateScrollerComponent = PayrateScrollerComponent;
