import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DIRECTIVES } from './directives';
import { HideKeyboardDirective } from './directives/hideKeyboard.directive';
import { PhonePipe } from './pipes/phone.pipe';

@NgModule({
    declarations: [
        ...DIRECTIVES,
        HideKeyboardDirective,
        PhonePipe
    ],
    exports: [
        NativeScriptCommonModule,
        TranslateModule,
        ...DIRECTIVES,
        HideKeyboardDirective,
        PhonePipe
    ]
})
export class AcSharedLogicModule { }
