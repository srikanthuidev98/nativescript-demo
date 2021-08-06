import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { RouterHelper, RedirectHelper, ModalHelper, AnimationHelper } from '../../../../ACCommon/helpers';
import { ServicesModalComponent } from './services-modal/services-modal.component';
import { ScheduleVisit, isScheduleVisitCancelled, getScheduleVisitAddress,
  getCancelledReasonAsString, DialogData} from '../../../../ACCommon/models';
import { View } from 'tns-core-modules/ui/page/page';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { Client, DualClient } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { DateService } from '../../../../ACCommon/services/date.service';
import { PayRateType, VisitStatus } from '../../../../ACCommon/enums';

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss']
})
export class CalendarCardComponent implements OnInit {

  @Select(AppState.getClients) clients$: Observable<Client[]>;

  @Emitter(AppState.setCurrentClient)
  public setCurrentClient: Emittable<Client>;

  @Emitter(AppState.setCurrentDualClient)
  public setCurrentDualClient: Emittable<DualClient>;

  @Output() cancelledDetailTapped = new EventEmitter();

  @Input() visit: ScheduleVisit;

  /**
   * Used for slideIn animation for History.
   */
  @Input() slideInIndex: number = undefined;

  constructor(private routerHelper: RouterHelper, private modalHelper: ModalHelper, private vcRef: ViewContainerRef,
    private redirectHelper: RedirectHelper, private animationHelper: AnimationHelper) { }

  ngOnInit() {}

  cardLoaded(view: View) {
    view.visibility = 'collapse';

    setTimeout(() => { // Need timeout because cardLoaded happens before @Input() variables are loaded.
      this.animationHelper.slideInto(view, this.slideInIndex);
    }, 10);
  }

  addressTap() {
    if (!isScheduleVisitCancelled(this.visit)) {
      this.redirectHelper.openMap(getScheduleVisitAddress(this.visit));
    }
  }

  servicesTap() {
    this.modalHelper.openModal(ServicesModalComponent, this.vcRef, { visit: this.visit}).then(() => {});
  }

  detailsTap() {
    if (isScheduleVisitCancelled(this.visit)) {
      const dialogData: DialogData = {
        title: this.visit.name,
        subTitle: 'Cancellation',
        message: getCancelledReasonAsString(this.visit.status),
        subMessage: this.visit.cancelledReason,
        color: '#e00720'
      };

      this.cancelledDetailTapped.emit(dialogData);
    } else {
      this.routerHelper.navigate(['/scheduler/visit-details', { visit: JSON.stringify(this.visit)}]);
    }
  }

  checkinTap() {
    this.clients$.pipe(first()).subscribe(clients => {
      const client = clients.find(c => +c.CaregiverId === +this.visit.ltcCaregiverId);
      if (client) {
        this.setCurrentClient.emit(client);
        this.setCurrentDualClient.emit(undefined);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0);
        yesterday.setMinutes(0);
        if (this.visit.payRateType === PayRateType.Daily &&
            DateService.isAfter(new Date(), this.visit.checkInTime) &&
            DateService.isBefore(yesterday, this.visit.checkInTime)) {

          // Used if scheduled visit is a day rate for yesterday.
          console.log('Scheduled visit date is yesterday.');
          this.routerHelper.navigate(['/status/record-audio', { visit: JSON.stringify(this.visit)}]);
        } else {
          if (client.askCheckInQuestions) {
            this.routerHelper.navigate(['/status/additional-questions', { from: 'checkin'}]);
          } else {
            this.routerHelper.navigate(['/status/record-audio']);
          }
        }
      }
    });
  }

  isScheduleVisitCancelled(visit) {
    return isScheduleVisitCancelled(visit);
  }
  isScheduleVisitStarted(visit) {
    return visit.status === VisitStatus.Started;
  }

  isScheduleVisitCompletedOrCancelled(visit: ScheduleVisit) {
    if (visit.status === VisitStatus.Completed) {
      return true;
    }

    if (isScheduleVisitCancelled(visit)) {
      return true;
    }

    return false;
  }
  isScheduleVisitCompletedCancelledOrStarted(visit: ScheduleVisit) {
    if (visit.status === VisitStatus.Completed || visit.status === VisitStatus.Started) {
      return true;
    }

    if (isScheduleVisitCancelled(visit)) {
      return true;
    }

    return false;
  }
}
