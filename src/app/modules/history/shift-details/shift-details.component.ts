import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../ACCommon/states';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Client, IADL, Payroll, Visit, EditVisit, createInitialEditVisit, getServiceValue } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { RouterHelper, AnimationHelper, DialogHelper } from '../../../../ACCommon/helpers';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Page } from 'tns-core-modules/ui/page/page';
import { DateService } from '../../../../ACCommon/services/date.service';

@Component({
  selector: 'app-shift-details',
  templateUrl: './shift-details.component.html',
  styleUrls: ['./shift-details.component.scss']
})
export class ShiftDetailsComponent implements OnInit {

  @Select(AppState.getClients) clients$: Observable<Client[]>;
  @Select(AppState.getHistoryClient) client$: Observable<Client>;
  @Select(AppState.getIADLKeys) iadlKeys$: Observable<IADL[]>;
  @Select(AppState.getSelectedPayroll) payroll$: Observable<Payroll>;
  @Select(AppState.getSelectedVisit) visit$: Observable<Visit>;
  @Select(AppState.getEditVisit) editVisit$: Observable<EditVisit[]>;

  @Emitter(AppState.setEditVisit)
  private setEditVisit: Emittable<EditVisit[]>;

  iadls: string[];
  adls: { key: string, val: string }[];
  payDetailClient: Client; // This is created for PayRate. Incase the client has multiple pay rates.

  public showEditVisitButton = false;

  constructor(private routerHelper: RouterHelper, private animationHelper: AnimationHelper, private page: Page,
    private dialogHelper: DialogHelper) { }

  ngOnInit() {
    this.updateUI();

    this.page.on('navigatingTo', (data) => {
      this.updateUI();

      this.editVisit$.pipe(first()).subscribe(editVisit => {
        if (editVisit) {
          setTimeout(() => {
            this.setEditVisit.emit(undefined);
            this.dialogHelper.alert('No changes were saved to this visit.', 'Cancelled', 'Close');
          }, 500);
        }
      });
    });
  }

  updateUI() {
    this.iadls = [];
    this.adls = [];

    this.iadlKeys$.pipe(first()).subscribe(iadlKeys => {
      this.visit$.pipe(first()).subscribe(visit => {

        // Getting the correct client based off of CaregiverId. This is used to get the correct Pay Rate.
        this.clients$.pipe(first()).subscribe(clients => {
          this.payDetailClient = clients.find(c => +c.CaregiverId === +visit.CaregiverId);
        });

        iadlKeys.forEach(element => {
          if (visit.IADLS.search(element.Key + '::1') !== -1) {
            this.iadls.push(element.Title);
          }
        });

        this.getServiceValues('Bathing', visit.BathingID);
        this.getServiceValues('Dressing', visit.DressingID);
        this.getServiceValues('Transferring', visit.TransferringID);
        this.getServiceValues('Continence', visit.ContinenceID);
        this.getServiceValues('Toileting', visit.ToiletingID);
        this.getServiceValues('Feeding', visit.FeedingID);
        this.getServiceValues('Supervision', visit.SupervisionID);

        this.payroll$.pipe(first()).subscribe(payroll => {
          if (this.payDetailClient.CareGiverEditVisitMode === 1 && payroll.IsEditable === 1 && visit.CheckInTime && visit.CheckOutTime &&
            DateService.durationBetweenDates(payroll.PeriodStartDate, new Date(), 'asWeeks') < 5) {
            this.showEditVisitButton = true;
          } else {
            this.showEditVisitButton = false;
          }
        });
      });
    });
  }

  cardLoaded(view, index) {
    view.visibility = 'collapse';

    setTimeout(() => { // Need timeout because cardLoaded happens before @Input() variables are loaded.
      this.animationHelper.slideInto(view, index);
    }, 10);
  }

  private getServiceValues(service: string, serviceId: number) {
    if (serviceId === 0) {
      return;
    }

    this.adls.push( { key: service, val: getServiceValue(service, serviceId) });
  }

  editTimeButtonTap() {
    this.visit$.pipe(first()).subscribe(visit => {
      this.setEditVisit.emit(createInitialEditVisit(visit));
      this.routerHelper.navigate(['history/edit-visit']);
    });
  }
}
