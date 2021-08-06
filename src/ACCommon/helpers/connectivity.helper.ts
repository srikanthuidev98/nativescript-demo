import { Injectable } from '@angular/core';
import { connectionType, startMonitoring, stopMonitoring, getConnectionType } from 'tns-core-modules/connectivity';
import { BehaviorSubject } from 'rxjs';

/**
 * This service is used to check the user's connectivity state.
 */
@Injectable({ providedIn: 'root' })
export class ConnectivityHelper {

    constructor() { }

    /**
     * BehaviorSubject that returns a boolean if the user has internet or not.
     */
    public hasInternet$ = new BehaviorSubject<boolean>(this.checkInternet());

    /**
     * Starts monitoring of the internet state, and will update hasInternet.
     * To get Internet state, please subscribe to hasInternet
     *
     * When the internet state turns true, it will try to sync any visit that was created while offline.
     */
    public startMonitoring() {
        // Just incase startMonitoring was called already.
        stopMonitoring();

        startMonitoring((newConnectionType) => {
            switch (newConnectionType) {
                case connectionType.none:
                    console.log('Connection type changed to none.');
                    this.hasInternet$.next(false);
                    break;
                case connectionType.wifi:
                    console.log('Connection type changed to WiFi.');
                    this.hasInternet$.next(true);
                    break;
                case connectionType.mobile:
                    console.log('Connection type changed to mobile.');
                    this.hasInternet$.next(true);
                    break;
                case connectionType.vpn:
                    console.log('Connection type changed to VPN.');
                    this.hasInternet$.next(true);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Checks internet.
     * If you need to use in HTML or need to subscribe on connection. Use hasInternet$ instead
     */
    public checkInternet(): boolean {
        const connection = getConnectionType();
        if (connection === connectionType.mobile || connection === connectionType.wifi || connection === connectionType.vpn) {
            return true;
        }

        return false;
    }
}
