import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditVisit, getFirstLastNameFromVisit } from '../../../../ACCommon/models';
import { DateService } from '../../../../ACCommon/services/date.service';
import { RouterHelper } from '../../../../ACCommon/helpers';

@Component({
  selector: 'app-edit-visit-header',
  templateUrl: './edit-visit-header.component.html',
  styleUrls: ['./edit-visit-header.component.scss']
})
export class EditVisitHeaderComponent implements OnInit {

  @Input() editVisit: EditVisit[];
  @Input() hideSkip = false;
  @Input() useRegularBack = false;

  @Output() skip = new EventEmitter();

  public name: string;
  public subText = 'Please review or edit the Check In Time below. Press Save to continue or Revert to cancel changes.';

  public dateChanged = false;
  public checkInChanged = false;
  public checkOutChanged = false;

  constructor(private routerHelper: RouterHelper) {}

  ngOnInit() {
    this.name = getFirstLastNameFromVisit(this.editVisit[0].Visit);
    const checkInDate0 = DateService.getDate(this.editVisit[0].Visit.CheckInTime);
    const checkOutDate0 = DateService.getDate(this.editVisit[0].Visit.CheckOutTime);
    const checkInDate1 = DateService.getDate(this.editVisit[1].Visit.CheckInTime);
    const checkOutDate1 = DateService.getDate(this.editVisit[1].Visit.CheckOutTime);

    if (this.hideSkip) {
      this.subText = 'Please select a reason for the visit changes and press the Confirm button below to save your updates.';
    }

    if (checkInDate0.getDay() !== checkInDate1.getDay()) {
      this.dateChanged = true;
    }

    if (checkInDate0.getHours() !== checkInDate1.getHours() ||
        checkInDate0.getMinutes() !== checkInDate1.getMinutes()) {
      this.checkInChanged = true;
    }

    if (checkOutDate0.getHours() !== checkOutDate1.getHours() ||
        checkOutDate0.getMinutes() !== checkOutDate1.getMinutes()) {
      this.checkOutChanged = true;
    }
  }

  backTap() {
    if (this.useRegularBack) {
      this.routerHelper.backToPreviousPage();
    } else {
      this.routerHelper.back();
    }
  }

  skipTap() {
    this.skip.emit();
  }
}
