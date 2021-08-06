"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var color_1 = require("tns-core-modules/color/color");
var page_1 = require("tns-core-modules/ui/page/page");
var SwitchHelper = /** @class */ (function () {
    function SwitchHelper() {
    }
    SwitchHelper.prototype.switch = function (args) {
        var mySwitch = args.object;
        if (page_1.isAndroid) { // Changes the default behavior for Android. Turns the 'on' color to the same color as iOS.
            if (mySwitch.checked) {
                mySwitch.color = new color_1.Color('#76D572');
                mySwitch.backgroundColor = new color_1.Color('#76D572');
            }
            else {
                setTimeout(function () {
                    mySwitch.color = undefined;
                    mySwitch.backgroundColor = undefined;
                }, 100);
            }
        }
        else {
            mySwitch.backgroundColor = new color_1.Color('#76D572');
        }
        return mySwitch.checked;
    };
    SwitchHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [])
    ], SwitchHelper);
    return SwitchHelper;
}());
exports.SwitchHelper = SwitchHelper;
