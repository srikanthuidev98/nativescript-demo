import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SERVICES } from './services';
import { AppConfigModule } from './config/app-config.module';
import { GUARDS } from './guards';


@NgModule({
    imports: [
        AppConfigModule,
    ],
    exports: [],
    declarations: [],
    providers: [
        ...SERVICES,
        ...GUARDS
    ],
})
export class ACCommonModule {
    constructor(
        @Optional() @SkipSelf() parentModule: ACCommonModule
    ) {
        if (parentModule) {
            throw new Error('ACCommonModule has already been loaded. Import ACCommonModule from AppModule only.');
        }
    }
 }
