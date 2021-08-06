import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { EditVisit, getServiceValue, IADL } from '../../../../ACCommon/models';
import { first, take } from 'rxjs/operators';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { DateService } from '../../../../ACCommon/services/date.service';
import { CurrentPeriodComponent } from '../../status/current-period/current-period.component';
import { RouterHelper, LoadingHelper, DialogHelper } from '../../../../ACCommon/helpers';

@Component({
  selector: 'ns-edit-changes',
  templateUrl: './edit-changes.component.html',
  styleUrls: ['./edit-changes.component.scss']
})
export class EditChangesComponent implements OnInit {

  @Select(AppState.getEditVisit) editVisit$: Observable<EditVisit[]>;
  @Select(AppState.getIADLKeys) iadlKeys$: Observable<IADL[]>;

  @Emitter(AppState.updateVisit)
  private updateVisit: Emittable<EditVisit[]>;

  public showError = false;
  public reasonAnswer: number;
  public changes: { key: string, from: string | Date, to: string | Date, dateType?: string }[] = [];

  reasons: string[] = ['Disaster/Emergency', 'Data/Wifi Not available', 'I failed to check in on time',
  'I failed to check out on time', 'I need to modify the services I performed' ];

  constructor(private routerHelper: RouterHelper, private loadingIndicator: LoadingHelper, private dialogHelper: DialogHelper) { }

  ngOnInit() {
    this.editVisit$.pipe(first()).subscribe(editVisit => {
      Object.keys(editVisit[0].Visit).forEach(key => {
        if (editVisit[0].Visit[key] !== editVisit[1].Visit[key]) {
          if (key === 'CheckInTime' || key === 'CheckOutTime') {
            // Check In and Check out Date and Time.
            this.getTimeDifference(key, editVisit);
          } else if (key === 'BathingID' || key === 'DressingID' || key === 'TransferringID' || key === 'ContinenceID' ||
              key === 'ToiletingID' || key === 'FeedingID' || key === 'SupervisionID')  { // Services

            this.changes.push({
              key: key.slice(0, -2),
              from: getServiceValue(key, +editVisit[0].Visit[key]),
              to: getServiceValue(key, +editVisit[1].Visit[key])
            });
          } else if (key === 'AdditionalServices') { // Other Services
            this.iadlKeys$.pipe(first()).subscribe(iadlKeys => {
              Object.keys(editVisit[0].Visit.AdditionalServices).forEach(k => {
                if (editVisit[0].Visit.AdditionalServices[k] !== editVisit[1].Visit.AdditionalServices[k]) {
                  const iadl = iadlKeys.find(obj => {
                    return obj.Key === k;
                  });

                  const from = editVisit[0].Visit.AdditionalServices[k] === 1 ? 'Yes' : 'No';
                  const to = editVisit[1].Visit.AdditionalServices[k] === 1 ? 'Yes' : 'No';

                  this.changes.push({
                    key: iadl.Title,
                    from: from,
                    to: to
                  });
                }
              });
            });
          } else if (key === 'Mileage') { // Mileage
            setTimeout(() => { // Make it last in the array.
              this.changes.push({ key: key, from: `${editVisit[0].Visit[key]}`, to: `${editVisit[1].Visit[key]}`});
            }, 100);
          }
        }
      });
    });
  }

  getTimeDifference(key: string, editVisit: EditVisit[]) {
    let text = 'Check In';
    if (key === 'CheckOutTime') {
      text = 'Check Out';
    }

    const date0 = DateService.getDate(editVisit[0].Visit[key]);
    const date1 = DateService.getDate(editVisit[1].Visit[key]);

    if (date0.getDay() !== date1.getDay()) {
      this.changes.push({
        key: `${text} Date`,
        from: DateService.getDate(editVisit[0].Visit[key]),
        to: DateService.getDate(editVisit[1].Visit[key]),
        dateType: 'day'
      });

      if (date0.getHours() === date1.getHours() && date0.getMinutes() === date1.getMinutes()) {
        return;
      }
    }

    this.changes.push({
      key: `${text} Time`,
      from: DateService.getDate(editVisit[0].Visit[key]),
      to: DateService.getDate(editVisit[1].Visit[key]),
      dateType: 'hour'
    });
  }

  dropDownItemSelected(index: number) {
    this.reasonAnswer = index;
    this.showError = false;
  }

  confirmTap() {
    if (this.reasonAnswer === undefined) {
      this.showError = true;
    } else {
      this.editVisit$.pipe(take(2)).subscribe(editVisit => {
        if (editVisit) { // First time sends to API, after data returns, deletes editVisit.
          this.loadingIndicator.showIndicator();
          editVisit[1].Visit.Comment = `Update via mobile app. Reason: ${this.reasons[this.reasonAnswer]}.`;
          this.updateVisit.emit(editVisit);
        } else { // Second hit means that it was successful
          CurrentPeriodComponent.needToUpdateHistory = true;
          this.routerHelper.backToPreviousPage();
          setTimeout(() => {
            this.loadingIndicator.hideIndicator();
            this.dialogHelper.alert('This visit has been successfully updated.', 'Success', 'Close');
          }, 200);
        }
      });
    }
  }
}
