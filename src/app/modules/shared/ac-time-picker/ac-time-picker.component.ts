import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DateService } from '../../../../ACCommon/services/date.service';
import { device, isIOS } from 'tns-core-modules/platform';

@Component({
  selector: 'ac-time-picker',
  templateUrl: './ac-time-picker.component.html',
  styleUrls: ['./ac-time-picker.component.scss']
})
export class AcTimePickerComponent implements OnInit {

  private _date: Date;

  @Input() set date(value: Date) {
    this._date = value;

    if (this.minDate) {
      this.setDateArrows();
    }
  }
  get date(): Date {
    return this._date;
  }

  @Input() minDate: Date;
  @Input() maxDate: Date;

  @Output() dayChanged = new EventEmitter();
  @Output() timeChanged = new EventEmitter();

  public updateDate = false;
  public noLeft = false;
  public noRight = false;
  public today: Date;

  constructor() { }

  ngOnInit() {
    // Resetting the min and max dates so the real values don't get changed.
    this.minDate = DateService.getDate(DateService.getString(this.minDate));
    this.maxDate = DateService.getDate(DateService.getString(this.maxDate));
    this.today = new Date();

    // Setting the times so the user can freely change dates without worrying about the time.
    this.minDate.setHours(0);
    this.minDate.setMinutes(0);
    this.maxDate.setHours(23);
    this.maxDate.setMinutes(59);
    this.today.setHours(23);
    this.today.setMinutes(59);

    this.setDateArrows();
  }

  // TODO REMOVE when theres a fix
  // Used to fix issue for iOS 14 until a fix comes out.
  pickerLoaded(args) {
    if (isIOS && device.osVersion >= `14.0`) {
      args.object.ios.preferredDatePickerStyle = 1;
    }
  }

  setDateArrows() {
    if (this._date.getDate() === this.minDate.getDate()) {
      this.noLeft = true;
    }

    if (this._date.getDate() === this.maxDate.getDate()) {
      this.noRight = true;
    }
  }

  changeDate(num: number) {
    if ((this.noLeft && num === -1) || (this.noRight && num === 1)) {
      return;
    }

    if (this.isDateInbetween(num, this.today)) {
      this._date.setDate(this._date.getDate() + num);
      this.updateDate = !this.updateDate; // Updates the UI with the updated date.
      this.dayChanged.emit(this._date.getDate());
    }
  }

  isDateInbetween(num: number, today: Date) {
    const newDate = DateService.getDate(DateService.getString(this._date));
    newDate.setDate(newDate.getDate() + num);

    this.noLeft = false;
    this.noRight = false;

    if (newDate.getDate() === this.minDate.getDate()) {
      this.noLeft = true;
    }
    if (newDate.getDate() === this.maxDate.getDate() || newDate.getDate() === today.getDate()) {
      this.noRight = true;
    }

    if (DateService.isAfter(newDate, this.minDate) && DateService.isBefore(newDate, today)
    && DateService.isBefore(newDate, this.maxDate)) {
      return true;
    } else {
      return false;
    }
  }

  onTimeChanged(args) {
    if (this._date) {
      this._date.setHours(args.value.getHours());
      this._date.setMinutes(args.value.getMinutes());

      this.timeChanged.emit({ h: args.value.getHours(), m: args.value.getMinutes()});
    }
  }
}
