import { Component, OnInit } from '@angular/core';
import { RouterHelper } from '../../../../ACCommon/helpers/router.helper';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states/app.state';
import { Observable } from 'rxjs';
import { Client, ClientPayroll, Payroll } from '../../../../ACCommon/models';
import { first, take } from 'rxjs/operators';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { LoadingHelper } from '../../../../ACCommon/helpers';
import { DateService } from '../../../../ACCommon/services/date.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {

  @Select(AppState.getHistoryClient) client$: Observable<Client>;
  @Select(AppState.getClientPayrolls) clientPayrolls$: Observable<ClientPayroll[]>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.setSelectedPayroll)
  public setSelectedPayroll: Emittable<Payroll>;

  @Emitter(AppState.pullPayrollData)
  public pullPayrollData: Emittable<null>;

  constructor(private routerHelper: RouterHelper, private loadingHelper: LoadingHelper) { }

  public payrolls: (Payroll | number)[] = [];

  ngOnInit() {
    this.uiSetUp();

    setTimeout(() => { // Has timeout, because won't show otherwise.
      this.loadingHelper.hideIndicator();
    }, 300);
  }

  uiSetUp(refreshPull?: any) {
    this.client$.pipe(first()).subscribe(client => {
      this.clientPayrolls$.pipe(take(2)).subscribe(clientPayrolls => {
        if (clientPayrolls) {
          const cPayroll = clientPayrolls.find(p => client.Id === p.customerId).payrolls;

          let currentYear: number;
          this.payrolls = [];

          for (let i = 0; i < cPayroll.length; i++) {
            const date = DateService.getDate(cPayroll[i].PeriodStartDate);
            if (!currentYear || currentYear !== date.getFullYear()) {
              currentYear = date.getFullYear();
              this.payrolls.push(currentYear);
            }

            this.payrolls.push(cPayroll[i]);
          }

          if (refreshPull) {
            refreshPull.refreshing = false;
          }
        }
      });
    });
  }

  refreshList(args) {
    const refreshPull = args.object;

    this.pullPayrollData.emit(null); // Payroll and CurrentPayroll

    this.loading$.pipe(take(2)).subscribe(loading => {
      if (!loading) {
        setTimeout(() => {
          this.uiSetUp(refreshPull);
        }, 500);
      }
    });
  }

  historyTap(args) {
    if (typeof this.payrolls[args.index] === 'number') {
      return;
    }

    const payroll = this.payrolls[args.index] as Payroll;

    this.loadingHelper.showIndicator();
    this.setSelectedPayroll.emit(payroll);
    this.routerHelper.navigate(['history/period-details']);
  }

  templateSelector(item: any, index: number, items: any) {
    if (typeof item === 'number') {
      return 'year';
    }

    return 'payroll';
  }
}
