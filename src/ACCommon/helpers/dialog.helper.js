"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialogs_1 = require("tns-core-modules/ui/dialogs");
/**
 * This DialogHelper is used to create alerts for both Mobile and Web.
 *
 * Please only use this Dialog helper when using any sort of alerts.
 */
var DialogHelper = /** @class */ (function () {
    function DialogHelper() {
    }
    DialogHelper.prototype.alert = function (message, title, okButtonText) {
        if (title === void 0) { title = 'Alert'; }
        if (okButtonText === void 0) { okButtonText = 'OK'; }
        var options = {
            title: title,
            message: message,
            okButtonText: okButtonText
        };
        return dialogs_1.alert(options);
    };
    DialogHelper.prototype.confirmAlert = function (message, title, okButtonText, cancelButtonText) {
        if (title === void 0) { title = 'Alert'; }
        if (okButtonText === void 0) { okButtonText = 'OK'; }
        if (cancelButtonText === void 0) { cancelButtonText = 'Cancel'; }
        var options = {
            title: title,
            message: message,
            okButtonText: okButtonText,
            cancelButtonText: cancelButtonText
        };
        return dialogs_1.confirm(options);
    };
    /**
     * Generic Action list dialog
     * @param options - All options (string)
     * @param title - title
     */
    DialogHelper.prototype.genericActionDialog = function (options, title) {
        var allOptions = {
            title: title,
            actions: options,
            cancelButtonText: 'Cancel'
        };
        return dialogs_1.action(allOptions);
    };
    /**
     * This is used to show the dialog action sheet for profile picture.
     *
     * @param showDeleteOption - send true if you want the 'Delete Picture' option to show.
     *
     * It will return one of these 4 strings:
     * 'Choose Picture' | 'Take Picture' | 'Delete Picture' | 'Cancel'
     */
    DialogHelper.prototype.pictureActionDialog = function (showDeleteOption) {
        var options = {
            cancelButtonText: 'Cancel'
        };
        if (showDeleteOption) {
            options.actions = ['Choose Picture', 'Take Picture', 'Delete Picture'];
        }
        else {
            options.actions = ['Choose Picture', 'Take Picture'];
        }
        return dialogs_1.action(options);
    };
    DialogHelper.prototype.activitiesActionDialog = function (title, option) {
        var options = {
            // title: title,
            cancelButtonText: 'Cancel'
        };
        if (option === 2) {
            options.actions = ['Hands-On assistance', 'Standby assistance', 'Did not provide'];
        }
        else {
            options.actions = ['Provided', 'Did not provide'];
        }
        return dialogs_1.action(options);
    };
    DialogHelper.prototype.otherInfoActionDialog = function () {
        var options = {
            cancelButtonText: 'Cancel',
            actions: ['Yes', 'No']
        };
        return dialogs_1.action(options);
    };
    DialogHelper = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], DialogHelper);
    return DialogHelper;
}());
exports.DialogHelper = DialogHelper;
