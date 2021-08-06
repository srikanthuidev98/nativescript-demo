"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var helpers_1 = require("../../../../ACCommon/helpers");
var store_1 = require("@ngxs/store");
var states_1 = require("../../../../ACCommon/states");
var rxjs_1 = require("rxjs");
var emitter_1 = require("@ngxs-labs/emitter");
var operators_1 = require("rxjs/operators");
var helpers_2 = require("../../../../ACCommon/helpers");
var CheckinStatusComponent = /** @class */ (function () {
    function CheckinStatusComponent(locationHelper, routerHelper, loadingIndicator, notification) {
        this.locationHelper = locationHelper;
        this.routerHelper = routerHelper;
        this.loadingIndicator = loadingIndicator;
        this.notification = notification;
        this.header = '';
        this.headerName = '';
    }
    CheckinStatusComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.syncOfflineShifts.emit(); // Tries to sync shifts if they haven't been sent yet.
        this.notification.cancelNotification(1);
        this.locationHelper.disableWatchLocation();
        this.removeCurrnetClientAndShift.emit();
        this.setReminderDate.emit(undefined);
        var hours = new Date().getHours();
        this.caregiver$.pipe(operators_1.first()).subscribe(function (caregiver) {
            var firstName = caregiver.Name.substr(0, caregiver.Name.indexOf(' '));
            if (hours > 0 && hours < 12) {
                _this.header = "Good Morning,";
                _this.headerName = firstName;
            }
            else if (hours >= 12 && hours <= 18) {
                _this.header = "Good Afternoon,";
                _this.headerName = firstName;
            }
            else {
                _this.header = "Good Evening,";
                _this.headerName = firstName;
            }
        });
        this.lastShift$.pipe(operators_1.first()).subscribe(function (lastShift) {
            var lastShiftDate = new Date(lastShift.HistoryDetail.EndTime);
            if (new Date().getTime() - lastShiftDate.getTime() < 30000) { // If lastShift EndTime was less than 30 seconds
                _this.header = "Check Out";
                _this.headerName = 'Complete!';
            }
        });
        this.loadingIndicator.hideIndicator();
    };
    CheckinStatusComponent.prototype.checkInTap = function () {
        this.removeCurrnetClientAndShift.emit();
        this.routerHelper.navigate(['/status/clients-list/checkin', { backBtnText: 'Back' }]);
    };
    __decorate([
        store_1.Select(states_1.ShiftState.getSavedLastShift),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckinStatusComponent.prototype, "lastShift$", void 0);
    __decorate([
        store_1.Select(states_1.CaregiverState.getHasInternet),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckinStatusComponent.prototype, "hasInternet$", void 0);
    __decorate([
        store_1.Select(states_1.CaregiverState.getCaregiver),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckinStatusComponent.prototype, "caregiver$", void 0);
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.removeCurrnetClientAndShift),
        __metadata("design:type", Object)
    ], CheckinStatusComponent.prototype, "removeCurrnetClientAndShift", void 0);
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.setReminderDate),
        __metadata("design:type", Object)
    ], CheckinStatusComponent.prototype, "setReminderDate", void 0);
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.sendAllNeedsToSyncShifts),
        __metadata("design:type", Object)
    ], CheckinStatusComponent.prototype, "syncOfflineShifts", void 0);
    CheckinStatusComponent = __decorate([
        core_1.Component({
            selector: 'app-checkin-status',
            templateUrl: './checkin-status.component.html',
            styleUrls: ['./checkin-status.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.LocationHelper, helpers_1.RouterHelper, helpers_2.LoadingHelper,
            helpers_1.LocalNotificationHelper])
    ], CheckinStatusComponent);
    return CheckinStatusComponent;
}());
exports.CheckinStatusComponent = CheckinStatusComponent;
