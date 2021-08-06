import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login/login.component';

import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HideActionBarDirective } from '../../../ACCommon/directives/hideActionBar.directive';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { authRoutes } from './auth.routing';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { TouchIdTermsComponent } from './touch-id-terms/touch-id-terms.component';


@NgModule({
    imports: [
        NativeScriptRouterModule.forChild(authRoutes),
        NativeScriptUIDataFormModule,
        AcSharedLogicModule,
        SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
    ],
    exports: [],
    declarations: [
        LoginComponent,
        ForgotPasswordComponent,
        HideActionBarDirective,
        TouchIdTermsComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AuthModule { }
