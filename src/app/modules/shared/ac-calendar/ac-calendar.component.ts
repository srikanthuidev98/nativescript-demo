import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { RadCalendarComponent } from 'nativescript-ui-calendar/angular/calendar-directives';
import { CalendarViewMode, CalendarWeekViewStyle, CalendarMonthViewStyle,
  CellStyle, CalendarFontStyle, CalendarCellAlignment, DayCellStyle, CalendarSelectionShape,
  CalendarSelectionEventData, CalendarEvent, CalendarSelectionMode } from 'nativescript-ui-calendar';
import { Color } from 'tns-core-modules/color/color';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';
import { DateService } from '../../../../ACCommon/services/date.service';

@Component({
  selector: 'ac-calendar',
  templateUrl: './ac-calendar.component.html',
  styleUrls: ['./ac-calendar.component.scss']
})
export class AcCalendarComponent implements OnInit {

  @ViewChild('myCalendar', { static: true }) _calendar: RadCalendarComponent;

  @Input() events: CalendarEvent[] = [];
  @Input() selectionMode: 'Range' | 'Single' = 'Single';

  @Output() dateSelected = new EventEmitter();
  @Output() monthChanged = new EventEmitter();

  private months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  private iosCalendarMonthHeight = 400;
  private iosCalendarWeekHeight = 80;
  private androidCalendarHeight = 0; // Android will calculate Month and Week height

  private whiteColor = new Color('#ffffff');
  private primaryColor = new Color('#593c81');
  private daytextSize = 16;
  private selectedEvents: CalendarEvent[] = [];
  private currentMonth: number;

  public calendarheight = this.androidCalendarHeight;
  public type: 'Month' | 'Week' = 'Week';
  public title = '';

  /**
   * The first viewable day on the calendar that the user can see
   */
  public startDate: Date;

  /**
   * The last viewable day on the calendar that the user can see
   */
  public endDate: Date;

  public currentSelectedDate: Date;

  ngOnInit() {
    this.iosCalendarMonthHeight = screen.mainScreen.heightDIPs * .8;
    this.calendarheight = screen.mainScreen.heightDIPs * .7;
    if (isIOS) {
      this.calendarheight = this.iosCalendarWeekHeight;
    }

    this._calendar.nativeElement.viewMode = CalendarViewMode.Week;
    this._calendar.nativeElement.weekViewStyle = this.getViewStyle(new CalendarWeekViewStyle());
    this._calendar.nativeElement.monthViewStyle = this.getViewStyle(new CalendarMonthViewStyle());
  }

  calendarLoaded(event) {
    const date = this._calendar.nativeElement.displayedDate;
    this.title = `${this.months[date.getMonth()]} ${date.getFullYear()}`;
    const now = new Date();
    this.getCalendarStartAndEndDates(now);
    this.currentMonth = now.getMonth();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    this._calendar.nativeElement.selectedDate = now;
    // this._calendar.nativeElement.android.getEventAdapter().getRenderer()
    // .setEventRenderMode(com.telerik.widget.calendar.events.EventRenderMode.Text);
    this._calendar.nativeElement.selectionMode = CalendarSelectionMode[this.selectionMode];

    if (!isIOS && event.object.nativeView.getEventAdapter()) {
      event.object.nativeView.getEventAdapter().getRenderer().setEventTextSize(2 * layout.getDisplayDensity());
    }
  }

  eventSource() {
    if (this.type === 'Month') {
      return this.events;
    }

    return [];
  }

  todayTap() {
    this._calendar.nativeElement.goToDate(new Date());
    this._calendar.nativeElement.selectedDate = new Date();
  }

  /**
   * Used to change the month name, and the Start and End Dates
   */
  dateChanged(args: any) {
    if (this.currentMonth !== args.date.getMonth()) {
      this.title = `${this.months[args.date.getMonth()]} ${args.date.getFullYear()}`;
      this.currentMonth = args.date.getMonth();
      this.getCalendarStartAndEndDates(args.date);
      this.monthChanged.emit({ calendarStart: this.startDate, calendarEnd: this.endDate });
    }
  }

  /**
   * This is the method thats used when a new date is selected.
   */
  onDateSelected(args: CalendarSelectionEventData) {
    this.currentSelectedDate = args.date;

    this.selectedEvents.forEach(e => {
      e.eventColor = this.primaryColor;
    });

    this.selectedEvents = [];

    this.selectedEvents = this.events.filter(a => args.date.getDate() === a.startDate.getDate()
    || a.endDate.getDate() === args.date.getDate());

    this.selectedEvents.forEach(e => {
      e.eventColor = this.whiteColor;
    });

    this.dateSelected.emit(args.date);

    if (this.type === 'Month') {
      this.type = 'Week';
      if (isIOS) {
        this.calendarheight = this.iosCalendarWeekHeight;
      }
      this._calendar.nativeElement.goToDate(this._calendar.nativeElement.selectedDate);
      this._calendar.nativeElement.viewMode = CalendarViewMode.Week;
    }
  }

