"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_guard_1 = require("./auth.guard");
var status_guard_1 = require("./status.guard");
exports.GUARDS = [
    auth_guard_1.AuthGuard,
    status_guard_1.StatusGuard
];
