"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var profile_component_1 = require("./profile/profile.component");
exports.profileRoutes = [
    {
        path: '',
        children: [
            { path: '', component: profile_component_1.ProfileComponent }
        ]
    },
];
