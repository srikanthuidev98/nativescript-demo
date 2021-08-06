"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AcTextfieldComponent = /** @class */ (function () {
    function AcTextfieldComponent() {
        this.type = 'general'; // Types of TextFields. Defaults to General.
        this.text = '';
        this.initalText = '';
        this.initalPasswordText = '';
        this.valueChanged = new core_1.EventEmitter();
        this.input = '';
        this.floatHint = false;
        this.showPassword = false;
        this.borderColor = '#d8d8d8';
        this.showPasswordText = 'Show';
    }
    AcTextfieldComponent.prototype.ngOnInit = function () {
        if (this.initalText || this.initalPasswordText) {
            this.floatHint = true;
        }
    };
    AcTextfieldComponent.prototype.onFocus = function () {
        this.borderColor = '#593c81';
    };
    AcTextfieldComponent.prototype.onBlur = function () {
        this.borderColor = '#d8d8d8';
    };
    AcTextfieldComponent.prototype.passwordToggle = function () {
        if (this.showPasswordText === 'Show') {
            this.showPassword = true;
            this.showPasswordText = 'Hide';
        }
        else {
            this.showPassword = false;
            this.showPasswordText = 'Show';
        }
    };
    AcTextfieldComponent.prototype.onTextChange = function (args) {
        this.valueChanged.emit(args.value);
        if (args.value.length > 0) {
            this.floatHint = true;
        }
        else {
            this.floatHint = false;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], AcTextfieldComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AcTextfieldComponent.prototype, "text", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AcTextfieldComponent.prototype, "initalText", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AcTextfieldComponent.prototype, "initalPasswordText", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], AcTextfieldComponent.prototype, "valueChanged", void 0);
    AcTextfieldComponent = __decorate([
        core_1.Component({
            selector: 'app-ac-textfield',
            templateUrl: './ac-textfield.component.html',
            styleUrls: ['./ac-textfield.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], AcTextfieldComponent);
    return AcTextfieldComponent;
}());
exports.AcTextfieldComponent = AcTextfieldComponent;
