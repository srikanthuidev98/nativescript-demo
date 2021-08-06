import { Injectable } from '@angular/core';
import { LocalNotifications, ScheduleOptions } from 'nativescript-local-notifications';
import { Color } from 'tns-core-modules/color/color';
import { isIOS } from 'tns-core-modules/ui/page/page';

@Injectable({ providedIn: 'root' })
export class LocalNotificationHelper {

  /**
   * This is used for the iOS reminder notification interval.
   */
  private iosInterval: any;

  constructor() {
    // LocalNotifications.addOnMessageReceivedCallback(
    //   function (notification) {
    //     console.log('Local Notification ID that was tapped: ' + notification.id);
    //     // Add code here to determine which notification was tapped.
    //   }
    // ).then(
    //   function() {
    //     console.log('Local Notification Listener was added');
    //   }
    // );
  }

  private basicNotification(options: ScheduleOptions[]) {
      LocalNotifications.hasPermission().then(
          function(granted) {
            console.log('Permission granted? ' + granted);
            LocalNotifications.schedule(options).then(
                function(scheduledIds) {
                  console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds));
                },
                function(error) {
                  console.log('scheduling error: ' + error);
                }
            );
          }
      );
  }

  setTimerNotification(reminderDate: Date) {
      const options: ScheduleOptions[] = [{
          id: 10, // generated id if not set
          title: 'Checkout Reminder',
          body: 'Your checkout reminder is now!',
          color: new Color('#593c81'),
          badge: 1,
          ongoing: false, // makes the notification ongoing (Android only)
          at: reminderDate
      }];

      this.basicNotification(options);
  }

  showPushNotification(id: number, title: string, body: string) {
    const options: ScheduleOptions[] = [{
      id: id,
      title: title,
      body: 'Tap here to view details',
      color: new Color('#593c81'),
      badge: 1,
      ongoing: false,
      thumbnail: 'res://icon',
      channel: 'Assuricare', // default: 'Channel'
    }];

    this.basicNotification(options);
  }

  cancelNotification(id: number) {
      LocalNotifications.cancel(id).then(
          function(foundAndCanceled) {
              if (foundAndCanceled) {
                console.log(`OK, it's gone!`);
              } else {
                console.log(`No ID 5 was scheduled`);
              }
          }
      );
  }

  private setIosReminderNotification() {
    const options: ScheduleOptions[] = [{
      id: 403,
      title: 'AssuriCare needs to be running.',
      body: 'Please open the AssuriCare App, if you are still checked in and working.',
      color: new Color('#593c81'),
      badge: 1,
      forceShowWhenInForeground: true,
      at: new Date(new Date().getTime() + (60 * 1000)) // 60 seconds from now
    }];

    this.basicNotification(options);
  }

  /**
   * Used to show a notification for iOS if the user closes the app. Checks every mintue to see if the app is
   * still in foreground, if it is, cancels notification and creates a new one.
   */
  iosStartReminderNotification() {
    // Start loop to check if user still has app open. If not, the notification will go through.
    if (isIOS) {
      // if (this.iosInterval) {
      //   return;
      // }

      // const that = this;
      // this.iosInterval = setInterval(() => {
      //   LocalNotifications.cancel(403).then(
      //     function(foundAndCanceled) {
      //       if (foundAndCanceled) {
      //         console.log('iOS reminder notification was canceled. Creating new notification...');
      //         that.setIosReminderNotification();
      //       }
      //     }
      //   );
      // }, (59 * 1000)); // 59 Seconds. 1 second before notification is scheduled

      // // Start watch for the first time.
      // this.setIosReminderNotification();
    }
  }

  /**
   * Turns off the iOS reminder notification and clears the interval.
   */
  iosStopReminderNotification() {
    // if (isIOS) {
    //   if (this.iosInterval) {
    //     clearInterval(this.iosInterval);
    //   }

    //   LocalNotifications.cancel(403).then(
    //     function(foundAndCanceled) {
    //       if (foundAndCanceled) {
    //         console.log('iOS reminder notification was canceled.');
    //       }
    //     }
    //   );
    // }
  }
}
