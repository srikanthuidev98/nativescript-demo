"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var VisitDetailsComponent = /** @class */ (function () {
    function VisitDetailsComponent() {
        this.testData = {
            Name: 'Michael Smith',
            Address: '1234 Fake Street',
            SecondAddress: 'Waltham, CA 945030000',
            StartTime: new Date().setHours(8),
            EndTime: new Date().setHours(12),
            PayRate: 20,
            Phone: '555-555-5555'
        };
    }
    VisitDetailsComponent.prototype.ngOnInit = function () {
        this.initals = this.testData.Name.match(/\b(\w)/g).join('');
        this.address = this.testData.Address.replace(',', '\n') + '\n' + this.testData.SecondAddress.replace(', ', '\n');
    };
    VisitDetailsComponent.prototype.checkInTap = function () {
    };
    VisitDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-visit-details',
            templateUrl: './visit-details.component.html',
            styleUrls: ['./visit-details.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], VisitDetailsComponent);
    return VisitDetailsComponent;
}());
exports.VisitDetailsComponent = VisitDetailsComponent;
