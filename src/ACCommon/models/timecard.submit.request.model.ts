import { CalendarTask, GeofencingEvent, InvalidLocation } from '.';
import { SubmitActionType } from '../enums';

export interface SubmitActionRequest {
    visit: TimecardSubmitRequest;

    /**
     * This is used if there is a dual Client.
     * During checkout, if ADLs are different, use this to save c2's shift.
     */
    visit2?: TimecardSubmitRequest;
}

export interface TimecardSubmitRequest {
    CaregiverId?: number;
    ClientId?: number;
    ShiftId?: number;
    ADLs?: any;
    IADLs?: any;
    ScheduleServices?: CalendarTask[]; // Only for Scheduler on Apex
    GeofencingEvents: GeofencingEvent[];
    SignatureContact?: number;
    CheckInTime?: string;
    CheckOutTime?: string;
    appVersion?: string;
    appOS?: string;
    CheckInAudio?: string;
    CheckOutAudio?: string;
    SignatureImage?: string;
    ActionType: SubmitActionType;
    DeviceId?: string;
    Mileage?: number;

    InvalidLocations?: InvalidLocation[];
    GeofencingEventOptions?: number[];
    GeofencingEventCause?: string;
}
