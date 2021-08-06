"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FaqComponent = /** @class */ (function () {
    function FaqComponent() {
        this.questions = [];
        this.dot = '\u2022';
        this.placeholderText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
            'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco ' +
            'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit ' +
            'esse cillum dolore eu fugiat nulla pariatur.';
    }
    FaqComponent.prototype.ngOnInit = function () {
        this.questions = [
            { q: 'How do I view frequently asked questions for AssuriCare Caregiver?',
                a: 'Here! This feature will be coming soon!', show: false },
        ];
    };
    FaqComponent.prototype.extendTap = function (index) {
        this.questions[index].show = !this.questions[index].show;
    };
    FaqComponent = __decorate([
        core_1.Component({
            selector: 'app-faq',
            templateUrl: './faq.component.html',
            styleUrls: ['./faq.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], FaqComponent);
    return FaqComponent;
}());
exports.FaqComponent = FaqComponent;
