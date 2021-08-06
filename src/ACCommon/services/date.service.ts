import * as moment from 'moment';
import { unitOfTime } from 'moment';

/**
 * This service is used to create Dates and Date strings using moment.js
 */
export class DateService {

    constructor() { }

    /**
     * Used to get a Date object from a string.
     * *ONLY* Use format parameter if you are getting a RFC2822 Error.
     *
     * @param reFormat - If getting a RFC2822 Error, send true
     */
    public static getDate(dateString: string, reFormat = false): Date {
        if (reFormat) {
            const d = new Date(dateString);
            return moment(d).toDate();
        } else {
            return moment(dateString).toDate();
        }
    }

    /**
     * This returns the date as: MM/DD/YYYY hh:mm:ss a
     */
    public static getFormatedString(date: Date): string {
        const mDate = moment(date);
        return mDate.format('MM/DD/YYYY hh:mm:ss a');
    }

    public static getString(date: Date): string {
        const mDate = moment(date);
        return mDate.format();
    }

    public static checkIfDateStringsAreSame(date1: string, date2: string) {
        const a = moment(date1).milliseconds(0);
        const b = moment(date2).milliseconds(0);

        return a.isSame(b);
    }

    public static startOf(date: string | Date, type: 'day' | 'week' | 'month' | 'year'): Date {
        const mDate = moment(date);
        return mDate.startOf(type).toDate();
    }

    public static endOf(date: string | Date, type: 'day' | 'week' | 'month' | 'year'): Date {
        const mDate = moment(date);
        return mDate.endOf(type).toDate();
    }

    /**
     * Returns a formated string of the date or date string
     *
     * @param date - Can be either a Date or a date string
     * @param format - type of format, EX: 'YYYY MM DD',
     *
     * https://momentjs.com/docs/#/displaying/format/
     */
    public static formatDate(date: string | Date, format: string): string {
        return moment(date).format(format);
    }

    public static isAfter(date1: Date | string, date2: Date | string) {
        return moment(date1).isAfter(date2);
    }

    public static isBefore(date1: Date | string, date2: Date | string) {
        return moment(date1).isBefore(date2);
    }

    public static getDayName(date: Date | string) {
        return moment(date).format('dddd');
    }

    public static getAllDayNames(): string[] {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    public static add(date: Date | string, amount: number, type: unitOfTime.DurationConstructor) {
        const endDateMoment = moment(date);
        endDateMoment.add(amount, type);
        return endDateMoment;
    }

    /**
     * Returns the amount of time bewteen 2 dates depending on the type passed.
     *
     * @param type - Can be one of three: 'asDays' | 'asHours' | 'asMinutes'
     */
    public static durationBetweenDates(date1: Date | string, date2: Date | string,
        type: 'asWeeks' | 'asDays' | 'asHours' | 'asMinutes' | 'asSeconds') {
        const mDate1 = moment(date1);
        const mDate2 = moment(date2);

        const duration = moment.duration(mDate1.diff(mDate2));
        let amount = duration[type]();

        if (amount < 0) {
            amount = amount * -1;
        }

        return amount;
    }
}
