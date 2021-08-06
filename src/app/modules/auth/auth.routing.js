"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_component_1 = require("./login/login.component");
var forgot_password_component_1 = require("./forgot-password/forgot-password.component");
var touch_id_terms_component_1 = require("./touch-id-terms/touch-id-terms.component");
exports.authRoutes = [
    {
        path: '',
        children: [
            { path: 'login', component: login_component_1.LoginComponent },
            { path: 'forgot-password', component: forgot_password_component_1.ForgotPasswordComponent },
            { path: 'touch-id-terms', component: touch_id_terms_component_1.TouchIdTermsComponent },
        ]
    },
];
