import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { RouterHelper, DialogHelper, SwitchHelper, RedirectHelper, ModalHelper } from '../../../../ACCommon/helpers';
import { FingerprintService } from '../../../../ACCommon/services/fingerprint.service';
import { TouchIdTermsComponent } from '../../auth/touch-id-terms/touch-id-terms.component';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Schedule } from '../../../../ACCommon/models';
import { CalendarService } from '../../../../ACCommon/services/calendar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Select(AppState.getSyncSchedule) syncSchedule$: Observable<{ shouldSync: boolean, dateCalled: Date, schedule: Schedule }>;
  @Select(AppState.getScheduleEnabled) scheduleEnabled$: Observable<boolean>;

  @Emitter(AppState.logout)
  public logout: Emittable<null>;

  constructor(private routerHelper: RouterHelper, private fingerprintService: FingerprintService,
              private switchHelper: SwitchHelper, private dialog: DialogHelper,
              private modalHelper: ModalHelper, private vcRef: ViewContainerRef, private redirectHelper: RedirectHelper,
              public calendarService: CalendarService) { }

  public fingerprintEnabled = false;

  public fingerprintString = '';

  ngOnInit() {
    this.fingerprintEnabled = this.fingerprintService.isFingerprintEnabled();
    this.fingerprintService.fingerprintStringType().then(type => {
      this.fingerprintString = type;
    });
  }

  onCheckedChange(args: any) {
    this.switchHelper.switch(args);
  }

  linkTap(link: number) {
    switch (link) {
      case 1: // Frequently Asked Questions
        this.routerHelper.navigate(['settings/faq']);
        break;
      case 2: // Customer Support
        this.routerHelper.navigate(['/settings/contact-us', { from: 'settings'}]);
        break;
      case 3: // Report a Bug
        break;
      case 4: // Rate This App
        break;
      case 5: // Privacy Policy
        this.redirectHelper.openPrivacyPolicyWebpage();
        break;
      case 6: // Terms of Use
        this.redirectHelper.openTermsOfUseWebpage();
        break;
      case 7: // Enable Fingerprint
        if (this.fingerprintEnabled) { // Fingerprint is enabled.
          this.dialog.confirmAlert(`Are you sure you want to disable ${this.fingerprintString} sign on?`,
                                  `Disable ${this.fingerprintString}`, 'Confirm', 'Cancel').then(result => {
            if (result) {
              this.fingerprintEnabled = false;
              this.fingerprintService.removeFingerprint();
            }
          });
        } else { // Fingerprint is disabled or not been set up.
          this.modalHelper.openFullscreenModal(TouchIdTermsComponent, this.vcRef).then((res: string) => {
            if (res === 'accept') {
              this.fingerprintService.setUpFingerprint().then(() => {
                this.fingerprintEnabled = true;
              }).catch(e => {
                console.log(e);
              });
            }
          });
        }
        break;
      case 8: // Change Password
        this.routerHelper.navigate(['/settings/change-password']);
        break;
      case 9: // Log Out
        this.logout.emit(null);
        break;
      case 10: // Sync calendar
        this.calendarService.initialSync();
        break;
      case 11: // Desync calendar
        this.calendarService.desync();
        break;
      default:
        console.log('Incorrect link number was passed.');
        break;
    }
  }
}
