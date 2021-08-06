"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_service_1 = require("./data/auth.service");
var history_service_1 = require("./data/history.service");
var language_service_1 = require("./language.service");
var shift_service_1 = require("./data/shift.service");
var connectivity_service_1 = require("./connectivity.service");
var client_service_1 = require("./data/client.service");
var check_permission_service_1 = require("./check-permission.service");
var profile_service_1 = require("./data/profile.service");
var location_service_1 = require("./data/location.service");
var multipart_handler_service_1 = require("./data/multipart-handler.service");
var api_helper_service_1 = require("./data/api-helper.service");
var timer_service_1 = require("./timer.service");
var validate_service_1 = require("./validate.service");
var fingerprint_service_1 = require("./fingerprint.service");
var logging_service_1 = require("./logging.service");
exports.SERVICES = [
    api_helper_service_1.ApiHelperService,
    auth_service_1.AuthService,
    history_service_1.HistoryService,
    shift_service_1.ShiftService,
    client_service_1.ClientService,
    language_service_1.LanguageService,
    connectivity_service_1.ConnectivityService,
    check_permission_service_1.CheckPermissionService,
    profile_service_1.ProfileService,
    location_service_1.LocationService,
    multipart_handler_service_1.MultipartHandlerService,
    timer_service_1.TimerService,
    validate_service_1.ValidateService,
    fingerprint_service_1.FingerprintService,
    logging_service_1.LoggingService
];
