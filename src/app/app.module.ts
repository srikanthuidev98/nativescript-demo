import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';

import { NgxsModule } from '@ngxs/store';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';

import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { STATES } from '../ACCommon/states';
import { ACCommonModule } from '../ACCommon/accommon.module';
import { HttpClient } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AcSharedLogicModule } from '../ACCommon/ac-shared-logic.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { appRoutes } from './app.routing';
import { SharedComponentsModule } from './modules/shared/shared-components.module';
import { SplashComponent } from './splash/splash.component';
import { AppCenter, AppCenterAnalytics, AppCenterCrashes } from 'nativescript-microsoft-appcenter';
import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';
import { DropDownModule } from 'nativescript-drop-down/angular';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
  ],
  imports: [
    NativeScriptRouterModule.forRoot(appRoutes),
    ACCommonModule, // Import ONLY here
    AcSharedLogicModule, // Import into all Modules
    SharedComponentsModule, // Import into any modules that need shared components ie: ActionBar
    AuthModule,
    DropDownModule,
    NativeScriptHttpClientModule,
    NativeScriptUISideDrawerModule,
    NativeScriptModule,
    NativeScriptUICalendarModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    NgxsModule.forRoot([ ...STATES ]),
    NgxsEmitPluginModule.forRoot(),
  ],
  exports: [],
  providers: [
    AppCenter,
    AppCenterAnalytics,
    AppCenterCrashes
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
