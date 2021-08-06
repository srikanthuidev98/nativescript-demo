import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

import { Client, DualClient, Visit, getFirstLastNameFromVisit } from '../../../../ACCommon/models';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { RouterHelper, AnimationHelper, ModalHelper } from '../../../../ACCommon/helpers';
import { View } from 'tns-core-modules/ui/page/page';
import { ServicesModalComponent } from '../calendar-card/services-modal/services-modal.component';
import { first } from 'rxjs/operators';

/**
 * Send a visit - Needs client$ object also.
 */
@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  @Select(AppState.getReminderDate) reminderDate$: Observable<Date>;

  @Input() visit: Visit = undefined;

  @Input() client$: Observable<Client> = undefined; // Used for ScheduleServices only.
  @Input() dualClient: DualClient = undefined;

  @Input() showReminder = false;
  @Input() showChevron = false;
  @Input() showViewServices = false;

  /**
   * Used for slideIn animation for History.
   */
  @Input() slideInIndex: number = undefined;

  firstLastName: string;

  constructor(private routerHelper: RouterHelper, private animationHelper: AnimationHelper, private modalHelper: ModalHelper,
    private vcRef: ViewContainerRef) { }

  ngOnInit() {
    if (this.visit) {
      this.firstLastName = getFirstLastNameFromVisit(this.visit);
    }

    if (this.showViewServices && this.dualClient) {
      this.showViewServices = false;
    }

    if (this.showViewServices && this.client$) {
      this.client$.pipe(first()).subscribe(client => {
        if (!client.ScheduleServices) {
          this.showViewServices = false;
        }
      });
    }
  }

  reminderTap() {
    this.routerHelper.navigate(['/status/reminder']);
  }

  cardLoaded(view: View) {
    view.visibility = 'collapse';

    setTimeout(() => { // Need timeout because cardLoaded happens before @Input() variables are loaded.
      this.animationHelper.slideInto(view, this.slideInIndex);
    }, 10);
  }

  viewServicesTap() {
    this.client$.pipe(first()).subscribe(client => {
      this.modalHelper.openModal(ServicesModalComponent, this.vcRef, { client: client}).then(() => {});
    });
  }
}
