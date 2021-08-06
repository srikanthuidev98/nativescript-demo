import { Component, OnInit } from '@angular/core';
import { RouterHelper, DialogHelper, AnimationHelper } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { EditVisit, getFirstLastNameFromVisit, Payroll, Visit, compareVisits } from '../../../../ACCommon/models';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { first } from 'rxjs/operators';
import { DateService } from '../../../../ACCommon/services/date.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-edit-check-out-time',
  templateUrl: './edit-check-out-time.component.html',
  styleUrls: ['./edit-check-out-time.component.scss']
})
export class EditCheckOutTimeComponent implements OnInit {

  @Select(AppState.getEditVisit) editVisit$: Observable<EditVisit[]>;
  @Select(AppState.getSelectedPayroll) payroll$: Observable<Payroll>;
  @Select(AppState.getVisits) visits$: Observable<Visit[]>;

  @Emitter(AppState.setEditVisit)
  private setEditVisit: Emittable<EditVisit[]>;

  public checkoutDate: Date;
  public name: string;
  public minDate: Date;
  public maxDate: Date;
  public errorText = '';
  public originalVisit: Visit;

  constructor(private routerHelper: RouterHelper, private dialogHelper: DialogHelper, private activeRoute: ActivatedRoute,
    private animationHelper: AnimationHelper) { }

  ngOnInit() {
    this.setTimePicker(1); // Set To New Visit Time.
  }

  fadeOut(args) {
    this.animationHelper.fadeOut(args.object);
  }

  resetTap() {
    this.setTimePicker(0); // reset To Old Visit Time.
  }

  private setTimePicker(index: number) {
    this.editVisit$.pipe(first()).subscribe(editVisit => {
      this.originalVisit = editVisit[0].Visit;
      this.minDate = DateService.getDate(editVisit[1].Visit.CheckInTime);
      this.maxDate = DateService.getDate(editVisit[1].Visit.CheckInTime);
      this.maxDate.setDate(this.maxDate.getDate() + 1);

      this.checkoutDate = DateService.getDate(editVisit[index].Visit.CheckOutTime);

      const dayDiff = DateService.durationBetweenDates(this.checkoutDate, editVisit[1].Visit.CheckInTime, 'asDays');
      if (dayDiff > 1) {
        this.checkoutDate.setDate(this.checkoutDate.getDate() - (Math.floor(dayDiff)));
      }

      this.name = getFirstLastNameFromVisit(editVisit[0].Visit);
    });
  }

  onDayChanged(day: number) {
    this.checkoutDate.setDate(day);

    this.verifyDateIsValid();
  }

  onTimeChanged(time: { h: number, m: number}) {
    this.checkoutDate.setHours(time.h);
    this.checkoutDate.setMinutes(time.m);

    this.verifyDateIsValid();
  }

  verifyDateIsValid() {
    if (DateService.isBefore(this.checkoutDate, this.minDate)) {
      this.errorText = 'Check out cannot be before check in';
    } else if (DateService.isAfter(this.checkoutDate, this.maxDate)) {
      this.errorText = 'Visit entered cannot exceed more than 26 hours';
    } else {
      this.errorText = '';
    }
  }

  saveTap(save = false) {
    this.editVisit$.pipe(first()).subscribe(editVisit => {
      if (!save) {
        this.setTimePicker(0);
      }

      this.visits$.pipe(first()).subscribe(visits => {
        const checkinTime = DateService.getDate(editVisit[1].Visit.CheckInTime).getTime();
        const checkoutTime = this.checkoutDate.getTime();
        let isOverlapVisit: Visit;

        visits.forEach(visit => { // Check to see if the new times overlap with older times
          const inTime = DateService.getDate(visit.CheckInTime).getTime();
          const outTime = DateService.getDate(visit.CheckOutTime).getTime();

          if (!compareVisits(this.originalVisit, visit)) {
            if ((inTime < checkinTime && checkinTime < outTime) || (inTime < checkoutTime && checkoutTime < outTime)) {
              isOverlapVisit = visit;
              return;
            }

            if (checkinTime < inTime && checkinTime < outTime) {
              if (checkoutTime > inTime && checkoutTime > outTime) {
                isOverlapVisit = visit;
                return;
              }
            }

            if (checkoutTime > inTime && checkoutTime > outTime) {
              if (checkinTime < inTime && checkinTime < outTime) {
                isOverlapVisit = visit;
                return;
              }
            }
          }
        });

        if (isOverlapVisit) {
          const from = DateService.formatDate(isOverlapVisit.CheckInTime, 'MMM D, h:mma');
          const to = DateService.formatDate(isOverlapVisit.CheckOutTime, 'h:mma');
          this.dialogHelper.alert(`The visit entered overlaps with visit ${from} - ${to}. Please make correction before saving the visit.`,
          'Overlapping Visit.');
        } else if (checkinTime > checkoutTime) {
          this.dialogHelper.alert('Checkin time has to be at least 15 minutes before Checkout time.', 'Edited time is incorrect.');
        } else if (checkoutTime > new Date().getTime()) {
          this.dialogHelper.alert('Checkout time cannot be in the future', 'Edited time is incorrect.');
        } else if ((checkoutTime - checkinTime) > 0 && (Math.floor((checkoutTime - checkinTime) / 3600000) >= 26)) {
          this.dialogHelper.alert('Visit cannot be more than 26 hours.', 'Edited time is incorrect.');
        } else {
          this.payroll$.pipe(first()).subscribe(payroll => {
            editVisit[0].Visit.CheckOutTime = DateService.getString(DateService.getDate(editVisit[0].Visit.CheckOutTime));

            editVisit[1].Visit.CheckOutTime = DateService.getFormatedString(this.checkoutDate);
            this.setEditVisit.emit(editVisit);

            if (DateService.isAfter(this.checkoutDate, payroll.PeriodEndDate)) {
              this.dialogHelper.alert('Visit will split into multiple entries and show on two processing periods.',
              'Visit spans two processing periods').then(() => {
                this.routerHelper.nestedNavigate(['../checkout-activities'], this.activeRoute);
              });
            } else {
              this.routerHelper.nestedNavigate(['../checkout-activities'], this.activeRoute);
            }
          });
        }
      });
    });
  }
}