  titleTap() {
    if (this.type === 'Week') {
      if (isIOS) {
        this.calendarheight = this.iosCalendarMonthHeight;
      }
      this._calendar.nativeElement.viewMode = CalendarViewMode.Month;
      this.type = 'Month';
    } else {
      if (isIOS) {
        this.calendarheight = this.iosCalendarWeekHeight;
      }
      this._calendar.nativeElement.goToDate(this._calendar.nativeElement.selectedDate);
      this._calendar.nativeElement.viewMode = CalendarViewMode.Week;
      this.type = 'Week';
    }
  }

  arrowTap(type: 'back' | 'forward') {
    if (this.type === 'Week') {
      const change = type === 'back' ? -7 : 7; // If back, Change = -7, else 7

      const displayedDate = this._calendar.nativeElement.displayedDate;
      displayedDate.setDate(displayedDate.getDate() + change);

      const newDate = DateService.startOf(displayedDate, 'week');

      this._calendar.nativeElement.goToDate(newDate);
      this._calendar.nativeElement.selectedDate = newDate;
    } else {
      // If Month view
      if (type === 'back') {
        this._calendar.nativeElement.navigateBack();
      } else {
        this._calendar.nativeElement.navigateForward();
      }
    }
  }

  private getViewStyle(style: CalendarWeekViewStyle | CalendarMonthViewStyle): CalendarWeekViewStyle | CalendarMonthViewStyle {
    const dayNameCellStyle = new DayCellStyle();
    const todayCellStyle = new DayCellStyle();
    const selectedCellStyle = new DayCellStyle();
    const weekdayCellStyle = new DayCellStyle();
    const weekendCellStyle = new DayCellStyle();

    style.showTitle = false;

    style.selectionShape = CalendarSelectionShape.None;

    // Affects All DAYNAME cells (Mon, Tue, Wed, etc)
    dayNameCellStyle.cellBackgroundColor = this.whiteColor;
    dayNameCellStyle.cellAlignment = CalendarCellAlignment.Center;
    dayNameCellStyle.cellTextColor = this.primaryColor;
    dayNameCellStyle.cellTextSize = 14;

    // Affects TODAY cell only.
    todayCellStyle.cellBackgroundColor = this.whiteColor;
    todayCellStyle.cellTextColor = this.primaryColor;
    todayCellStyle.cellTextFontStyle = CalendarFontStyle.Bold;
    todayCellStyle.cellTextSize = 18;
    todayCellStyle.cellBorderWidth = 0;
    todayCellStyle.cellBorderColor = this.whiteColor;

    // Affects SELECTED cell only.
    selectedCellStyle.cellBackgroundColor = this.primaryColor;
    selectedCellStyle.cellTextColor = this.whiteColor;
    selectedCellStyle.cellTextSize = 18;

    // Affects All WEEKDAY cells except Today and selected.
    weekdayCellStyle.cellBackgroundColor = this.whiteColor;
    weekdayCellStyle.cellBorderColor = this.whiteColor;
    weekdayCellStyle.cellTextColor = this.primaryColor;
    weekdayCellStyle.cellTextSize = this.daytextSize;

    // Affects All WEEKEND cells except Today and selected.
    weekendCellStyle.cellTextColor = this.primaryColor;
    weekendCellStyle.cellTextSize = this.daytextSize;

    if (style instanceof CalendarWeekViewStyle) {
      weekdayCellStyle.cellAlignment = CalendarCellAlignment.Center;
      weekendCellStyle.cellAlignment = CalendarCellAlignment.Center;
    } else {
      if (isIOS) {
        weekdayCellStyle.cellAlignment = CalendarCellAlignment.Center;
        weekendCellStyle.cellAlignment = CalendarCellAlignment.Center;
      } else {
        weekdayCellStyle.cellAlignment = CalendarCellAlignment.Top;
        weekendCellStyle.cellAlignment = CalendarCellAlignment.Top;
      }
    }

    style.dayNameCellStyle = dayNameCellStyle;
    style.todayCellStyle = todayCellStyle;
    style.selectedDayCellStyle = selectedCellStyle;
    style.dayCellStyle = weekdayCellStyle;
    style.weekendCellStyle = weekendCellStyle;

    return style;
  }

  /**
   * Setting the calendar's Start date and End date of what the user can see.
   */
  getCalendarStartAndEndDates(date: Date) {
    const startOfMonth = DateService.startOf(date, 'month');
    const startOfCalendar = DateService.startOf(startOfMonth, 'week');
    const endOfCalendar = new Date(startOfCalendar);
    endOfCalendar.setDate(endOfCalendar.getDate() + 41); // Number of days that are viewable in the Calendar

    this.startDate = startOfCalendar;
    this.endDate = endOfCalendar;
  }
}
