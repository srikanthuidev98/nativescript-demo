import { Component, OnInit } from '@angular/core';
import { RouterHelper, AnimationHelper } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { EditVisit, getFirstLastNameFromVisit, Payroll } from '../../../../ACCommon/models';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { first } from 'rxjs/operators';
import { DateService } from '../../../../ACCommon/services/date.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'ns-edit-check-in-time',
  templateUrl: './edit-check-in-time.component.html',
  styleUrls: ['./edit-check-in-time.component.scss']
})
export class EditCheckInTimeComponent implements OnInit {

  @Select(AppState.getEditVisit) editVisit$: Observable<EditVisit[]>;
  @Select(AppState.getSelectedPayroll) payroll$: Observable<Payroll>;

  @Emitter(AppState.setEditVisit)
  private setEditVisit: Emittable<EditVisit[]>;

  public checkinDate: Date;
  public name: string;
  public minDate: Date;
  public maxDate: Date;
  public errorText = '';

  constructor(private routerHelper: RouterHelper, private activeRoute: ActivatedRoute, private animationHelper: AnimationHelper) { }

  ngOnInit() {
    this.setTimePicker(1); // Set To New Visit Time.

    this.payroll$.pipe(first()).subscribe(payroll => {
      this.minDate = DateService.getDate(payroll.PeriodStartDate);
      this.minDate.setHours(0);
      this.minDate.setMinutes(0);

      this.editVisit$.pipe(first()).subscribe(editVisit => {
        this.maxDate = DateService.getDate(editVisit[0].Visit.CheckOutTime);
      });
    });
  }

  fadeOut(args) {
    this.animationHelper.fadeOut(args.object);
  }

  resetTap() {
    this.setTimePicker(0); // reset To Old Visit Time.
  }

  private setTimePicker(index: number) {
    this.editVisit$.pipe(first()).subscribe(editVisit => {
      this.checkinDate = DateService.getDate(editVisit[index].Visit.CheckInTime);
      this.name = getFirstLastNameFromVisit(editVisit[0].Visit);
    });
  }

  onDayChanged(day: number) {
    this.checkinDate.setDate(day);
  }

  onTimeChanged(time: { h: number, m: number}) {
    this.checkinDate.setHours(time.h);
    this.checkinDate.setMinutes(time.m);

    if (DateService.isBefore(this.checkinDate, this.minDate)) {
      this.errorText = 'Check out cannot be before check in';
    } else if (DateService.isAfter(this.checkinDate, this.maxDate)) {
      this.errorText = 'Check in cannot be after check out';
    } else {
      this.errorText = '';
    }
  }

  saveTap(save = false) {
    this.editVisit$.pipe(first()).subscribe(editVisit => {
      if (!save) {
        this.setTimePicker(0);
      }

      editVisit[0].Visit.CheckInTime = DateService.getString(DateService.getDate(editVisit[0].Visit.CheckInTime));

      editVisit[1].Visit.CheckInTime = DateService.getFormatedString(this.checkinDate);
      this.setEditVisit.emit(editVisit);

      this.routerHelper.nestedNavigate(['../edit-check-out-time'], this.activeRoute);
    });
  }
}
