import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/common';
import { CalendarTask } from '../../../../../ACCommon/models/schedule.model';

@Component({
  selector: 'ns-services-modal',
  templateUrl: './services-modal.component.html',
  styleUrls: ['./services-modal.component.scss']
})
export class ServicesModalComponent implements OnInit {
  name = '';
  tasks: CalendarTask[] = [];

  constructor(private mParams: ModalDialogParams) { }

  ngOnInit() {
    if (this.mParams.context) {
      if (this.mParams.context.visit) {
        this.name = this.mParams.context.visit.name;
        this.tasks = this.mParams.context.visit.tasks;
      } else if (this.mParams.context.client) {
        if (this.mParams.context.client.ScheduleServices) {
          this.name = this.mParams.context.client.Name;
          this.tasks = this.mParams.context.client.ScheduleServices;
        } else {
          console.log('Client has no ScheduleServices');
        }
      }
    } else {
      console.log('Please add the visit or client with  to the context.');
    }
  }

  closeModal() {
    this.mParams.closeCallback();
  }
}
