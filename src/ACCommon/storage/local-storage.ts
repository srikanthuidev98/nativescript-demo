import { Caregiver, InvalidLocation } from '../models';
import { AcSecureStorage } from './ac-secure-storage';
import { getBoolean, setBoolean } from 'tns-core-modules/application-settings';
import { AppStateModel } from '../states/app.state';
import { InvalidLocationReason } from '../enums';
import { DateService } from '../services/date.service';

export class LocalStorageService {

    constructor() { }

    public static setAppState(state: AppStateModel) {
        AcSecureStorage.set('appState', state);
    }

    public static getAppState(): AppStateModel {
        return AcSecureStorage.get<AppStateModel>('appState');
    }

    public static setEmail(email: string) {
        AcSecureStorage.set('email', email);
    }

    public static getEmail(): string {
        return AcSecureStorage.get<string>('email');
    }

    public static setEnvironment(environment: string) {
        AcSecureStorage.set('environment', environment);
    }

    public static getEnvironment(): string {
        return AcSecureStorage.get<string>('environment');
    }

    public static addLocationInvaildForVisit(reason: InvalidLocationReason) {
        let reasons = LocalStorageService.getLocationInvaildForVisit();
        if (!reasons) {
            reasons = [];
        }

        const newReason: InvalidLocation = {
            startDate: DateService.getString(new Date()),
            reason: reason
        };

        reasons.push(newReason);
        AcSecureStorage.set('locationInvaild', reasons);
    }

    public static updateLocationInvaildForVisit(reason: InvalidLocationReason) {
        const reasons = LocalStorageService.getLocationInvaildForVisit();

        const index = reasons.findIndex(r => r.reason === reason && !r.endDate);
        if (index !== -1) {
            reasons[index].endDate = DateService.getString(new Date());
        }

        AcSecureStorage.set('locationInvaild', reasons);
    }

    public static getLocationInvaildForVisit(): InvalidLocation[] {
        let reasons = AcSecureStorage.get<InvalidLocation[]>('locationInvaild');
        if (!reasons) {
            reasons = [];
        }
        return reasons;
    }

    public static removeLocationInvaildForVisit() {
        AcSecureStorage.set('locationInvaild', []);
    }

    public static setFingerprintData(data: Caregiver) {
        AcSecureStorage.set('fingerprintData', data);
    }

    public static getFingerprintData(): Caregiver {
        return AcSecureStorage.get<Caregiver>('fingerprintData');
    }

    public static setOtherDataOnLogout() {
        const email = LocalStorageService.getEmail();
        const fingerprintData = LocalStorageService.getFingerprintData();

        if (email) {
            LocalStorageService.setEmail(email);
        }

        if (fingerprintData) {
            LocalStorageService.setFingerprintData(fingerprintData);
        }
    }

    public static isFirstRun(): boolean {
        const isFirst = getBoolean('isFirst', true);

        if (isFirst) {
            console.log('Is first run. Deleting all data on iOS.');
            setBoolean('isFirst', false);
            LocalStorageService.setEmail('');
            LocalStorageService.setFingerprintData(null);
            return true;
        }
        return false;
    }
}
