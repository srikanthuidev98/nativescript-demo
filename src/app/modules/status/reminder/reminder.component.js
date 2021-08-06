"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var helpers_1 = require("../../../../ACCommon/helpers");
var common_1 = require("@angular/common");
var emitter_1 = require("@ngxs-labs/emitter");
var states_1 = require("../../../../ACCommon/states");
var ReminderComponent = /** @class */ (function () {
    function ReminderComponent(routerHelper, dialogHelper, localNotificationHelper, datePipe) {
        this.routerHelper = routerHelper;
        this.dialogHelper = dialogHelper;
        this.localNotificationHelper = localNotificationHelper;
        this.datePipe = datePipe;
        this.selectedTab = 0;
        this.error = '';
        // Specific Hour
        this.day = 'Today';
        // Hours from now
        this.hour = '00';
        this.minute = '00';
    }
    ReminderComponent.prototype.ngOnInit = function () {
        this.selectedDate = new Date();
        this.currentDate = new Date();
    };
    ReminderComponent.prototype.tabTap = function (tabNumber) {
        this.selectedTab = tabNumber;
    };
    ReminderComponent.prototype.onTimeChanged = function (args) {
        this.selectedDate.setHours(args.object.hour);
        this.selectedDate.setMinutes(args.object.minute);
    };
    ReminderComponent.prototype.changeDay = function () {
        if (this.day === 'Today') {
            this.day = 'Tomorrow';
        }
        else {
            this.day = 'Today';
        }
    };
    ReminderComponent.prototype.setReminderTap = function (tab) {
        var _this = this;
        var reminderDate = new Date();
        if (tab === 0) {
            reminderDate = this.selectedDate;
            if (this.day === 'Tomorrow') {
                reminderDate.setHours(reminderDate.getHours() + 24);
            }
            if (reminderDate > this.currentDate) {
                this.error = '';
            }
            else {
                this.error = 'Please select a time in the future';
                return;
            }
        }
        else {
            if (this.hour === '00' && this.minute === '00') {
                this.error = 'Please select a time in the future';
                return;
            }
            else {
                this.error = '';
                reminderDate.setHours(reminderDate.getHours() + +this.hour);
                reminderDate.setMinutes(reminderDate.getMinutes() + +this.minute);
            }
        }
        this.localNotificationHelper.setTimerNotification(reminderDate);
        console.log('Reminder set!', this.datePipe.transform(reminderDate, 'EE, M/dd hh:mm aaa'));
        this.setReminderDate.emit(reminderDate);
        this.dialogHelper.alert('Checkout reminder time is: ' + this.datePipe.transform(reminderDate, 'EE, M/dd hh:mm aaa'), 'Checkout reminder set!').then(function () {
            _this.routerHelper.backToPreviousPage();
        });
    };
    ReminderComponent.prototype.clickerTap = function (type, timeType) {
        if (type === '+' && (this.hour === '26' || (this.hour === '25' && +this.minute > 0 && timeType === 'hour'))) {
            return;
        }
        if (type === '-' && ((this.hour === '00' && timeType === 'hour') || (this.minute === '00' && timeType === 'minute'))) {
            return;
        }
        if (type === '+') { // Increment time
            if (timeType === 'hour') {
                this.hour = this.makeDigitValid("" + (+this.hour + 1), timeType);
            }
            else {
                this.minute = this.makeDigitValid("" + (+this.minute + 10), timeType);
            }
        }
        else { // Decrement time
            if (timeType === 'hour') {
                this.hour = this.makeDigitValid("" + (+this.hour - 1), timeType);
            }
            else {
                this.minute = this.makeDigitValid("" + (+this.minute - 10), timeType);
            }
        }
    };
    ReminderComponent.prototype.makeDigitValid = function (time, timeType) {
        if (time.length === 1) {
            return "0" + time;
        }
        if (timeType === 'minute') {
            if (this.minute === '50') {
                return '00';
            }
        }
        return time;
    };
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.setReminderDate),
        __metadata("design:type", Object)
    ], ReminderComponent.prototype, "setReminderDate", void 0);
    ReminderComponent = __decorate([
        core_1.Component({
            selector: 'app-reminder',
            templateUrl: './reminder.component.html',
            styleUrls: ['./reminder.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.RouterHelper, helpers_1.DialogHelper,
            helpers_1.LocalNotificationHelper, common_1.DatePipe])
    ], ReminderComponent);
    return ReminderComponent;
}());
exports.ReminderComponent = ReminderComponent;
