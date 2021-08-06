import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { CalendarEvent } from 'nativescript-ui-calendar';
import { Color } from 'tns-core-modules/color/color';
import { AcCalendarComponent } from '../../shared/ac-calendar/ac-calendar.component';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { Observable, Subscription } from 'rxjs';
import { Schedule, ScheduleVisit, isScheduleVisitCancelled, DialogData } from '../../../../ACCommon/models';
import { Select } from '@ngxs/store';
import { DateService } from '../../../../ACCommon/services/date.service';
import { ListView } from 'tns-core-modules/ui/list-view/list-view';


@Component({
  selector: 'app-calendar',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.scss']
})
export class MyScheduleComponent implements OnInit, OnDestroy {

  @ViewChild('calendar', { static: true }) calendar: AcCalendarComponent;
  @ViewChild('listview', { static: true }) _listviewRef: ElementRef;

  @Select(AppState.getCalendarSchedule) calendarSchedule$: Observable<Schedule>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.getScheduleFromDb)
  public getScheduleFromDb: Emittable<{from: Date, to: Date}>;

  public events: CalendarEvent[] = [];
  public scheduledHours = 0;
  public shownData: ScheduleVisit[] = [];
  public dialogOpen = false;
  public dialogData: DialogData;

  private initialCalendarLoad = true;
  private scheduleSubscription: Subscription;
  private calendarSchedule: Schedule;
  private listview: ListView;

  constructor() { }

  ngOnInit () {

    this.getScheduleFromDb.emit(null).toPromise().then(()=>{
      const that = this;
      setTimeout(function(){
      that.listview = that._listviewRef.nativeElement;

      that.scheduleSubscription = that.calendarSchedule$.subscribe(calendarSchedule => {
      if (calendarSchedule) {
        that.calendarSchedule = calendarSchedule;
        // console.log('calendar schedule: ',that.calendarSchedule);
        that.events = that.getCalendarEvents();
        if (that.shownData.length === 0 && that.calendar.currentSelectedDate) {
          console.log('inside shownData',that.calendar.currentSelectedDate)
          that.onDateSelected(that.calendar.currentSelectedDate);
        }
      }
    });
      }, 3000);

    });




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
    const sunday = DateService.startOf(date, 'week');
    const saturday = DateService.endOf(date, 'week');

    if (this.initialCalendarLoad) {
      this.getScheduleFromDb.emit({from: this.calendar.startDate, to: this.calendar.endDate});
      this.initialCalendarLoad = false;
    }

    this.shownData = [];

    if (this.calendarSchedule && this.calendarSchedule.visits) {
      this.shownData = this.calendarSchedule.visits.filter(visit =>
        sunday.getTime() <= visit.checkInTime.getTime() && visit.checkInTime.getTime() <=  saturday.getTime());
    }

    let hours = 0;
    for (let i = 0; i < this.shownData.length; i++) {
      if (!isScheduleVisitCancelled(this.shownData[i])) {
        hours += this.shownData[i].totalHours;
      }
    }
    this.scheduledHours = hours;

    for (let i = 0; i < this.shownData.length; i++) {
      if (date.getDate() <= this.shownData[i].checkInTime.getDate()) {
        setTimeout(() => {
          this.listview.scrollToIndexAnimated(i);
        }, 100);
        break;
      }
    }
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
