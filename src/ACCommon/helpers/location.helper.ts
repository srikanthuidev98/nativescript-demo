require ('nativescript-local-notifications');
import { Injectable } from '@angular/core';
import { Client, GeofencingEvent, SubmitActionRequest } from '../models';
import { Location, getCurrentLocation, watchLocation, isEnabled,
    enableLocationRequest, clearWatch, distance } from 'nativescript-geolocation';
import { LocalNotifications } from 'nativescript-local-notifications';
import { RouterHelper } from '../helpers/router.helper';
import { GeofencingOrigin, GeofencingThreshold, GeofencingTimeout, GeofencingType, InvalidLocationReason } from '../enums';
import { DialogHelper } from './dialog.helper';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { Observable } from 'rxjs';
import { Accuracy } from 'tns-core-modules/ui/enums/enums';
import { BackgroundService } from '../services/background/background.service';
import { LocalStorageService } from '../storage/local-storage';
import { Store } from '@ngxs/store';
import { EmitterService } from '@ngxs-labs/emitter';
import { first } from 'rxjs/operators';
import { AppState } from '../states';
import { DateService } from '../services/date.service';


@Injectable({ providedIn: 'root' })
export class LocationHelper {

    public static watchId: number;
    public static locationWatcherId = undefined;
    public static locationWasTurnedOff = false;

    public currentSA$: Observable<SubmitActionRequest>;

    constructor(public router: RouterHelper, private dialogHelper: DialogHelper,
        private backgroundService: BackgroundService, private emitter: EmitterService, private store: Store) {
            this.currentSA$ = this.store.select(state => state.appData.currentSubmitActionRequest);
    }

    private startLocationServiceWatcher() {
        if (!isIOS) {
            LocationHelper.locationWatcherId = setInterval(() => {
                isEnabled().then(isLocationEnabled => {
                    if (!isLocationEnabled && !LocationHelper.locationWasTurnedOff) {
                        LocationHelper.locationWasTurnedOff = true;
                        LocalStorageService.addLocationInvaildForVisit(InvalidLocationReason.LocationServiceTurnedOff);
                    } else if (isLocationEnabled && LocationHelper.locationWasTurnedOff) {
                        LocationHelper.locationWasTurnedOff = false;
                        LocalStorageService.updateLocationInvaildForVisit(InvalidLocationReason.LocationServiceTurnedOff);
                    }
                });
            }, 300000); // Every 5 Minutes
        }
    }

    private endLocationServiceWatcher() {
        if (!isIOS) {
            if (LocationHelper.locationWatcherId) {
                clearInterval(LocationHelper.locationWatcherId);
                LocationHelper.locationWatcherId = undefined;
            }
        }
    }

    public enableWatchLocation(client: Client) {
        this.isLocationEnabled();
        this.disableWatchLocation();

        setTimeout(() => { // Using timeout to help get the correct watchId. If no timeout, its always ID 1, which becomes buggy.
            this.startLocationServiceWatcher();
            this.backgroundService.startBackgroundProcess();
            LocationHelper.watchId = watchLocation((loc) => {
                if (loc) {
                    console.log(`WatchLocation: Location has changed.`);
                    console.log('lat:', loc.latitude, 'lon:', loc.longitude);
                    console.log(`Target Coordinates Lat: ${client.Latitude} Lon: ${client.Longitude}`);

                    const geoEvent = this.createGeofencingEvent(client, loc);

                    this.currentSA$.pipe(first()).subscribe(currentSA => {
                        if (!currentSA.visit.GeofencingEvents) {
                            currentSA.visit.GeofencingEvents = [];
                        }
                        currentSA.visit.GeofencingEvents.push(geoEvent);
                        console.log('PUSHED: ',geoEvent)
                        this.emitter.action<SubmitActionRequest>(AppState.updateCurrentSubmitActionRequest).emit(currentSA);
                    });
                }
            }, function(e) {
                console.log('Error: ' + e.message);
            }, {
                desiredAccuracy: Accuracy.high,
                updateDistance: GeofencingThreshold,
                timeout: GeofencingTimeout,
                iosAllowsBackgroundLocationUpdates: true,
                iosPausesLocationUpdatesAutomatically: false
            });
        }, 1000);
    }

   public disableWatchLocation() {
        this.endLocationServiceWatcher();
        if (LocationHelper.watchId) {
            this.backgroundService.stopBackgroundProcess();
            console.log('Clearing Watch Location ID: ', LocationHelper.watchId);
            clearWatch(LocationHelper.watchId);
        }
    }

    checkLocation(client: Client): Promise<GeofencingEvent> {
        if (!client) { return; }
        this.isLocationEnabled();

        return new Promise((resolve, reject) => {
            LocalNotifications.cancelAll();

            getCurrentLocation({
                desiredAccuracy: Accuracy.high,
                timeout: GeofencingTimeout
            }).then(loc => {
                console.log('lat:', loc.latitude, 'lon:', loc.longitude);
                console.log(`Target Coordinates Lat: ${client.Latitude} Lon: ${client.Longitude}`);

                const response = this.createGeofencingEvent(client, loc);

                resolve(response);
            }).catch(e => {
                this.dialogHelper.alert('Please try again. If this happens again, please force close and re-open the app.',
                'Location Error');
                reject(e);
            });
        });
    }

    private createGeofencingEvent(client: Client, loc: Location): GeofencingEvent {
        const clientLocation: Location = {
            latitude: client.Latitude,
            longitude: client.Longitude,
            altitude: 0,
            direction: 0,
            horizontalAccuracy: 0,
            verticalAccuracy: 0,
            speed: 0,
            timestamp: new Date()
        };

        const distanceFromClientHouse = Math.round(distance(clientLocation, loc));
        console.log('Distance from Clients house:', distanceFromClientHouse);

        let type: GeofencingType;
        if (distanceFromClientHouse > GeofencingThreshold + loc.verticalAccuracy + loc.horizontalAccuracy) {
            type = GeofencingType.out;
        } else {
            type = GeofencingType.in;
        }

        const geofence: GeofencingEvent =  {
            EventDate: DateService.getString(new Date()),
            Latitude: loc.latitude,
            Longitude: loc.longitude,
            TargetLatitude: client.Latitude,
            TargetLongitude: client.Longitude,
            Distance: distanceFromClientHouse,
            EventType: GeofencingOrigin.Location,
            GeofencingType: type,
            Accuracy: loc.verticalAccuracy + loc.horizontalAccuracy,
            Threshold: GeofencingThreshold,
            CaregiverId: client.CaregiverId,
        };

        return geofence;
    }

    public enableLocation() {
        enableLocationRequest(true).then(() => { })
        .catch(error => {
            console.log(error);
        });
    }

    public isLocationEnabled() {
        isEnabled().then(isLocationEnabled => {
            if (!isLocationEnabled) {
                if (isIOS) {
                    this.dialogHelper.alert(`Please give AssuriCare permission to always use location services.
                    (Settings -> AssuriCare -> Location -> Always)`, 'Location Permissions', 'Ok').then(() => {
                    this.isLocationEnabled();
                 });
                } else {
                    this.dialogHelper.alert(`Please give AssuriCare permission to always use location services.`,
                    'Location Permissions', 'Ok').then(() => {
                    this.enableLocation();
                    this.isLocationEnabled();
                 });
                }
            }
        });
    }
}
