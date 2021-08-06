import { ClientContact } from './client-contact.model';
import { PayRateType } from '../enums';
import { Question } from './question.model';
import { CalendarTask } from './schedule.model';

export interface Client {
    CWCustomerid: string;
    CWCGID: string;
    RefSourceId: number;
    CustomerState: string;
    CustomerStateAbbrev: string;
    FraudStatement: string;
    CaregiverId: number;
    Name: string;
    Latitude: number;
    Longitude: number;
    PayRate: number;
    PayRateComment: string;
    PayRateType: PayRateType;
    Threshold: number;
    Relatives: number[];
    ReimbursesMileage: boolean;
    Id: number;
    ClientContacts: ClientContact[];
    OAID: number;
    ScheduleServices?: CalendarTask[]; // Only for Apex

    // Taxonomy switches:
    CheckInMessage: string;
    NeedsToSign: boolean;
    CareGiverEditVisitMode: number;
    ShowClientUnavailable: boolean;
    AllowEditingShift: boolean;
    ShowFraudStatement: boolean;
    RegistryProvider: boolean;
    showLocationAlert: boolean;
    showFinancialInfo: boolean;
    showScheduler: boolean;
    showEditShift: boolean;
    ScheduleEnabled: boolean;
    askCheckInQuestions: boolean;
    askCheckOutQuestions: boolean;
    MessagingEnabled: boolean;

    Questions?: Question[];

    // Used for any extra data that needs to be dynamic for showing up on UI
    extra?: any;
}

export interface DualClient {
    c1: Client;
    c2: Client;
}

/**
 * Used to compare two clients to see if they are the same.
 */
export function compareClients(c1: Client, c2: Client): boolean {
    if (c1 && c2) {
        if (c1.Id === c2.Id && c1.CaregiverId === c2.CaregiverId) {
            return true;
        }
    }
    return false;
}
