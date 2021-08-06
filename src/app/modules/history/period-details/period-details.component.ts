import { Component, OnInit } from '@angular/core';
import { RouterHelper } from '../../../../ACCommon/helpers/router.helper';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { Client, Payroll, Visit } from '../../../../ACCommon/models';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { first, take } from 'rxjs/operators';
import { ConnectivityHelper } from '../../../../ACCommon/helpers/connectivity.helper';

@Component({
  selector: 'app-period-details',
  templateUrl: './period-details.component.html',
  styleUrls: ['./period-details.component.scss']
})
export class PeriodDetailsComponent implements OnInit {

  @Select(AppState.getHistoryClient) client$: Observable<Client>;
  @Select(AppState.getSelectedPayroll) payroll$: Observable<Payroll>;
  @Select(AppState.getVisits) visits$: Observable<Visit[]>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.pullVisitsData)
  public pullVisitsData: Emittable<number>;

  @Emitter(AppState.setSelectedVisit)
  public setSelectedVisit: Emittable<Visit>;

  public filter = 0;
  public payRateSelected = '';
  public hasShift = true;

  constructor(private routerHelper: RouterHelper, public connection: ConnectivityHelper) { }

  ngOnInit() {
    this.payroll$.pipe(first()).subscribe(payroll => {
      if (payroll) {
        this.pullVisitsData.emit(payroll.PayrollId);
      }
    });
   }

  shiftTap(index: number) {
    this.visits$.pipe(first()).subscribe(visits => {
      this.setSelectedVisit.emit(visits[index]);
      this.routerHelper.navigate(['history/shift-details']);
    });
  }

  refreshList(args) {
    const pullRefresh = args.object;

    this.payroll$.pipe(first()).subscribe(payroll => {
      if (payroll) {
        this.pullVisitsData.emit(payroll.PayrollId);
      }

      this.loading$.pipe(take(2)).subscribe(loading => {
        if (!loading) {
          setTimeout(function () {
            pullRefresh.refreshing = false;
          }, 500);
        }
      });
    });
  }

  filterChanged(filter: { caregiverId: number, payRateComment: string }) {
    this.filter = filter.caregiverId;
    this.visits$.pipe(first()).subscribe(visits => {
      const shift = visits.find(v => +v.CaregiverId === +filter.caregiverId);
      if (shift || filter.caregiverId === 0) {
        this.hasShift = true;
      } else {
        this.hasShift = false;
        this.payRateSelected = filter.payRateComment;
      }
    });
  }
}
