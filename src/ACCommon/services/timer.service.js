"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
/**
 * This service is used for the timer functionality for TimerComponent and the timer used in RecordComponent.
 */
var TimerService = /** @class */ (function () {
    function TimerService() {
        /**
         * Used for timer functionality for TimerComponent.
         */
        this.hours = '00';
        /**
         * Used for timer functionality for TimerComponent.
         */
        this.minutes = '00';
        /**
         * Used for timer functionality for TimerComponent.
         */
        this.seconds = '00';
        this.timerInUse = false;
    }
    /**
     * Used to subscribed to the timer interval to start counting time.
     * This also subscribes to the shift Observable.
     *
     * @param shift$ - Shift Observable - This should always be from ShiftState.getCurrentShift
     */
    TimerService.prototype.subscribeToTimer = function (shift$) {
        var _this = this;
        this.shiftSubscribtion = shift$.subscribe(function (shift) {
            if (!shift || _this.timerInUse) {
                return null;
            }
            _this.updateTime(new Date(shift.StartTime)); // Set Initial Time
            _this.timerInUse = true;
            console.log('Timer Interval has started running.');
            _this.timeInterval = setInterval(function () {
                _this.updateTime(new Date(shift.StartTime));
            }, 1000);
        });
    };
    /**
     * Used to unsubscribe from both the time interval and the shift subscription.
     */
    TimerService.prototype.unsubscribeFromTimer = function () {
        if (!this.timerInUse) {
            return;
        }
        console.log('Timer Interval has stopped running.');
        this.shiftSubscribtion.unsubscribe();
        clearTimeout(this.timeInterval);
        this.timerInUse = false;
    };
    /**
     * Used to subscribe to the record timer interval to start a timer.
     *
     * Returns an observable object with s and ms, for seconds and milliseconds
     */
    TimerService.prototype.subscribeToRecordTimer = function () {
        var _this = this;
        var time = new Date(Date.now());
        return new rxjs_1.Observable(function (observer) {
            _this.recordTimeInterval = setInterval(function () {
                observer.next(_this.updateTime(time, true));
            }, 10);
        });
    };
    /**
     * Used to unsubscribe from the record time interval.
     */
    TimerService.prototype.unsubscribeFromRecordTimer = function () {
        clearTimeout(this.recordTimeInterval);
    };
    TimerService.prototype.updateTime = function (time, isRecordTimer) {
        if (isRecordTimer === void 0) { isRecordTimer = false; }
        var currentTime = new Date(Date.now());
        var difference = currentTime.getTime() - time.getTime();
        if (isRecordTimer) {
            var seconds = "" + Math.floor(difference / 1000);
            difference = difference - (+seconds * 1000);
            var milliseconds = "" + Math.floor(difference / 10);
            return { s: this.checkIfOneDigit(seconds), ms: this.checkIfOneDigit(milliseconds) };
        }
        else {
            this.hours = "" + Math.floor(difference / 3600000);
            difference = difference - (+this.hours * 3600000);
            this.hours = this.checkIfOneDigit(this.hours);
            this.minutes = "" + Math.floor(difference / 60000);
            difference = difference - (+this.minutes * 60000);
            this.minutes = this.checkIfOneDigit(this.minutes);
            this.seconds = "" + Math.floor(difference / 1000);
            difference = difference - (+this.seconds * 1000);
            this.seconds = this.checkIfOneDigit(this.seconds);
        }
    };
    TimerService.prototype.checkIfOneDigit = function (time) {
        if (time.length === 1) {
            return "0" + time;
        }
        return time;
    };
    TimerService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], TimerService);
    return TimerService;
}());
exports.TimerService = TimerService;
