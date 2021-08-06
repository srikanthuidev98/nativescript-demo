import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { CalendarEvent } from 'nativescript-ui-calendar';
import { Observable, Subscription } from 'rxjs';
import { Color } from 'tns-core-modules/color';
import { isIOS } from 'tns-core-modules/platform';
import { ListView } from 'tns-core-modules/ui/list-view';
import { Schedule, ScheduleVisit, DialogData, isScheduleVisitCancelled } from '../../../../ACCommon/models';
import { DateService } from '../../../../ACCommon/services/date.service';
import { AppState } from '../../../../ACCommon/states';
import { AcCalendarComponent } from '../../shared/ac-calendar/ac-calendar.component';

@Component({
  selector: 'ns-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.css']
})
export class AddShiftComponent implements OnInit, OnDestroy {

  @ViewChild('calendar', { static: true }) calendar: AcCalendarComponent;

  @Select(AppState.getCalendarSchedule) calendarSchedule$: Observable<Schedule>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.getScheduleFromDb)
  public getScheduleFromDb: Emittable<{from: Date, to: Date}>;

  public events: CalendarEvent[] = [];
  public scheduledHours = 0;
  public scheduledDates = [];
  public shownData: ScheduleVisit[] = [];
  public dialogOpen = false;
  public dialogData: DialogData;

  private initialCalendarLoad = true;
  private scheduleSubscription: Subscription;
  private calendarSchedule: Schedule;
  private listview: ListView;

  constructor() { }

  ngOnInit () {

    // this.getScheduleFromDb.emit(null).toPromise().then(()=>{
    //   const that = this;
    //   setTimeout(function(){
    //     that.scheduleSubscription = that.calendarSchedule$.subscribe(calendarSchedule => {
    //       if (calendarSchedule) {
    //         that.calendarSchedule = calendarSchedule;
    //         // console.log('calendar schedule: ',that.calendarSchedule);
    //         that.events = that.getCalendarEvents();
    //         if (that.shownData.length === 0 && that.calendar.currentSelectedDate) {
    //           console.log('inside shownData',that.calendar.currentSelectedDate)
    //           that.onDateSelected(that.calendar.currentSelectedDate);
    //         }
    //       }
    //     });
    //   }, 3000);

    // });




  }

  onItemLoading(args) {
    if (isIOS) {
      const iosCell = args.ios;
      iosCell.selectionStyle = UITableViewCellSelectionStyle.None;
    }
  }

  ngOnDestroy(): void {
    this.scheduleSubscription.unsubscribe();
  }

  onDateSelected(date: Date) {
    console.log(date);
  }

  onDateDeSelected(date: Date) {
    console.log(date);
  }

  onMonthChanged(args: { calendarStart: Date, calendarEnd: Date }) {
    this.getScheduleFromDb.emit({from: args.calendarStart, to: args.calendarEnd});
  }

  public onCalendarIconTapped() {
    this.calendar.todayTap();
  }

  private getCalendarEvents(): Array<CalendarEvent> {
    let startDate: Date,
        endDate: Date,
        event: CalendarEvent;
    const color = new Color('#593c81');
    const events: Array<CalendarEvent> = new Array<CalendarEvent>();
    if (this.calendarSchedule && this.calendarSchedule.visits) {
      for (let i = 0; i < this.calendarSchedule.visits.length; i++) {
        const visit = this.calendarSchedule.visits[i];
        startDate = visit.checkInTime;
        endDate = visit.checkInTime;
        event = new CalendarEvent('', startDate, endDate, false, color);

        let event2;
        if (startDate.getDate() !== endDate.getDate()) {
          event2 = new CalendarEvent('', event.startDate, event.endDate, false, color);
          event.endDate = new Date(event.startDate);
          event2.startDate = new Date(event2.endDate);
        }

        events.push(event);
        if (event2 !== undefined) {
          events.push(event2);
        }
      }
    }
    return events;
  }

  cancelledDetailTap(dialogData: DialogData) {
    this.dialogData = dialogData;
    this.dialogOpen = true;
  }

  closeDialog() {
    this.dialogOpen = false;
  }


}
