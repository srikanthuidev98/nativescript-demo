import { Client } from '.';
import { TimecardSubmitRequest } from './timecard.submit.request.model';

export interface Visit {
    PayrollId?: number;
    CustomerId: number;
    VisitId?: string;
    CustomerName: string;
    PayrollDate?: string;
    CaregiverId: number;
    CaregiverName?: string;
    RateComment?: string;
    CheckInTime: string;
    CheckOutTime?: string;
    CICallerANI?: string;
    COCallerANI?: string;
    PaidHours?: number;
    TotalHours?: number;
    PayType?: string;
    PayRate?: string;
    PayAmount?: number;
    AdjustmentAmount?: string;
    ShiftAmount?: string;
    EffectiveRate?: string;
    RegistryAdjustment?: string;
    RegistryFee?: number;
    RegistryRate?: string;
    ExpenseAmount?: number;
    CISourceId?: number;
    COSourceId?: number;
    Mileage?: number;
    MileageAmount?: number;
    Bathing?: string;
    Dressing?: string;
    Transferring?: string;
    Continence?: string;
    Toileting?: string;
    Feeding?: string;
    Supervision?: string;
    BathingID?: number;
    DressingID?: number;
    TransferringID?: number;
    ContinenceID?: number;
    ToiletingID?: number;
    FeedingID?: number;
    SupervisionID?: number;
    IADLS?: string;
    OKtoPay?: boolean;
    PeriodStartDate?: string;
    PeriodEndDate?: string;
    AuthApprover?: string;
    ReadyforQA?: boolean;
    TimeAtHomeProportion?: number;
    MultiOTDoNotPrioritize?: boolean;
    SignatureGuid?: string;
    Finalized?: boolean;
    Comment?: string;
    ForceOT?: boolean;
    CIShiftSourceDescription?: string;
    COShiftSourceDescription?: string;
    CIShiftSourceTypeId?: number;
    COShiftSourceTypeId?: number;
    CIShiftSourceTypeDescription?: string;
    COShiftSourceTypeDescription?: string;
    CIShiftSourceSubTypeId?: number;
    COShiftSourceSubTypeId?: number;
    CIShiftSourceSubTypeAbrv?: string;
    COShiftSourceSubTypeAbrv?: string;
    CIAvoidTrigger?: boolean;
    COAvoidTrigger?: boolean;
    AdditionalServices?: any;
    VisitDetails: VisitDetail[];
}

export interface VisitDetail {
    VisitId: string;
    ShiftId: number;
    ShiftTypeId: number;
    ShiftTypeName: string;
    CheckInTime: string;
    CheckOutTime?: string;
    CheckInTimeAsString: string;
    CheckOutTimeAsString: string;
    CITimeCardId: number;
    COTimecardId: number;
    PaidHours: number;
    TotalHours: number;
    TotalTowardsOTHours: number;
    Holiday: boolean;
    Sortorder: string;
    CancelledCheck: boolean;
    PayAmount: string;
    PayRate: string;
    AdjustmentAmount: string;
    PayType: string;
    Continuation: boolean;
    ShiftAmount: string;
    EffectiveRate: string;
    RegistryAdjustment: string;
    RegistryFee: string;
    RegistryRate: string;
    CGOverTime: boolean;
    LinkShiftId?: any;
    LinkShiftIdFor?: any;
    LinkPayrollIdFor?: any;
    CGAdjShiftId?: any;
    RegAdjShiftId?: any;
    MilesAdjShiftId?: any;
    UnitTypeName: string;
}

export function getFirstLastNameFromVisit(visit: Visit): string {
    if (visit) {
      const splitName = visit.CustomerName.split(', ');
      return `${splitName[1]} ${splitName[0]}`;
    }

    return '';
}

/**
 * Returns the value of the ID: (Did not provide, Standby, Hands On)
 * @param service - Serivce name: IE: Bathing or DressingID
 * @param serviceId - Service ID. IE: 0, 1, 2
 */
export function getServiceValue(service: string, serviceId: number) {
    const last2 = service.slice(-2);
    if (last2 === 'ID') {
        service = service.slice(0, -2);
    }

    if (service === 'Supervision' && serviceId === 1) {
      return 'Provided';
    }

    if (serviceId === 1) {
        return 'Hands On';
    } else if (serviceId === 2) {
        return 'Standby';
    } else {
        return 'Did not provide';
    }
}

/**
 * Used to compare 2 visits.
 * Returns true if they are the same.
 */
export function compareVisits(v1: Visit, v2: Visit) {
    if (v1 && v2) {
        if (v1.CaregiverId === v2.CaregiverId &&
            v1.CustomerId === v2.CustomerId &&
            v1.CheckInTime === v2.CheckInTime &&
            v1.CheckOutTime === v2.CheckOutTime) {
            return true;
        }
    }
    return false;
}

export function convertTimecardRequestToVisit(timecardRequest: TimecardSubmitRequest, client: Client): Visit {
    const names = client.Name.split(' ');
    const visit: Visit = {
        CustomerId: timecardRequest.ClientId,
        CheckInTime: timecardRequest.CheckInTime,
        CheckOutTime: timecardRequest.CheckOutTime,
        CaregiverId: timecardRequest.CaregiverId,
        CustomerName: `${names[1]}, ${names[0]}`,
        VisitDetails: []
    };

    return visit;
}
