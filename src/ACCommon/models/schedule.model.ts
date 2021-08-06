import { PayRateType, VisitStatus, TaskType } from '../enums';

export interface Schedule { // This will be per Unique Caregiver
    ltcUniqueCaregiverId: string;
    cwUniqueCaregiverId: string;
    // Taxonomy switches (Any booleans we might need to be ablee to switch things on or off)
    // Can't think of any switches at the moment, but this will probably be added in later

    visits: ScheduleVisit[]; // This will be per visit
}

export interface ScheduleVisit {
    ltcVisitId: string;
    cwVisitId: string;
    ltcClientId: string;
    cwClientId: string;
    ltcCaregiverId: string;
    cwCaregiverId: string;
    name: string;
    address: string;
    secondAddress: string;
    city: string;
    state: string;
    zip: string;
    cellPhone: string;
    homePhone: string;
    checkInTime: Date; // The API sends as a string, so convert before using.
    checkOutTime: Date; // The API sends as a string, so convert before using.
    schedulingComment: string;
    payRate: number;
    payRateType: PayRateType;
    status: VisitStatus; // 2, 12, 13, 15 = Cancelled
    cancelledReason: string; // If visit was cancelled
    totalHours: number; // Total hours of visit. (If this is too hard to calculate on service side, I can do it on the app side)
    hasPicture: boolean; // If Client has a picture, Apex will need a way to retrieve that picture
    tasks: CalendarTask[];

    // Taxonomy switches (For client)
}

export interface CalendarTask {
    serviceTaskId: number;
    task: string;
    frequency: string;
    timesPerDay: string;
    comment: string;
    type: TaskType;
    categoryName: string;
    isRequired: boolean;
    Value?: number;         // Apex only
    ValueString?: string;   // Apex only
}


export function isScheduleVisitCancelled(visit: ScheduleVisit): boolean {
    if (visit.status === VisitStatus.Cancelled ||
        visit.status === VisitStatus.CancelledByClient ||
        visit.status === VisitStatus.CancelledByEmployee ||
        visit.status === VisitStatus.CancelledByOther) {
            return true;
    } else {
        return false;
    }
}

export function getCancelledReasonAsString(status: VisitStatus): string {
    switch (status) {
        case VisitStatus.Cancelled:
            return 'Visit was cancelled by scheduler.';
        case VisitStatus.CancelledByClient:
            return 'Visit was cancelled by client.';
        case VisitStatus.CancelledByEmployee:
            return 'Visit was cancelled by caregiver.';
        case VisitStatus.CancelledByOther:
            return 'Visit was cancelled by other.';
        default:
            return '';
    }
}

export function getScheduleVisitAddress(visit: ScheduleVisit): string {
    let secondAddress = '';
    if (visit.secondAddress) {
      secondAddress = visit.secondAddress + '\n';
    }

    return `${visit.address}\n${secondAddress}${visit.city}, ${visit.state} ${visit.zip}`;
}
