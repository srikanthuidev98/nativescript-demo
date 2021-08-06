import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';


export const settingsRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: SettingsComponent},
            { path: 'change-password', component: ChangePasswordComponent},
            { path: 'contact-us', component: ContactUsComponent},
            { path: 'faq', component: FaqComponent},
        ]
    },
];
