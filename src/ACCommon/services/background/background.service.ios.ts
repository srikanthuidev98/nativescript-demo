import { Injectable } from '@angular/core';

declare const android: any;

@Injectable({providedIn: 'root'})
export class BackgroundService {
    constructor() { }

    public static killProcess = false;

    public startBackgroundProcess() {
        // Android Only
    }

    public stopBackgroundProcess() {
        // Android Only
    }
}
