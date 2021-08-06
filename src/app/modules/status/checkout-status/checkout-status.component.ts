import { Component, OnInit } from '@angular/core';
import { RouterHelper, LocationHelper } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states/app.state';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Client, DualClient, Visit } from '../../../../ACCommon/models';
import { LoadingHelper } from '../../../../ACCommon/helpers';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
  selector: 'app-checkout-status',
  templateUrl: './checkout-status.component.html',
  styleUrls: ['./checkout-status.component.scss']
})
export class CheckoutStatusComponent implements OnInit {

  @Select(AppState.getCurrentVisit) visit$: Observable<Visit>;
  @Select(AppState.getCurrentClient) client$: Observable<Client>;
  @Select(AppState.getCurrentDualClient) dualClient$: Observable<DualClient>;

  @Emitter(AppState.setCurrentClient)
  public setCurrentClient: Emittable<Client>;

  @Emitter(AppState.sendAllNeedsToSyncShifts)
  private syncOfflineShifts: Emittable<null>;

  @Emitter(AppState.sendAllNeedsToSyncAdditionalQuestions)
  private syncAdditionalQuestions: Emittable<null>;

  constructor(private locationHelper: LocationHelper, private routerHelper: RouterHelper,
              private loadingIndicator: LoadingHelper) {}

  ngOnInit() {
    this.syncOfflineShifts.emit(null); // Tries to sync shifts if they haven't been sent yet.
    this.syncAdditionalQuestions.emit(null);
    this.client$.pipe(first()).subscribe(client => {
      this.dualClient$.pipe(first()).subscribe(dualClient => {
        if (dualClient) {
          client = dualClient.c1;
        }
        this.visit$.pipe(first()).subscribe(currentVisit => {
          if (!currentVisit) {
            console.log('currentVisit doesnt exsist. Going to Check In status');
            // Shift is undefined, so the user is not checked in. Go to Check In Status
            this.routerHelper.navigate(['status/checkin', { clearHistory: true, transition: { name: 'fade' }}]);
          }

          this.locationHelper.enableWatchLocation(client);
          this.loadingIndicator.hideIndicator();
        });
      });
    });
  }

  checkoutTap() {
    this.routerHelper.navigate(['/status/record-audio']);
  }

  reminderTap() {
    this.routerHelper.navigate(['/status/reminder']);
  }
}
