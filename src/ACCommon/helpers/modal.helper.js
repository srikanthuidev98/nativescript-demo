"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialogs_1 = require("nativescript-angular/directives/dialogs");
var ModalHelper = /** @class */ (function () {
    function ModalHelper(modalService) {
        this.modalService = modalService;
    }
    ModalHelper.prototype.openFullscreenModal = function (component, vcRef) {
        console.log('opening');
        var options = {
            viewContainerRef: vcRef,
            fullscreen: true
        };
        return this.modalService.showModal(component, options);
    };
    ModalHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [dialogs_1.ModalDialogService])
    ], ModalHelper);
    return ModalHelper;
}());
exports.ModalHelper = ModalHelper;
