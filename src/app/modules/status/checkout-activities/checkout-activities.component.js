"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var store_1 = require("@ngxs/store");
var states_1 = require("../../../../ACCommon/states");
var rxjs_1 = require("rxjs");
var models_1 = require("../../../../ACCommon/models");
var operators_1 = require("rxjs/operators");
var helpers_1 = require("../../../../ACCommon/helpers");
var emitter_1 = require("@ngxs-labs/emitter");
var enums_1 = require("../../../../ACCommon/enums");
var router_1 = require("@angular/router");
var CheckoutActivitiesComponent = /** @class */ (function () {
    function CheckoutActivitiesComponent(dialogHelper, switchHelper, loadingHelper, routerHelper, route) {
        this.dialogHelper = dialogHelper;
        this.switchHelper = switchHelper;
        this.loadingHelper = loadingHelper;
        this.routerHelper = routerHelper;
        this.route = route;
        this.isDualClient = false;
        this.dualClientNum = 0;
        this.careNeedsChangedText = ''; // ngModel to care needs change textView
        this.visitNotesText = ''; // ngModel to visit notes textView
        // Taxonomy switches
        this.showOtherInfo = false;
        this.needsToSign = false;
        this.allowEditingShift = false;
        this.title = 'Check Out';
        this.continueBtnText = 'Check Out';
        this.titleSubText = '';
        this.careTextOption = 'Please Select';
        this.hospitalizedTextOption = 'Please Select';
        this.isSummaryPage = false;
        this.showEditBtn = false;
        this.editRows = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']; // Default edit button colors.
        this.editTextFieldColors = ['#979797', '#979797', '#979797', '#979797', '#979797']; // Default Text field border colors.
    }
    CheckoutActivitiesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dualClientNum = +this.route.snapshot.paramMap.get('dualClientNum'); // Grabs route parameter
        this.otherInfo = new models_1.OtherInfo();
        this.adlTexts = [];
        this.selectedADLs = {};
        this.selectedIADLs = {};
        this.client$.pipe(operators_1.first()).subscribe(function (client) {
            _this.dualClient$.pipe(operators_1.first()).subscribe(function (dualClient) {
                if (dualClient) {
                    client = dualClient["c" + (_this.dualClientNum + 1)]; // EX: dualClient.c1
                    _this.isDualClient = true;
                }
                _this.client = client;
                _this.client.ShowOtherInfo === 0 ? _this.showOtherInfo = false : _this.showOtherInfo = true;
                _this.client.NeedsToSign === 0 ? _this.needsToSign = false : _this.needsToSign = true;
                _this.client.AllowEditingShift === 0 ? _this.allowEditingShift = false : _this.allowEditingShift = true;
                // this.showOtherInfo = true;      // Used for testing Other Info.
                // this.needsToSign = false;        // Used for testing signature.
                // this.allowEditingShift = true;  // Used for testing editting.
            });
        });
        this.adls$.pipe(operators_1.first()).subscribe(function (adls) {
            adls.forEach(function (adl) {
                _this.selectedADLs[adl.Key] = 0;
                _this.adlTexts.push('Did not provide');
            });
        });
        this.iadls$.pipe(operators_1.first()).subscribe(function (iadls) {
            iadls.forEach(function (iadl) {
                _this.selectedIADLs[iadl.Key] = 0;
            });
            if (_this.client.ReimbursesMileage) {
                _this.selectedIADLs['MIL'] = 0;
            }
        });
        this.editShift$.pipe(operators_1.first()).subscribe(function (editShift) {
            if (editShift) {
                _this.isSummaryPage = true;
                _this.title = 'Verify Shift';
                _this.continueBtnText = 'Continue';
                _this.titleSubText = 'Please review the visit details below. If any information is incorrect ' +
                    'touch the Edit Icon on each section header and correct the information. ' +
                    'When your review is complete touch the Continue button at the bottom.';
                Object.keys(editShift.shift.Services).forEach(function (key, index) {
                    _this.selectedADLs[key] = editShift.shift.Services[key];
                    if (editShift.shift.Services[key] === 1) {
                        if (key === 'super') {
                            _this.adlTexts[index] = 'Provided';
                        }
                        else {
                            _this.adlTexts[index] = 'Hands On';
                        }
                    }
                    else if (editShift.shift.Services[key] === 2) {
                        _this.adlTexts[index] = 'Standby';
                    }
                });
                Object.keys(editShift.shift.OtherServices).forEach(function (key) {
                    _this.selectedIADLs[key] = editShift.shift.OtherServices[key];
                    if (key === 'MIL') {
                        _this.mileage = _this.selectedIADLs[key];
                    }
                });
                if (_this.showOtherInfo) {
                    _this.careTextOption = editShift.shift.OtherInfo.DidCareChange ? 'Yes' : 'No';
                    _this.hospitalizedTextOption = editShift.shift.OtherInfo.WasHospitalized ? 'Yes' : 'No';
                    _this.careNeedsChangedText = editShift.shift.OtherInfo.CareChangeNotes;
                    _this.visitNotesText = editShift.shift.OtherInfo.VisitNotes;
                }
                if (_this.allowEditingShift) {
                    _this.showEditBtn = true;
                }
                _this.dialogHelper.alert('Please hand the phone to your client', 'Client Review', 'Close');
            }
            else {
                _this.titleSubText = 'Indicate which Activities of Daily Living you provided assistance with during this shift.';
            }
        });
        this.loadingHelper.hideIndicator();
    };
    CheckoutActivitiesComponent.prototype.adlOptionTap = function (adl, index) {
        var _this = this;
        this.dialogHelper.activitiesActionDialog(adl.Title, adl.Option).then(function (result) {
            switch (result) {
                case 'Hands-On assistance':
                    _this.selectedADLs[adl.Key] = 1;
                    _this.adlTexts[index] = 'Hands-On';
                    break;
                case 'Standby assistance':
                    _this.selectedADLs[adl.Key] = 2;
                    _this.adlTexts[index] = 'Standby';
                    break;
                case 'Provided':
                    _this.selectedADLs[adl.Key] = 1;
                    _this.adlTexts[index] = 'Provided';
                    break;
                case 'Did not provide':
                    _this.selectedADLs[adl.Key] = 0;
                    _this.adlTexts[index] = 'Did not provide';
                    break;
            }
        });
    };
    CheckoutActivitiesComponent.prototype.onCheckedChange = function (args, iadl) {
        if (this.switchHelper.switch(args)) {
            this.selectedIADLs[iadl.Key] = 1; // Switch is on
        }
        else {
            this.selectedIADLs[iadl.Key] = 0; // Switch is off
        }
    };
    CheckoutActivitiesComponent.prototype.otherInfoOptionTap = function (info) {
        var _this = this;
        this.dialogHelper.otherInfoActionDialog().then(function (result) {
            if (result === 'Yes') {
                if (info === 'care') {
                    _this.careTextOption = 'Yes';
                }
                else {
                    _this.hospitalizedTextOption = 'Yes';
                }
            }
            else if (result === 'No') {
                if (info === 'care') {
                    _this.careTextOption = 'No';
                }
                else {
                    _this.hospitalizedTextOption = 'No';
                }
            }
        });
    };
    CheckoutActivitiesComponent.prototype.checkoutTap = function () {
        var _this = this;
        if (this.verifyInputs()) {
            this.shiftAction$.pipe(operators_1.first()).subscribe(function (shiftAction) {
                if (shiftAction) {
                    if (shiftAction.actionType === enums_1.SubmitActionType.Daily) {
                        shiftAction.shift.StartTime = new Date().toISOString();
                    }
                    shiftAction.shift.EndTime = new Date().toISOString();
                    if (Object.prototype.hasOwnProperty.call(_this.selectedIADLs, 'MIL')) {
                        _this.selectedIADLs['MIL'] = _this.mileage;
                    }
                    // if (this.showOtherInfo) {
                    //   const otherInfo = new OtherInfo();
                    //   otherInfo.DidCareChange = this.careTextOption === 'Yes';
                    //   otherInfo.WasHospitalized = this.hospitalizedTextOption === 'Yes';
                    //   otherInfo.CareChangeNotes = this.careNeedsChangedText;
                    //   otherInfo.VisitNotes = this.visitNotesText;
                    //   shiftAction.shift.OtherInfo = otherInfo;
                    // }
                    if (_this.dualClientNum === 0) { // If regular client, or dualCLient 1
                        shiftAction.shift.Services = _this.selectedADLs;
                        shiftAction.shift.OtherServices = _this.selectedIADLs;
                    }
                    else { // If DualClient 2 only
                        shiftAction.shift2 = __assign({}, shiftAction.shift);
                        shiftAction.shift2.Services = _this.selectedADLs;
                        shiftAction.shift2.OtherServices = _this.selectedIADLs;
                    }
                    // TODO Add signature workflow to dualClient
                    if (_this.isDualClient) {
                        if (_this.dualClientNum === 0) { // First pass on dualClient (c1)
                            _this.routerHelper.replace(['/status/client-available']);
                        }
                        else { // Second pass on dualClient (c2)
                            _this.submitAction.emit(shiftAction);
                        }
                    }
                    else { // Regular client. (Not a dual clientt)
                        if (_this.isSummaryPage) {
                            _this.setEditShift.emit(shiftAction);
                            _this.routerHelper.navigate(['/status/signature']);
                        }
                        else if (_this.needsToSign) {
                            _this.updateCurrnetShiftAction.emit(shiftAction);
                            _this.setEditShift.emit(shiftAction);
                            _this.routerHelper.replace(['/status/client-available']);
                        }
                        else {
                            _this.submitAction.emit(shiftAction);
                        }
                    }
                }
            });
        }
        else {
            console.log('WRONG DATA!!'); // TODO - Add error handling.
        }
    };
    CheckoutActivitiesComponent.prototype.verifyInputs = function () {
        if (this.mileage === undefined) {
            this.mileage = 0;
        }
        if (isNaN(this.mileage)) {
            console.log('Mileage has to be a number.');
            return false;
        }
        if (this.showOtherInfo) {
            if (this.careTextOption === 'Please Select' || this.hospitalizedTextOption === 'Please Select') {
                console.log('Please answer both questions');
                return false;
            }
        }
        return true;
    };
    CheckoutActivitiesComponent.prototype.editTap = function (row) {
        if (this.editRows[row] === '#ffffff') {
            this.editRows[row] = '#0091ff';
            this.editTextFieldColors[row] = '#0091ff';
        }
        else {
            this.editRows[row] = '#ffffff';
            this.editTextFieldColors[row] = '#979797';
        }
    };
    CheckoutActivitiesComponent.prototype.enableEdit = function (row) {
        if (this.isSummaryPage) {
            if (this.editRows[row] !== '#ffffff') {
                return true;
            }
        }
        else {
            return true;
        }
        return false;
    };
    __decorate([
        store_1.Select(states_1.HistoryState.getADLKeys),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckoutActivitiesComponent.prototype, "adls$", void 0);
    __decorate([
        store_1.Select(states_1.HistoryState.getIADLKeys),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckoutActivitiesComponent.prototype, "iadls$", void 0);
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentShiftAction),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckoutActivitiesComponent.prototype, "shiftAction$", void 0);
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentClient),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckoutActivitiesComponent.prototype, "client$", void 0);
    __decorate([
        store_1.Select(states_1.ShiftState.getCurrentDualClient),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckoutActivitiesComponent.prototype, "dualClient$", void 0);
    __decorate([
        store_1.Select(states_1.ShiftState.getEditShift),
        __metadata("design:type", rxjs_1.Observable)
    ], CheckoutActivitiesComponent.prototype, "editShift$", void 0);
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.setEditShift),
        __metadata("design:type", Object)
    ], CheckoutActivitiesComponent.prototype, "setEditShift", void 0);
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.updateCurrnetShiftAction),
        __metadata("design:type", Object)
    ], CheckoutActivitiesComponent.prototype, "updateCurrnetShiftAction", void 0);
    __decorate([
        emitter_1.Emitter(states_1.ShiftState.submitAction),
        __metadata("design:type", Object)
    ], CheckoutActivitiesComponent.prototype, "submitAction", void 0);
    CheckoutActivitiesComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-activities',
            templateUrl: './checkout-activities.component.html',
            styleUrls: ['./checkout-activities.component.scss']
        }),
        __metadata("design:paramtypes", [helpers_1.DialogHelper, helpers_1.SwitchHelper,
            helpers_1.LoadingHelper, helpers_1.RouterHelper, router_1.ActivatedRoute])
    ], CheckoutActivitiesComponent);
    return CheckoutActivitiesComponent;
}());
exports.CheckoutActivitiesComponent = CheckoutActivitiesComponent;
