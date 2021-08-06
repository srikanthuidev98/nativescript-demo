"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_guard_1 = require("../ACCommon/guards/auth.guard");
var splash_component_1 = require("./splash/splash.component");
exports.appRoutes = [
    { path: '', redirectTo: '/splash', pathMatch: 'full' },
    { path: 'splash', component: splash_component_1.SplashComponent },
    { path: 'auth', loadChildren: function () { return Promise.resolve().then(function () { return require('./modules/auth/auth.module'); }).then(function (m) { return m.AuthModule; }); } },
    { path: 'status', loadChildren: function () { return Promise.resolve().then(function () { return require('./modules/status/status.module'); }).then(function (m) { return m.StatusModule; }); }, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'profile', loadChildren: function () { return Promise.resolve().then(function () { return require('./modules/profile/profile.module'); }).then(function (m) { return m.ProfileModule; }); }, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'history', loadChildren: function () { return Promise.resolve().then(function () { return require('./modules/history/history.module'); }).then(function (m) { return m.HistoryModule; }); }, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'settings', loadChildren: function () { return Promise.resolve().then(function () { return require('./modules/settings/settings.module'); }).then(function (m) { return m.SettingsModule; }); } },
    { path: 'scheduler', loadChildren: function () { return Promise.resolve().then(function () { return require('./modules/scheduler/scheduler.module'); }).then(function (m) { return m.SchedulerModule; }); } }
];
