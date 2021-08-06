import { Routes } from '@angular/router';
import { MessagingComponent } from './messaging/messaging.component';
import { MessageThreadComponent } from './message-thread/message-thread.component';


export const messagingRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: MessageThreadComponent},
            { path: 'messaging', component: MessagingComponent},
        ]
    },
];
