"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_swiss_army_knife_1 = require("nativescript-swiss-army-knife/nativescript-swiss-army-knife");
/**
 * This helper is just to hold any other one off service that could be useful in many places.
 */
var ToolsHelper = /** @class */ (function () {
    function ToolsHelper() {
    }
    /**
     * Closes the keyboard.
     */
    ToolsHelper.prototype.closeKeyboard = function () {
        nativescript_swiss_army_knife_1.SwissArmyKnife.dismissSoftKeyboard();
    };
    ToolsHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [])
    ], ToolsHelper);
    return ToolsHelper;
}());
exports.ToolsHelper = ToolsHelper;
