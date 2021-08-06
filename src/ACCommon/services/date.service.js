"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
/**
 * This service is used to create Dates and Date strings using moment.js
 */
var DateService = /** @class */ (function () {
    function DateService() {
    }
    DateService.getDate = function (dateString) {
        return moment(dateString).toDate();
    };
    DateService.getString = function (date) {
        var mDate = moment(date);
        return mDate.format();
    };
    return DateService;
}());
exports.DateService = DateService;
