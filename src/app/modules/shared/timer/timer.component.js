"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var timer_service_1 = require("../../../../ACCommon/services/timer.service");
var page_1 = require("tns-core-modules/ui/page");
var enums_1 = require("tns-core-modules/ui/enums");
var animation_1 = require("tns-core-modules/ui/animation/animation");
/**
 * Two ways to use this component.
 *
 * 1. Send a shift$ observable.
 * 2. Send a historyDetails$ observable and history$ observable.
 *
 * The first option will show the timer counting up. Used on checkout-container.
 * The second option will have static text that displays the total amount of time for all historyDetails
 */
var TimerComponent = /** @class */ (function () {
    function TimerComponent(timerService, page) {
        this.timerService = timerService;
        this.page = page;
        // Option 1 - Send a shift$ observable.
        this.shift$ = undefined;
        // Option 2 - Send a historyDetails$ observable and history$ observable.
        this.historyDetails$ = undefined;
        this.history$ = undefined;
        this.hideAnimation = false;
        this.totalTime = '0h:0m';
    }
    TimerComponent_1 = TimerComponent;
    TimerComponent.prototype.startAnimation = function (args) {
        var rotatingCircle = args.object;
        this.animateCircle(rotatingCircle);
    };
    TimerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.page.on('navigatingFrom', function (data) {
            if (TimerComponent_1.animation !== undefined) {
                setTimeout(function () {
                    TimerComponent_1.animation.cancel();
                }, 300);
            }
        });
        if (this.shift$) { // Option 1
            this.timerService.subscribeToTimer(this.shift$);
        }
        else { // Option 2
            this.historyDetailsSub = this.historyDetails$.subscribe(function (historyDetails) {
                var hours = 0;
                if (historyDetails) {
                    historyDetails.forEach(function (element, index) {
                        hours += element.Hours;
                        if (index === historyDetails.length - 1) {
                            var minutes = hours % 1;
                            _this.totalTime = Math.floor(hours) + "h:" + minutes * 60 + "m";
                        }
                    });
                }
            });
        }
    };
    TimerComponent.prototype.ngOnDestroy = function () {
        if (this.historyDetailsSub) {
            this.historyDetailsSub.unsubscribe();
        }
    };
    TimerComponent.prototype.animateCircle = function (rotatingCircle) {
        var animationDefinition = {
            target: rotatingCircle,
            curve: enums_1.AnimationCurve.linear,
            duration: 5000,
            rotate: 360,
            iterations: Infinity
        };
        TimerComponent_1.animation = new animation_1.Animation([animationDefinition], false);
        TimerComponent_1.animation.play().catch(function (e) {
            console.log('Animation was cancelled.');
        });
    };
    var TimerComponent_1;
    __decorate([
        core_1.Input(),
        __metadata("design:type", rxjs_1.Observable)
    ], TimerComponent.prototype, "shift$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", rxjs_1.Observable)
    ], TimerComponent.prototype, "historyDetails$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", rxjs_1.Observable)
    ], TimerComponent.prototype, "history$", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TimerComponent.prototype, "hideAnimation", void 0);
    TimerComponent = TimerComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-timer',
            templateUrl: './timer.component.html',
            styleUrls: ['./timer.component.scss']
        }),
        __metadata("design:paramtypes", [timer_service_1.TimerService, page_1.Page])
    ], TimerComponent);
    return TimerComponent;
}());
exports.TimerComponent = TimerComponent;
