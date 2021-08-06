import { RestartReceiver_CLASSNAME } from './restart-receiver.android';
import * as app from 'tns-core-modules/application';
import { LocalStorageService } from '../../../storage/local-storage';
import { ImageSource } from 'tns-core-modules/image-source';
import { LocationHelper } from '../../../../ACCommon/helpers';
import { getCurrentLocation } from 'nativescript-geolocation';
import { LocalNotifications } from 'nativescript-local-notifications';
import { Color } from 'tns-core-modules/color/color';
import { BackgroundService } from '../background.service';
import { GeofencingTimeout, InvalidLocationReason } from '../../../../ACCommon/enums';
import { Accuracy } from 'tns-core-modules/ui/enums';
declare const com: any;


export const ContinuousService_CLASSNAME = 'com.assuricare.ContinuousService';


@JavaProxy('com.assuricare.ContinuousService')
export class ContinuousService extends android.app.Service {

    public static watchId;
    public static timeoutId;

    onBind(): android.os.IBinder {
        return null;
    }

    onCreate(): void {
        super.onCreate();
        console.log('SERVICE CREATED');

        const icon = android.graphics.drawable.Icon.createWithBitmap(ImageSource.fromResourceSync('icon').android);
        const appState = LocalStorageService.getAppState();
        let hours = 0;
        let mins = `00`;
        let time = 'AM';

        if (appState && appState.currentVisit && appState.currentVisit.CheckInTime) {
            const startingTime = new Date(appState.currentVisit.CheckInTime);
            hours = startingTime.getHours();
            mins = `${startingTime.getMinutes()}`;

            if (hours === 12) {
                time = 'PM';
            } else if (hours === 0) {
                hours = 12;
            } else if (hours > 12) {
                time = 'PM';
                hours = hours - 12;
            }

            if (mins.length === 1) {
                mins = `0${mins}`;
            }
        }

        const appIntent: android.content.Intent = new android.content.Intent(app.android.context, com.tns.NativeScriptActivity.class);
        const pendingIntent: android.app.PendingIntent = android.app.PendingIntent.getActivity(app.android.context, 0, appIntent, 0);
        const builder: android.app.Notification.Builder = new android.app.Notification.Builder(app.android.context);
        builder
            .setContentTitle(`Check in time ${hours}:${mins} ${time}`)
            .setContentText('Tap here to view details')
            .setSmallIcon(icon)
            .setContentIntent(pendingIntent);
        // Need to check api level, NotificationChannel is required but only available on Oreo and above
        if (android.os.Build.VERSION.SDK_INT >= 26) {
            const channel: android.app.NotificationChannel = new android.app.NotificationChannel(
                'persistence', 'Service running indicator', android.app.NotificationManager.IMPORTANCE_LOW
            );
            const manager: android.app.NotificationManager =
                (<android.app.Activity>app.android.context).getSystemService(android.content.Context.NOTIFICATION_SERVICE);
            channel.enableLights(false);
            channel.enableVibration(false);
            manager.createNotificationChannel(channel);
            builder.setChannelId('persistence');
            builder.setColor(0xff593c81);
        }
        const notification: android.app.Notification = builder.build();
        this.startForeground(13, notification);
    }

    onStartCommand(intent: android.content.Intent, flags: number, startId: number): number {
        console.log('SERVICE STARTED');
        // Re-populate the WatchId to location helper.
        if (ContinuousService.watchId) {
            LocationHelper.watchId = ContinuousService.watchId;
        }

        if (ContinuousService.timeoutId) {
            clearTimeout(ContinuousService.timeoutId);
            ContinuousService.timeoutId = undefined;
        }

        ContinuousService.timeoutId = setTimeout(() => {
            // Using this to verify that user has background loction enabled on Android.
            getCurrentLocation({
                desiredAccuracy: Accuracy.any,
                timeout: GeofencingTimeout
            }).then(loc => {
                console.log('Has background location enabled!');
                BackgroundService.showLocationAlert = false;
            }).catch(e => {
                console.log('Background location is not enabled...');
                LocalNotifications.hasPermission().then(
                    function(granted) {
                        console.log('Permission granted? ' + granted);
                        LocalStorageService.addLocationInvaildForVisit(InvalidLocationReason.AlwaysLocationOff);
                        LocalNotifications.schedule([{
                            id: 403,
                            title: 'Location required.',
                            body: 'AssuriCare needs to have Always location permission.',
                            color: new Color('#593c81'),
                            badge: 1
                        }]).then(
                            function(scheduledIds) {
                                console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds));
                                BackgroundService.showLocationAlert = true;
                            },
                            function(error) {
                                console.log('scheduling error: ' + error);
                            }
                        );
                    }
                );
            });
        }, 30000); // 30 Seconds because anything less will still hit location as if it was in foreground.

        // If need to do something extra, Add code here for the foreground service.

        return android.app.Service.START_REDELIVER_INTENT;
    }

    onDestroy(): void {
        console.log('SERVICE DESTROYED');
        // Adding the WatchID to this class so it doesn't get deleted from GC.
        if (LocationHelper.watchId) {
            ContinuousService.watchId = LocationHelper.watchId;
        }
        super.onDestroy();
        // Add code here to remove anything that was done in the onStartCommand function.

        const restartIntent = new android.content.Intent();
        restartIntent.setClassName(this, RestartReceiver_CLASSNAME);
        this.sendBroadcast(restartIntent);
    }

    onTaskRemoved(intent: android.content.Intent): void {
        console.log('TASK REMOVED');
        this.stopSelf();
    }
}
