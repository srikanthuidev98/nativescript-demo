import { SecureStorage } from 'nativescript-secure-storage';
import * as appSettings from 'tns-core-modules/application-settings';
import { getBoolean, setBoolean } from 'tns-core-modules/application-settings';

const secureStorage = new SecureStorage();

export class AcSecureStorage {

    constructor() {}

    public static set(key: string, value: any) {
        const valueJSON = JSON.stringify(value);
        secureStorage.setSync({ key: key, value: valueJSON});
    }

    public static get<T>(key: string): T {
        const valueJSON = secureStorage.getSync({key: key});
        return JSON.parse(valueJSON) as T;
    }

    public static remove(key: string) {
        secureStorage.removeSync({key: key});
    }
}
