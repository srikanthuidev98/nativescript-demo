import { Component, OnInit } from '@angular/core';
import { LocalNotificationHelper, RouterHelper, DialogHelper } from '../../../../ACCommon/helpers';
import { DatePipe } from '@angular/common';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { device, isIOS } from 'tns-core-modules/platform';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  @Emitter(AppState.setReminderDate)
  public setReminderDate: Emittable<Date>;

  public selectedTab = 0;
  public error = '';

  // Specific Hour
  public day = 'Today';
  private selectedDate: Date;
  private currentDate: Date;

  // Hours from now
  public hour = '00';
  public minute = '00';

  constructor(private routerHelper: RouterHelper, private dialogHelper: DialogHelper,
              private localNotificationHelper: LocalNotificationHelper, private datePipe: DatePipe) { }

  ngOnInit() {
    this.selectedDate = new Date();

    this.currentDate = new Date();
  }

  // TODO REMOVE when theres a fix
  // Used to fix issue for iOS 14 until a fix comes out.
  pickerLoaded(args) {
    if (isIOS && device.osVersion >= `14.0`) {
      args.object.ios.preferredDatePickerStyle = 1;
    }
  }

  tabTap(tabNumber: number) {
    this.selectedTab = tabNumber;
  }

  onTimeChanged(args: any) {
    this.selectedDate.setHours(args.object.hour);
    this.selectedDate.setMinutes(args.object.minute);
  }

  changeDay() {
    if (this.day === 'Today') {
      this.day = 'Tomorrow';
    } else {
      this.day = 'Today';
    }
  }

  setReminderTap(tab: number) {
    let reminderDate = new Date();

    if (tab === 0) {
      reminderDate = this.selectedDate;
      if (this.day === 'Tomorrow') {
        reminderDate.setHours(reminderDate.getHours() + 24);
      }

      if (reminderDate > this.currentDate) {
        this.error = '';
      } else {
        this.error = 'Please select a time in the future';
        return;
      }
    } else {
      if (this.hour === '00' && this.minute === '00') {
        this.error = 'Please select a time in the future';
        return;
      } else {
        this.error = '';
        reminderDate.setHours(reminderDate.getHours() + +this.hour);
        reminderDate.setMinutes(reminderDate.getMinutes() + +this.minute);
      }
    }

    this.localNotificationHelper.setTimerNotification(reminderDate);
    console.log('Reminder set!', this.datePipe.transform(reminderDate, 'EE, M/dd hh:mm aaa' ));
    this.setReminderDate.emit(reminderDate);
    this.dialogHelper.alert('Checkout reminder time is: ' + this.datePipe.transform(reminderDate, 'EE, M/dd hh:mm aaa' ),
      'Checkout reminder set!').then(() => {
        this.routerHelper.backToPreviousPage();
      });
  }

  clickerTap(type: string, timeType: string) {
    if (type === '+' && (this.hour === '26' || (this.hour === '25' && +this.minute > 0 && timeType === 'hour'))) {
      return;
    }
    if (type === '-' && ((this.hour === '00' && timeType === 'hour') || (this.minute === '00' && timeType === 'minute'))) {
      return;
    }

    if (type === '+') { // Increment time
      if (timeType === 'hour') {
        this.hour = this.makeDigitValid(`${+this.hour + 1}`, timeType);
      } else {
        this.minute = this.makeDigitValid(`${+this.minute + 10}`, timeType);
      }
    } else {  // Decrement time
      if (timeType === 'hour') {
        this.hour = this.makeDigitValid(`${+this.hour - 1}`, timeType);
      } else {
        this.minute = this.makeDigitValid(`${+this.minute - 10}`, timeType);
      }
    }
  }

  private makeDigitValid(time: string, timeType: string) {
    if (time.length === 1) {
        return `0${time}`;
    }
    if (timeType === 'minute') {
      if (this.minute === '50') {
        return '00';
      }
    }
    return time;
  }
}
