"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var helpers_1 = require("../../../../ACCommon/helpers");
var enums_1 = require("../../../../ACCommon/enums");
var QuestionComponent = /** @class */ (function () {
    function QuestionComponent(dialogHelper, switchHelper) {
        this.dialogHelper = dialogHelper;
        this.switchHelper = switchHelper;
        this.questionType = enums_1.QuestionType;
        this.question = undefined;
        this.yesNoOption = 'Please Select';
    }
    QuestionComponent.prototype.ngOnInit = function () {
    };
    QuestionComponent.prototype.yesNoTap = function () {
        var _this = this;
        this.dialogHelper.otherInfoActionDialog().then(function (result) {
            if (result !== 'Cancel') {
                _this.yesNoOption = result;
            }
        });
    };
    QuestionComponent.prototype.onCheckedChange = function (args) {
        this.switchHelper.switch(args);
    };
    QuestionComponent.prototype.dropDownSelectedItem = function (args) {
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], QuestionComponent.prototype, "question", void 0);
    QuestionComponent = __decorate([
        core_1.Component({
            selector: 'app-question',
            templateUrl: './question.component.html',
            styleUrls: ['./question.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.DialogHelper, helpers_1.SwitchHelper])
    ], QuestionComponent);
    return QuestionComponent;
}());
exports.QuestionComponent = QuestionComponent;
