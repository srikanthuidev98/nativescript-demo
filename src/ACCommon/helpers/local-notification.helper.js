"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_local_notifications_1 = require("nativescript-local-notifications");
var color_1 = require("tns-core-modules/color/color");
var timer_service_1 = require("../services/timer.service");
var page_1 = require("tns-core-modules/ui/page/page");
var LocalNotificationHelper = /** @class */ (function () {
    function LocalNotificationHelper(timerService) {
        this.timerService = timerService;
    }
    LocalNotificationHelper.prototype.basicNotification = function (options) {
        nativescript_local_notifications_1.LocalNotifications.hasPermission().then(function (granted) {
            console.log('Permission granted? ' + granted);
            nativescript_local_notifications_1.LocalNotifications.schedule(options).then(function (scheduledIds) {
                console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds));
            }, function (error) {
                console.log('scheduling error: ' + error);
            });
        });
    };
    LocalNotificationHelper.prototype.setTimerNotification = function (reminderDate) {
        var options = [{
                id: 10,
                title: 'Checkout Reminder',
                body: 'Your checkout reminder is now!',
                color: new color_1.Color('#593c81'),
                badge: 1,
                ongoing: false,
                at: reminderDate
            }];
        this.basicNotification(options);
    };
    LocalNotificationHelper.prototype.checkedInNotification = function (startingTime) {
        if (page_1.isAndroid) {
            var hours = startingTime.getHours();
            var mins = "" + startingTime.getMinutes();
            var time_1 = 'AM';
            if (hours === 12) {
                time_1 = 'PM';
            }
            else if (hours === 0) {
                hours = 12;
            }
            else if (hours > 12) {
                time_1 = 'PM';
                hours = hours - 12;
            }
            if (mins.length === 1) {
                mins = "0" + mins;
            }
            var options = [{
                    id: 1,
                    title: "You are currently Checked in",
                    body: "Check in time " + hours + ":" + mins + " " + time_1,
                    color: new color_1.Color('#593c81'),
                    badge: 1,
                    ongoing: true,
                    forceShowWhenInForeground: false,
                    icon: 'res://icon'
                }];
            this.basicNotification(options);
        }
    };
    LocalNotificationHelper.prototype.cancelNotification = function (id) {
        nativescript_local_notifications_1.LocalNotifications.cancel(id).then(function (foundAndCanceled) {
            if (foundAndCanceled) {
                console.log("OK, it's gone!");
            }
            else {
                console.log("No ID 5 was scheduled");
            }
        });
    };
    LocalNotificationHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [timer_service_1.TimerService])
    ], LocalNotificationHelper);
    return LocalNotificationHelper;
}());
exports.LocalNotificationHelper = LocalNotificationHelper;
