"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
var LanguageService = /** @class */ (function () {
    function LanguageService(translate) {
        this.translate = translate;
    }
    LanguageService.prototype.setLanguage = function (userLang) {
        // NOTE: Update this array if more languages are added
        var supportedLanguages = ['en', 'es', 'fr'];
        if (userLang == null) {
            console.log('User\'s language is null. Defaulted to English.');
            this.translate.setDefaultLang('en');
            this.translate.use('en');
            return;
        }
        if (userLang.length > 2) {
            userLang = userLang.slice(0, 2);
        }
        for (var i = 0; i < supportedLanguages.length; i++) {
            if (userLang === supportedLanguages[i]) {
                this.translate.setDefaultLang(userLang);
                this.translate.use(userLang);
                return;
            }
        }
        console.log('User\'s language is not supported. Defaulted to English.');
        console.log('User\'s language is: ' + userLang);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    };
    LanguageService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [core_2.TranslateService])
    ], LanguageService);
    return LanguageService;
}());
exports.LanguageService = LanguageService;
