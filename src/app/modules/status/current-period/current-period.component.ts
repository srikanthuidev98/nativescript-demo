import { Component, OnInit } from '@angular/core';
import { RouterHelper } from '../../../../ACCommon/helpers/router.helper';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { Select } from '@ngxs/store';
import { Client, Visit, Payroll, ClientPayroll } from '../../../../ACCommon/models';
import { Observable, Subject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';
import { LoadingHelper } from '../../../../ACCommon/helpers';
import { ConnectivityHelper } from '../../../../ACCommon/helpers/connectivity.helper';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'app-current-period',
  templateUrl: './current-period.component.html',
  styleUrls: ['./current-period.component.scss']
})
export class CurrentPeriodComponent implements OnInit {
  public static needToUpdateHistory = false;

  @Select(AppState.getHistoryClient) client$: Observable<Client>;
  @Select(AppState.getVisits) visits$: Observable<Visit[]>;
  @Select(AppState.getCurrentClientPayrolls) currentClientPayrolls$: Observable<ClientPayroll[]>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.pullVisitsData)
  public pullVisitsData: Emittable<number>;

  @Emitter(AppState.setSelectedPayroll)
  public setSelectedPayroll: Emittable<Payroll>;

  @Emitter(AppState.setSelectedVisit)
  public setSelectedVisit: Emittable<Visit>;

  public payroll: Payroll;
  public filter = 0;
  public payRateSelected = '';
  public hasShift = true;
  public noShiftsMessage = '';
  private stopSub$: Subject<boolean> = new Subject<boolean>();

  constructor(private routerHelper: RouterHelper, private loadingHelper: LoadingHelper,
    public connection: ConnectivityHelper, private page: Page) { }

  ngOnInit() {
    this.getHistories();

    this.page.on('navigatingTo', (data) => {
      if (CurrentPeriodComponent.needToUpdateHistory) {
        CurrentPeriodComponent.needToUpdateHistory = false;
        this.getHistories();
      }
    });
  }

  refreshList(args) {
    const refreshPull = args.object;
    this.getHistories(refreshPull);
  }

  getHistories(refreshPull?: any) {
    this.noShiftsMessage = 'Loading...';

    this.currentClientPayrolls$.pipe(takeUntil(this.stopSub$)).subscribe(clientPayrolls => {
      if (clientPayrolls.length > 0) {
        this.stopSub$.next(true);
        this.client$.pipe(first()).subscribe(client => {
          const clientPayroll = clientPayrolls.find(p => p.customerId === client.Id);
          this.setSelectedPayroll.emit(clientPayroll.payrolls[0]);

          if (clientPayroll.payrolls.length > 0) {
            this.payroll = clientPayroll.payrolls[0];
            this.pullVisitsData.emit(clientPayroll.payrolls[0].PayrollId);
            this.noShiftsMessage = 'Unable to retrieve visits at this time. Please try again later.';

            if (refreshPull) {
              this.loading$.pipe(take(2)).subscribe(loading => {
                if (!loading) {
                  setTimeout(() => {
                    refreshPull.refreshing = false;
                  }, 500);
                }
              });
            }
          } else {
            this.pullVisitsData.emit(0);

            if (refreshPull) {
              setTimeout(() => {
                refreshPull.refreshing = false;
                this.noShiftsMessage = 'There are no visits at this time.';
              }, 500);
            } else {
              this.noShiftsMessage = 'There are no visits at this time.';
            }
          }

        });
      }
    });
  }

  shiftTap(index: number) {
    this.visits$.pipe(first()).subscribe(visits => {
      this.setSelectedVisit.emit(visits[index]);
      this.routerHelper.navigate(['history/shift-details']);
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
  navigateToAddShift() {
    console.log('8888888888888-----');
    this.routerHelper.navigate(['/status/add-shift']);
  }
}
