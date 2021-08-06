"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Two ways to use this component.
 *
 * 1. Send a history object and histories array.
 * 2. Send a history object and historyDetail object.
 *
 * Outputs different information depending if the historyDetail was sent.
 */
var PayDetailComponent = /** @class */ (function () {
    function PayDetailComponent() {
        this.history = undefined;
        this.histories = undefined;
        this.historyDetail = undefined;
        this.totalPay = 0;
        this.payRate = 0;
        this.milageInDollars = 0;
        this.dollars = 0;
        this.cents = '00';
        this.payAmount = 0;
        this.totalHours = 0;
    }
    PayDetailComponent.prototype.ngOnInit = function () {
        // this.history.RegistryProvider = false;
        var _this = this;
        if (this.histories) {
            this.histories.forEach(function (history) {
                _this.payAmount += +history.PayAmount;
                _this.totalHours += +history.TotalHours;
                _this.milageInDollars += +history.MileageAmount;
            });
        }
        if (this.history && this.historyDetail) {
            if (this.history.MileageAmount > 0 && this.history.Mileage > 0 && this.historyDetail.Services.Mileage) {
                this.milageInDollars = (this.history.MileageAmount / this.history.Mileage);
                this.milageInDollars = this.milageInDollars * this.historyDetail.Services.Mileage;
            }
            this.payRate = +this.history.PayRate.split(' ')[0].replace(/[^\d.-]/g, '');
            this.totalPay = (this.payRate * this.historyDetail.Hours) + this.milageInDollars;
            this.dollars = Math.floor(this.totalPay);
            var cent = Math.floor((this.totalPay % 1) * 100);
            if (cent !== 0) {
                this.cents = "" + cent;
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PayDetailComponent.prototype, "history", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], PayDetailComponent.prototype, "histories", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PayDetailComponent.prototype, "historyDetail", void 0);
    PayDetailComponent = __decorate([
        core_1.Component({
            selector: 'app-pay-detail',
            templateUrl: './pay-detail.component.html',
            styleUrls: ['./pay-detail.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], PayDetailComponent);
    return PayDetailComponent;
}());
exports.PayDetailComponent = PayDetailComponent;
