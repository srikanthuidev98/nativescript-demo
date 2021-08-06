import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { settingsRoutes } from './settings.routing';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

@NgModule({
    imports: [
        NativeScriptRouterModule.forChild(settingsRoutes),
        AcSharedLogicModule, // Import into all Modules
        SharedComponentsModule, // Import into any modules that need shared components ie: ActionBar
        NativeScriptFormsModule
    ],
    exports: [],
    declarations: [
        SettingsComponent,
        ChangePasswordComponent,
        ContactUsComponent,
        FaqComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SettingsModule { }
