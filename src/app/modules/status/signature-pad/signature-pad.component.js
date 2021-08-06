"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var element_registry_1 = require("nativescript-angular/element-registry");
var image_source_1 = require("tns-core-modules/image-source");
var dialogs_1 = require("nativescript-angular/directives/dialogs");
var helpers_1 = require("../../../../ACCommon/helpers");
// Resgister DrawingPad
element_registry_1.registerElement('DrawingPad', function () { return require('nativescript-drawingpad').DrawingPad; });
var SignaturePadComponent = /** @class */ (function () {
    function SignaturePadComponent(mParams, filePathHelper) {
        this.mParams = mParams;
        this.filePathHelper = filePathHelper;
    }
    SignaturePadComponent.prototype.ngOnInit = function () { };
    SignaturePadComponent.prototype.saveSignature = function () {
        var _this = this;
        // get reference to the drawing pad
        var pad = this.DrawingPad.nativeElement;
        // then get the drawing (Bitmap on Android) of the drawingpad
        pad.getDrawing().then(function (drawingImage) {
            var fileName = _this.filePathHelper.createFileName('signature', '.jpeg');
            var img = image_source_1.fromNativeSource(drawingImage);
            var saved = img.saveToFile(_this.filePathHelper.getFilePath(fileName), 'jpeg');
            if (saved) {
                console.log('Image saved successfully!');
                _this.closeModal(fileName);
            }
            else {
                console.log('Image was NOT saved');
            }
        }, function (err) {
            console.log(err);
        });
    };
    SignaturePadComponent.prototype.clearMyDrawing = function () {
        var pad = this.DrawingPad.nativeElement;
        pad.clearDrawing();
    };
    SignaturePadComponent.prototype.closeModal = function (fileName) {
        this.mParams.closeCallback(fileName);
    };
    __decorate([
        core_1.ViewChild('DrawingPad', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], SignaturePadComponent.prototype, "DrawingPad", void 0);
    SignaturePadComponent = __decorate([
        core_1.Component({
            selector: 'app-signature-pad',
            templateUrl: './signature-pad.component.html',
            styleUrls: ['./signature-pad.component.scss']
        }),
        __metadata("design:paramtypes", [dialogs_1.ModalDialogParams, helpers_1.FilePathHelper])
    ], SignaturePadComponent);
    return SignaturePadComponent;
}());
exports.SignaturePadComponent = SignaturePadComponent;
