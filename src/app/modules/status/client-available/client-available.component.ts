import { Component, OnInit } from '@angular/core';
import { RouterHelper, DialogHelper } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { Client, DualClient, SubmitActionRequest } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
  selector: 'app-client-available',
  templateUrl: './client-available.component.html',
  styleUrls: ['./client-available.component.scss']
})
export class ClientAvailableComponent implements OnInit {

  @Select(AppState.getCurrentClient) client$: Observable<Client>;
  @Select(AppState.getCurrentDualClient) dualClient$: Observable<DualClient>;
  @Select(AppState.getCurrentSubmitActionRequest) currentSubmitAction$: Observable<SubmitActionRequest>;

  @Emitter(AppState.submitAction)
  public submitAction: Emittable<SubmitActionRequest>;

  title = '';

  public yesSelected = false;
  public noSelected = false;

  public dualClient: DualClient;
  public isDualClient = false;

  constructor(private routerHelper: RouterHelper, private dialogHelper: DialogHelper) { }

  ngOnInit() {
    this.client$.pipe(first()).subscribe(client => {
      this.dualClient$.pipe(first()).subscribe(dualClient => {
        if (dualClient) {
          this.isDualClient = true;
          this.title = `Are the Activities of Daily Living provided to ${dualClient.c1.Name} during this shift the ` +
          `same as were provided to ${dualClient.c2.Name}?`;
        } else {
          this.title = `Is your client ${client.Name} available to approve this shift?`;
        }
      });
    });
  }

  // This method is called everytime the layout is loaded. Used to reset the colors. Only need to reset the 'yes' colors.
  loaded() {
    this.yesSelected = false;
    this.noSelected = false;
  }

  yesTap() {
    this.yesSelected = true;
    setTimeout(() => {
      if (this.isDualClient) {
        this.currentSubmitAction$.pipe(first()).subscribe(currentSA => {
          setTimeout(() => { // Using setTimeout to fix issue on iOS. If no timeout, view doesn't get navigated to checkin.
            this.submitAction.emit(currentSA);
          }, 500);
        });
      } else {
        this.routerHelper.navigate(['/status/checkout-activities']);
      }
    }, 50);
  }

  noTap() {
    this.noSelected = true;
    if (this.isDualClient) {
      this.routerHelper.navigate(['/status/checkout-activities', { dualClientNum: '1'}]);
    } else {
      this.currentSubmitAction$.pipe(first()).subscribe(currentSA => {
        if (currentSA) {
          this.dialogHelper.alert('This shift has been saved and is awaiting approval.', 'Success!', 'Close');
          setTimeout(() => { // Using setTimeout to fix issue on iOS. If no timeout, view doesn't get navigated to checkin.
            this.submitAction.emit(currentSA);
          }, 500);
        } else {
          console.log('ERROR: No shift action to submit');
          this.dialogHelper.alert('Something went wrong...', 'Fail', 'Close');
        }
      });
    }
  }
}
