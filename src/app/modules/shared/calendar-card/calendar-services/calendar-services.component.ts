import { Component, OnInit, Input } from '@angular/core';
import { CalendarTask } from '../../../../../ACCommon/models/schedule.model';

@Component({
  selector: 'app-calendar-services',
  templateUrl: './calendar-services.component.html',
  styleUrls: ['./calendar-services.component.scss']
})
export class CalendarServicesComponent implements OnInit {

  @Input() tasks: CalendarTask[] = [];

  constructor() { }

  ngOnInit() {}
}
