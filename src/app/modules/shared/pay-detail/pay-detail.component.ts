import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Visit, Client } from '../../../../ACCommon/models';
import { Observable, Subscription } from 'rxjs';
import { PayRateType } from '../../../../ACCommon/enums';
import { AnimationHelper } from '../../../../ACCommon/helpers';

@Component({
  selector: 'app-pay-detail',
  templateUrl: './pay-detail.component.html',
  styleUrls: ['./pay-detail.component.scss']
})
export class PayDetailComponent implements OnInit, OnDestroy {

  @Input() client: Client = undefined;

  // Used in Period Details. Need: client, visits$, payroll
  @Input() visits$: Observable<Visit[]> = undefined;

  // Used in Shift Details. Need: client, visit$
  @Input() visit$: Observable<Visit> = undefined;

  /**
   * Used for slideIn animation for History.
   */
  @Input() slideInIndex: number = undefined;

  milageInDollars = 0;
  dollars = 0;
  cents = '00';
  totalHours = 0;

  visitSubscription: Subscription;
  visitsSubscription: Subscription;

  public payRateType = PayRateType;

  constructor(private animationHelper: AnimationHelper) { }

  ngOnInit() {
    // For testing..
    // this.client.RegistryProvider = false;

    if (this.visits$) { // Period Details
      this.visitsSubscription = this.visits$.subscribe(visits => {
        this.milageInDollars = 0;
        this.dollars = 0;
        this.cents = '00';
        this.totalHours = 0;

        if (!visits) {
          return;
        }

        let grossAmountforPayroll = 0;

        for (let i = 0; i < visits.length; i++) {
          this.totalHours += +visits[i].PaidHours;
          this.milageInDollars += +visits[i].MileageAmount;
          grossAmountforPayroll += visits[i].PayAmount;

          if (i === visits.length - 1) {
            const total = (grossAmountforPayroll + +this.milageInDollars).toFixed(2);

            const payStrings = total.split('.');
            this.dollars = +payStrings[0];
            this.cents = payStrings[1];
          }
        }
      });
    }

    if (this.visit$) { // Shift Details
      this.visitSubscription = this.visit$.subscribe(visit => {
        const total = (visit.PayAmount + visit.MileageAmount).toFixed(2);

        const payStrings = total.split('.');
        this.dollars = +payStrings[0];
        this.cents = payStrings[1];
      });
    }
   }

   ngOnDestroy(): void {
    if (this.visitSubscription) {
      this.visitSubscription.unsubscribe();
    }

    if (this.visitsSubscription) {
      this.visitsSubscription.unsubscribe();
    }
  }

   cardLoaded(view) {
    view.visibility = 'collapse';

    setTimeout(() => { // Need timeout because cardLoaded happens before @Input() variables are loaded.
      this.animationHelper.slideInto(view, this.slideInIndex);
    }, 10);
  }
}
