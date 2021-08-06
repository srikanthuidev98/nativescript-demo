import { InvalidLocationReason } from '../enums';

export interface InvalidLocation {
    startDate: string;
    endDate?: string;
    reason: InvalidLocationReason;
}
