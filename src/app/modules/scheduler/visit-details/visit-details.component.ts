import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';
import { RedirectHelper, RouterHelper } from '../../../../ACCommon/helpers';
import { ActivatedRoute } from '@angular/router';
import { ScheduleVisit, getScheduleVisitAddress } from '../../../../ACCommon/models/schedule.model';
import { View } from 'tns-core-modules/ui/page/page';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { Client, DualClient } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { DateService } from '../../../../ACCommon/services/date.service';
import { PayRateType } from '../../../../ACCommon/enums';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.scss']
})
export class VisitDetailsComponent implements OnInit {

  @ViewChild('scrollview', { static: true }) scrollview: ElementRef;

  @Select(AppState.getClients) clients$: Observable<Client[]>;

  @Emitter(AppState.setCurrentClient)
  public setCurrentClient: Emittable<Client>;

  @Emitter(AppState.setCurrentDualClient)
  public setCurrentDualClient: Emittable<DualClient>;

  constructor(private redirectHelper: RedirectHelper, private route: ActivatedRoute, private routerHelper: RouterHelper) { }

  public visit: ScheduleVisit;

  public address: string;
  public initals: string;
  public commentDdOpen = false;
  public servicesDdOpen = false;

  // TODO Remove
  public testPath = '';

  ngOnInit() {
    this.visit = JSON.parse(this.route.snapshot.paramMap.get('visit'));

    if (this.visit.hasPicture) {
      this.testPath = FileStorageService.getFilePath('profile-pic.jpeg'); // TODO
    } else {
      this.initals = this.visit.name.match(/\b(\w)/g).join('');
    }

    this.address = getScheduleVisitAddress(this.visit);
  }

  addressTap(address: string) {
    this.redirectHelper.openMap(address);
  }

  phoneTap(number: string) {
    if (number) {
      this.redirectHelper.call(number);
    }
  }

  checkInTap() {
    this.clients$.pipe(first()).subscribe(clients => {
      const client = clients.find(c => +c.CaregiverId === +this.visit.ltcCaregiverId);
      if (client) {
        this.setCurrentClient.emit(client);
        this.setCurrentDualClient.emit(undefined);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0);
        yesterday.setMinutes(0);
        if (this.visit.payRateType === PayRateType.Daily &&
            DateService.isAfter(new Date(), this.visit.checkInTime) &&
            DateService.isBefore(yesterday, this.visit.checkInTime)) {

          // Used if scheduled visit is a day rate for yesterday.
          console.log('Scheduled visit date is yesterday.');
          this.routerHelper.navigate(['/status/record-audio', { visit: JSON.stringify(this.visit)}]);
        } else {
          if (client.askCheckInQuestions) {
            this.routerHelper.navigate(['/status/additional-questions', { from: 'checkin'}]);
          } else {
            this.routerHelper.navigate(['/status/record-audio']);
          }
        }
      }
    });
  }

  dropDownTap(view: View, dropDownNumber: number) {
    if (dropDownNumber === 1) { // Comment dropdown
      this.commentDdOpen = !this.commentDdOpen;
    } else { // Services dropdown
      this.servicesDdOpen = !this.servicesDdOpen;
    }

    setTimeout(() => {
      this.scrollview.nativeElement.scrollToVerticalOffset(view.getLocationOnScreen().y, true);
    }, 150);
  }
}
