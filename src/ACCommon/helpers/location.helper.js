"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('nativescript-local-notifications');
var core_1 = require("@angular/core");
var models_1 = require("../models");
var nativescript_geolocation_1 = require("nativescript-geolocation");
var nativescript_local_notifications_1 = require("nativescript-local-notifications");
var router_helper_1 = require("../helpers/router.helper");
var enums_1 = require("../enums");
var dialog_helper_1 = require("./dialog.helper");
var page_1 = require("tns-core-modules/ui/page/page");
var LocationHelper = /** @class */ (function () {
    function LocationHelper(router, dialogHelper) {
        this.router = router;
        this.dialogHelper = dialogHelper;
    }
    LocationHelper_1 = LocationHelper;
    LocationHelper.calculateDistance = function (result) {
        console.log(result.latitude);
        console.log(LocationHelper_1.targetLat);
        // km (change this constant to get miles)
        var R = 6371;
        var dLat = (result.latitude - LocationHelper_1.targetLat) * Math.PI / 180;
        var dLon = (result.longitude - LocationHelper_1.targetLon) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(LocationHelper_1.targetLat * Math.PI / 180) * Math.cos(result.latitude * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        console.log('Calculated Static Formula Distance: ' + Math.round(d * 1000) + 'm');
        return Math.round(d * 1000);
    };
    LocationHelper.newLocation = function (loc) {
        var targetLocation = new nativescript_geolocation_1.Location();
        targetLocation.longitude = LocationHelper_1.targetLat;
        targetLocation.latitude = LocationHelper_1.targetLon;
    };
    LocationHelper.prototype.enableWatchLocation = function (client) {
        var _this = this;
        return new Promise(function (resolve) {
            // this.router.navigate(['status/timepoints']);
            _this.watchId = nativescript_geolocation_1.watchLocation(function (loc) {
                if (loc) {
                    console.log('WatchLocation_Received location:' + loc);
                    LocationHelper_1.targetLat = client.Latitude;
                    LocationHelper_1.targetLon = client.Longitude;
                    // LocationHelper.newLocation(loc);
                    console.log('WatchLocation_Distance: ' + LocationHelper_1.calculateDistance(loc));
                    console.log('WatchLocation_Calculated Threshold: ' + enums_1.TimePoint.threshold + loc.verticalAccuracy);
                    console.log('WatchLocation_CaregiverId ' + client.CaregiverId);
                    // Location is outside of geofence
                    var response = new models_1.GeofencingEvent();
                    response.Distance = LocationHelper_1.calculateDistance(loc);
                    response.Accuracy = loc.verticalAccuracy;
                    response.Threshold = enums_1.TimePoint.threshold + loc.verticalAccuracy;
                    response.Latitude = loc.latitude;
                    response.Longitude = loc.longitude;
                    response.TargetLatitude = LocationHelper_1.targetLat;
                    response.TargetLongitude = LocationHelper_1.targetLon;
                    response.CauseDate = new Date();
                    response.Cause = 'Not Prompted';
                    response.NotificationDate = new Date();
                    response.Date = new Date();
                    response.Origin = enums_1.TimePoint.Location;
                    response.CaregiverId = client.CaregiverId;
                    resolve(response);
                }
            }, function (e) {
                console.log('Error: ' + e.message);
            }, {
                desiredAccuracy: enums_1.TimePoint.desiredAccuracyMode,
                updateDistance: enums_1.TimePoint.threshold,
                minimumUpdateTime: enums_1.TimePoint.minimumUpdateTime
            });
        });
    };
    LocationHelper.prototype.disableWatchLocation = function () {
        console.log('Disable Watch Lcoation');
        if (this.watchId) {
            nativescript_geolocation_1.clearWatch(this.watchId);
        }
    };
    LocationHelper.prototype.checkLocation = function (client) {
        var _this = this;
        return new Promise(function (resolve) {
            if (!client) {
                return;
            }
            nativescript_local_notifications_1.LocalNotifications.cancelAll();
            LocationHelper_1.targetLat = client.Latitude;
            LocationHelper_1.targetLon = client.Longitude;
            console.log("Target Coordinates Lat: " + LocationHelper_1.targetLat + " Lon: " + LocationHelper_1.targetLon);
            nativescript_geolocation_1.enableLocationRequest(true).then(function () {
                nativescript_geolocation_1.isEnabled().then(function (isLocationEnabled) {
                    if (!isLocationEnabled) {
                    }
                    // MUST pass empty object!!
                    nativescript_geolocation_1.getCurrentLocation({
                        desiredAccuracy: enums_1.TimePoint.desiredAccuracyMode,
                        updateDistance: enums_1.TimePoint.minDistance,
                        maximumAge: enums_1.TimePoint.maxAge,
                        timeout: enums_1.TimePoint.timeout,
                        iosPausesLocationUpdatesAutomatically: false,
                        minimumUpdateTime: enums_1.TimePoint.minimumUpdateTime
                    }).then(function (result) {
                        _this.currentLat = result.latitude;
                        _this.currentLon = result.longitude;
                        _this.Accuracy = result.verticalAccuracy;
                        _this.getDistance(result).then(function (data) {
                            var response = new models_1.GeofencingEvent();
                            response.Distance = data;
                            response.Accuracy = result.verticalAccuracy;
                            response.Threshold = enums_1.TimePoint.threshold + _this.Accuracy;
                            response.Latitude = _this.currentLat;
                            response.Longitude = _this.currentLon;
                            response.TargetLatitude = LocationHelper_1.targetLat;
                            response.TargetLongitude = LocationHelper_1.targetLon;
                            response.CauseDate = new Date();
                            response.Cause = 'Not Prompted';
                            response.NotificationDate = new Date();
                            response.Date = new Date();
                            response.CaregiverId = client.CaregiverId;
                            if (data > response.Threshold) {
                                response.GeofencingType = enums_1.TimePoint.out;
                            }
                            else {
                                response.GeofencingType = enums_1.TimePoint.in;
                            }
                            // console.log(response);
                            resolve(response);
                        }, function (error) {
                            console.log(error);
                        });
                    }).catch(function (e) {
                        console.log('loc error', e);
                    });
                });
            });
        });
    };
    LocationHelper.prototype.getDistance = function (result) {
        return new Promise(function (resolve) {
            // km (change this constant to get miles)
            var R = 6371;
            var dLat = (result.latitude - LocationHelper_1.targetLat) * Math.PI / 180;
            var dLon = (result.longitude - LocationHelper_1.targetLon) * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(LocationHelper_1.targetLat * Math.PI / 180) * Math.cos(result.latitude * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            console.log('Calculated Distance: ' + Math.round(d * 1000) + 'm');
            resolve(Math.round(d * 1000));
        });
    };
    LocationHelper.prototype.enableLocation = function () {
        nativescript_geolocation_1.enableLocationRequest(true).then(function () { })
            .catch(function (error) {
            console.log(error);
        });
    };
    LocationHelper.prototype.isLocationEnabled = function () {
        var _this = this;
        nativescript_geolocation_1.isEnabled().then(function (isLocationEnabled) {
            if (!isLocationEnabled) {
                if (page_1.isIOS) {
                    _this.dialogHelper.alert("Please give AssuriCare permission to always use location services.\n                    (Settings -> AssuriCare -> Location -> Always)", 'Location Permissions', 'Ok').then(function () {
                        _this.isLocationEnabled();
                    });
                }
                else {
                    _this.dialogHelper.alert("Please give AssuriCare permission to always use location services.", 'Location Permissions', 'Ok').then(function () {
                        _this.enableLocation();
                        _this.isLocationEnabled();
                    });
                }
            }
        });
    };
    var LocationHelper_1;
    LocationHelper = LocationHelper_1 = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [router_helper_1.RouterHelper, dialog_helper_1.DialogHelper])
    ], LocationHelper);
    return LocationHelper;
}());
exports.LocationHelper = LocationHelper;
