"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createEditVisit(detail, caregiver, phoneNumber, editTime) {
    var editVisits = [];
    var mileage = detail.OtherServices['MIL'];
    delete detail.OtherServices['MIL'];
    var oldVisit = createVisit(detail, caregiver, phoneNumber, mileage);
    var newVisit = createVisit(detail, caregiver, phoneNumber, mileage, editTime);
    editVisits.push({
        Identifier: 'old',
        Visit: oldVisit
    });
    editVisits.push({
        Identifier: 'new',
        Visit: newVisit
    });
    return editVisits;
}
exports.createEditVisit = createEditVisit;
function createVisit(detail, caregiver, phoneNumber, mileage, editTime) {
    var visit = {
        CheckInTime: detail.StartTime,
        CheckOutTime: detail.EndTime,
        CICallerANI: phoneNumber,
        COCallerANI: phoneNumber,
        CaregiverId: detail.CaregiverId,
        CaregiverName: caregiver.Name,
        Mileage: mileage,
        Comment: 'Mobile app time change.',
        AdditionalServices: detail.OtherServices,
        BathingID: detail.Services['bath'],
        DressingID: detail.Services['dress'],
        TransferringID: detail.Services['transf'],
        ContinenceID: detail.Services['contin'],
        ToiletingID: detail.Services['toilet'],
        FeedingID: detail.Services['feed'],
        SupervisionID: detail.Services['super'],
        CISourceId: 300,
        VisitDetails: [{ ShiftId: detail.ShiftId }]
    };
    if (editTime) {
        visit.CheckInTime = editTime.StartTime;
        visit.CheckOutTime = editTime.EndTime;
    }
    return visit;
}
