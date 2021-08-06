"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_component_1 = require("./settings/settings.component");
var change_password_component_1 = require("./change-password/change-password.component");
var contact_us_component_1 = require("./contact-us/contact-us.component");
var faq_component_1 = require("./faq/faq.component");
exports.settingsRoutes = [
    {
        path: '',
        children: [
            { path: '', component: settings_component_1.SettingsComponent },
            { path: 'change-password', component: change_password_component_1.ChangePasswordComponent },
            { path: 'contact-us', component: contact_us_component_1.ContactUsComponent },
            { path: 'faq', component: faq_component_1.FaqComponent }
        ]
    },
];
