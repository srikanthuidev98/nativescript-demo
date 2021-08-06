import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { AcSharedLogicModule } from '../../../ACCommon/ac-shared-logic.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { MessageThreadComponent } from './message-thread/message-thread.component';
import { messagingRoutes } from './messaging.routing';
import { MessagingComponent } from './messaging/messaging.component';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { ImageHelper } from '../../../ACCommon/helpers/image.helper';



@NgModule({
  imports: [
    NativeScriptRouterModule.forChild(messagingRoutes),
    AcSharedLogicModule, // Import into all Modules
    SharedComponentsModule, // Import into any modules that need shared components ie: ActionBar
    NativeScriptFormsModule,
  ],
  declarations: [
    MessageThreadComponent,
    MessagingComponent,
    ImageModalComponent,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  providers: [
    ImageHelper
  ],
  entryComponents: [
    ImageModalComponent
  ]
})
export class MessagingModule { }
