import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { profileRoutes } from './profile.routing';
import { ImageHelper } from '../../../ACCommon/helpers/image.helper';


@NgModule({
    imports: [
        NativeScriptRouterModule.forChild(profileRoutes),
        AcSharedLogicModule, // Import into all Modules
        SharedComponentsModule // Import into any modules that need shared components ie: ActionBar
    ],
    exports: [],
    declarations: [
        ProfileComponent
    ],
    providers: [
        ImageHelper
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ProfileModule { }
