import { Injectable } from '@angular/core';

import { device } from 'tns-core-modules/platform';

/**
 * Used to get the UUID for a device.
 * UUID is the unique identifier for Android and iOS.
 */
@Injectable({ providedIn: 'root' })
export class UuidHelper {

    constructor() { }

    /**
     * Returns UUID, or empty string if ran on Web.
     */
    getUuid(): string {
        return device.uuid;
    }
}
