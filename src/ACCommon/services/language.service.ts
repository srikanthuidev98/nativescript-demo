import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {

    constructor(private translate: TranslateService) { }

    public setLanguage(userLang: string) {
        // NOTE: Update this array if more languages are added
        const supportedLanguages = ['en', 'es', 'fr'];

        if (userLang == null) {
            console.log('User\'s language is null. Defaulted to English.');
            this.translate.setDefaultLang('en');
            this.translate.use('en');
            return;
        }

        if (userLang.length > 2) {
            userLang = userLang.slice(0, 2);
        }

        for (let i = 0; i < supportedLanguages.length; i++) {
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
    }
}
