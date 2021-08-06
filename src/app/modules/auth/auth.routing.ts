import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TouchIdTermsComponent } from './touch-id-terms/touch-id-terms.component';


export const authRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'touch-id-terms', component: TouchIdTermsComponent },
        ]
    },
];
