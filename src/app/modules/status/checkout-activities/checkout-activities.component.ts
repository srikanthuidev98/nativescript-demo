import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { Client, ADL, IADL, DualClient, EditVisit,
  Visit, CalendarTask, SubmitActionRequest } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { DialogHelper, SwitchHelper, RouterHelper, LoadingHelper } from '../../../../ACCommon/helpers';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { GeofencingType, SubmitActionType } from '../../../../ACCommon/enums';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '../../../../ACCommon/services/date.service';
import { LocalStorageService } from '../../../../ACCommon/storage/local-storage';

@Component({
  selector: 'app-checkout-activities',
  templateUrl: './checkout-activities.component.html',
  styleUrls: ['./checkout-activities.component.scss']
})
export class CheckoutActivitiesComponent implements OnInit {

  @ViewChild('scrollview', { static: true }) scrollview: ElementRef;

  @Select(AppState.getADLKeys) adls$: Observable<ADL[]>;
  @Select(AppState.getIADLKeys) iadls$: Observable<IADL[]>;
  @Select(AppState.getCurrentSubmitActionRequest) currentSubmitAction$: Observable<SubmitActionRequest>;
  @Select(AppState.getCurrentClient) client$: Observable<Client>;
  @Select(AppState.getCurrentDualClient) dualClient$: Observable<DualClient>;
  @Select(AppState.getEditShift) editShift$: Observable<SubmitActionRequest>;

  @Select(AppState.getEditVisit) editVisit$: Observable<EditVisit[]>;
  @Select(AppState.getHistoryClient) historyClient$: Observable<Client>;

  @Emitter(AppState.setEditShift)
  public setEditShift: Emittable<SubmitActionRequest>;

  @Emitter(AppState.updateCurrentSubmitActionRequest)
  public updateCurrentSubmitActionRequest: Emittable<SubmitActionRequest>;

  @Emitter(AppState.submitAction)
  public submitAction: Emittable<SubmitActionRequest>;

  @Emitter(AppState.setEditVisit)
  private setEditVisit: Emittable<EditVisit[]>;

  constructor(private dialogHelper: DialogHelper, private switchHelper: SwitchHelper,
    private loadingHelper: LoadingHelper, private routerHelper: RouterHelper, private route: ActivatedRoute) { }

  // For all views
  public title = 'Check Out';
  public continueBtnText = 'Check Out';
  public titleSubText = '';
  public isEditVisitPage = false;
  public errorText = '';
  public ADLs: ADL[] = [];
  public IADLs: IADL[] = [];
  public client: Client;
  public mileage: number; // ngModel to Mileage textField

  // For Signature Review view
  public editRows = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];             // Default edit button colors.
  public editTextFieldColors = ['#979797', '#979797', '#979797', '#979797', '#979797'];  // Default Text field border colors.
  private isSummaryPage = false;

  // For Dual Clients view
  private isDualClient = false;
  private dualClientNum = 0;

  // For Edit Visit view
  public oldVisit: Visit;
  public changedADLs: boolean[] = []; // Used for Edit Visit to show changed values.
  public changedIADLs: boolean[] = []; // Used for Edit Visit to show changed values.
  public changedMileage = false; // Used for Edit Visit to show changed values.

  // For Scheduled visits view
  public hasScheduledServices = false;
  public showRequiredtaskLabel = false;
  public requestedServices: CalendarTask[] = [];

  // Taxonomy switches
  public needsToSign = false;
  public allowEditingShift = false;

  ngOnInit() {
    this.dualClientNum = +this.route.snapshot.paramMap.get('dualClientNum'); // Grabs route parameter

    this.editVisit$.pipe(first()).subscribe(editVisit => {
      this.initADLandIADL();

      if (editVisit) { // Came from history to edit Visit.
        this.title = 'Edit Visit Details';
        this.isEditVisitPage = true;
        this.oldVisit = editVisit[0].Visit;
        this.historyClient$.pipe(first()).subscribe(historyClient => {
          this.client = historyClient;
          this.setDataFromVisit(editVisit[1].Visit, editVisit[0].Visit);
        });
      } else {  // Regular check in / out, Signature view, Dual Client, Scheduled visit
        this.client$.pipe(first()).subscribe(client => {
          this.dualClient$.pipe(first()).subscribe(dualClient => {
            if (dualClient) {
              client = dualClient[`c${this.dualClientNum + 1}`]; // EX: dualClient.c1
              this.isDualClient = true;
            }

            this.client = client;

            let dataChanged = false;

            // If client has requested services from RC.
            if (client.ScheduleServices && client.ScheduleServices.length > 0) {
              this.hasScheduledServices = true;
              client.ScheduleServices.forEach(task => {
                task.Value = 0;
                task.ValueString = 'Did not provide';

                if (task.isRequired) {
                  const days = DateService.getAllDayNames();
                  const today = DateService.getDayName(new Date());

                  // Goes through week day names to check if any matches.
                  for (let i = 0; i < days.length; i++) {
                    if (task.frequency.includes(days[i])) {
                      // If theres a day name in the string, checks if it matches with today
                      // If it does, nothing happens, if it doesn't its not required today.
                      if (!task.frequency.includes(today)) {
                        task.isRequired = false;
                        dataChanged = true;
                      }
                      break;
                    }
                  }
                }

                this.requestedServices.push(task);
                if (!this.showRequiredtaskLabel && task.isRequired) {
                  this.showRequiredtaskLabel = true;
                }
              });

              // Re-sorts the data if isRequired changed for a task.
              if (dataChanged) {
                client.ScheduleServices.sort(function(a, b) {
                  const aa = a.isRequired ? 1 : 0;
                  const bb = b.isRequired ? 1 : 0;
                  return bb - aa;
                });
              }
            }

            this.initADLandIADL();

            // Taxonomy
            this.client.NeedsToSign ? this.needsToSign = true : this.needsToSign = false;
            this.client.AllowEditingShift ? this.allowEditingShift = true : this.allowEditingShift = false;

            // this.allowEditingShift = true;  // Used for testing editting.
          });
        });

        this.editShift$.pipe(first()).subscribe(editShift => {
          if (editShift) {
            this.isSummaryPage = true;
            this.title = 'Verify Shift';
            this.continueBtnText = 'Continue';

            this.titleSubText = 'Please review the visit details below. If any information is incorrect ' +
                                'touch the Edit Icon on each section header and correct the information. ' +
                                'When your review is complete touch the Continue button at the bottom.';

            this.setDataFromShift(editShift);

            this.dialogHelper.alert('Please hand the phone to your client', 'Client Review', 'Close');
          } else {
            this.titleSubText = 'Indicate which Activities of Daily Living you provided assistance with during this visit.';

            // Resets the answers for the questions.
            // if (this.client.Questions) {
            //     for (let i = 0; i < this.client.Questions.length; i++) {
            //         this.client.Questions[i].answer = undefined;
            //         this.client.Questions[i].showError = false;
            //     }
            // }
          }
        });
      }

      this.loadingHelper.hideIndicator();
    });
  }

  private initADLandIADL() {
    this.ADLs = [];
    this.IADLs = [];

    this.adls$.pipe(first()).subscribe(adls => {
      adls.forEach(adl => {
        const _adl = <ADL>JSON.parse(JSON.stringify(adl));

        if (this.requestedServices) {
          const foundScheduledTask = this.requestedServices.find(task => task.task === adl.Title);
          if (foundScheduledTask) {
            _adl.Hide = true;
          }
        }

        this.ADLs.push(JSON.parse(JSON.stringify(_adl)));
      });
    });

    this.iadls$.pipe(first()).subscribe(iadls => {
      iadls.forEach(iadl => {
        const _iadl = <IADL>JSON.parse(JSON.stringify(iadl));

        if (this.requestedServices) {
          const foundScheduledTask = this.requestedServices.find(task => task.task === iadl.Title);
          if (foundScheduledTask) {
            _iadl.Hide = true;
          }
        }

        this.IADLs.push(JSON.parse(JSON.stringify(_iadl)));
      });
    });
  }

  private setDataFromShift(editShift: SubmitActionRequest) {
    Object.keys(editShift.visit.ADLs).forEach((key, index) => {
      this.ADLs[index].Value = editShift.visit.ADLs[key];
      this.changedADLs.push(false);

      if (editShift.visit.ADLs[key] === 1) {
        if (key === 'super') {
          this.ADLs[index].ValueString = 'Provided';
        } else {
          this.ADLs[index].ValueString = 'Hands On';
        }
      } else if (editShift.visit.ADLs[key] === 2) {
        this.ADLs[index].ValueString = 'Standby';
      }
    });

    Object.keys(editShift.visit.IADLs).forEach((key, index) => {
      this.IADLs[index].Value = editShift.visit.IADLs[key];
      this.changedIADLs.push(false);
    });
    this.mileage = editShift.visit.Mileage;
  }

  private setDataFromVisit(visit: Visit, oldVisit?: Visit) {
    this.changedADLs = [];
    this.changedIADLs = [];

    if (!oldVisit) {
      oldVisit = visit;
    }

    this.ADLs.forEach((adl, index) => {
      if (visit[`${adl.Title}ID`] !== undefined) {
        this.changedADLs.push(false);
        this.ADLs[index].Value = visit[`${adl.Title}ID`];

        if (visit[`${adl.Title}ID`] === 1) {
          if (adl.Key === 'super') {
            this.ADLs[index].ValueString = 'Provided';
          } else {
            this.ADLs[index].ValueString = 'Hands On';
          }
        } else if (visit[`${adl.Title}ID`] === 2) {
          this.ADLs[index].ValueString = 'Standby';
        }
      }

      if (this.isEditVisitPage) {
        if (this.oldVisit[`${adl.Title}ID`] !== this.ADLs[index].Value) {
          this.changedADLs[index] = true;
        } else {
          this.changedADLs[index] = false;
        }
      }
    });

    Object.keys(visit.AdditionalServices).forEach((key, index) => {
      this.IADLs[index].Value = visit.AdditionalServices[key];

      if (visit.AdditionalServices[key] !== oldVisit.AdditionalServices[key]) {
        this.changedIADLs.push(true);
      } else {
        this.changedIADLs.push(false);
      }
    });

    this.mileage = visit.Mileage;
  }

  requestedServiceTap(task: CalendarTask, index: number) {
    this.dialogHelper.genericActionDialog(
      ['Hands-On assistance', 'Standby assistance', 'Did not provide'], '').then(result => { // , 'Client Refused'
      switch (result) {
        case 'Hands-On assistance':
          this.requestedServices[index].Value = 1;
          this.requestedServices[index].ValueString = 'Hands-On';
          break;
        case 'Standby assistance':
          this.requestedServices[index].Value = 2;
          this.requestedServices[index].ValueString = 'Standby';
          break;
        case 'Did not provide':
          this.requestedServices[index].Value = 0;
          this.requestedServices[index].ValueString = 'Did not provide';
          break;
        case 'Client Refused':
          this.requestedServices[index].Value = 3;
          this.requestedServices[index].ValueString = 'Client Refused';
          break;
      }
    });
  }

  adlOptionTap(adl: ADL, index: number) {
    this.dialogHelper.activitiesActionDialog(adl.Title).then(result => {
      switch (result) {
        case 'Hands-On assistance':
          this.ADLs[index].Value = 1;
          this.ADLs[index].ValueString = 'Hands-On';
          break;
        case 'Standby assistance':
          this.ADLs[index].Value = 2;
          this.ADLs[index].ValueString = 'Standby';
          break;
        case 'Provided':
          this.ADLs[index].Value = 1;
          this.ADLs[index].ValueString = 'Provided';
          break;
        case 'Did not provide':
          this.ADLs[index].Value = 0;
          this.ADLs[index].ValueString = 'Did not provide';
          break;
      }

      if (this.isEditVisitPage) {
        if (this.oldVisit[`${adl.Title}ID`] !== this.ADLs[index].Value) {
          this.changedADLs[index] = true;
        } else {
          this.changedADLs[index] = false;
        }
      }
    });
  }

  // Had to separate onCheckedTap and onCheckedChange because onCheckedChange is called during initialization.
  // If the code in onCheckedTap, it would crash because this.changedIADLs[index] would change from true to false too fast.
  // Added Timeout to make sure that onCheckedChange is finished before this is called.
  onCheckedTap(iadl: IADL, index: number) {
    if (this.isEditVisitPage) {
      setTimeout(() => {
        if (this.isEditVisitPage) {
          this.changedIADLs[index] = !this.changedIADLs[index];
        }
      }, 10);
    }
  }

  onCheckedChange(args: any, iadl: IADL, index: number) {
    if (this.switchHelper.switch(args)) {
      this.IADLs[index].Value = 1;
    } else {
      this.IADLs[index].Value = 0;
    }
  }

  mileageChanged(args) {
    if (this.isEditVisitPage) {
      if (`${args.value}` !== `${this.oldVisit.Mileage}`) {
        this.changedMileage = true;
      } else {
        this.changedMileage = false;
      }
    }
  }

  checkoutTap() {
    this.errorText = '';

    this.verifyInputs().then(ans => {
      if (ans) {
        this.currentSubmitAction$.pipe(first()).subscribe(currentSA => {
          if (currentSA) {
            // If coming from a scheduled Visit from yesterday, there would already be data for these.
            if (currentSA.visit.ActionType === SubmitActionType.Daily &&
              !currentSA.visit.CheckInTime && !currentSA.visit.CheckOutTime) {

                currentSA.visit.CheckInTime = DateService.getString(new Date());
                currentSA.visit.CheckOutTime = DateService.getString(new Date());
            }

            if (currentSA.visit.ActionType !== SubmitActionType.Daily) {
              currentSA.visit.CheckOutTime = DateService.getString(new Date());
            }

            if (this.requestedServices.length > 0) {
              currentSA.visit.ScheduleServices = this.requestedServices;
              for (let i = 0; i < this.ADLs.length; i++) {
                if (this.ADLs[i].Hide) {
                  const adlTask = this.requestedServices.find(task => task.task === this.ADLs[i].Title);
                  if (adlTask.task === 'Supervision') {
                    if (adlTask.Value === 1 || adlTask.Value === 2) {
                      this.ADLs[i].Value = 1;
                    } else {
                      this.ADLs[i].Value = 0;
                    }
                  } else {
                    if (adlTask.Value === 3) {
                      this.ADLs[i].Value = 0;
                    } else {
                      this.ADLs[i].Value = adlTask.Value;
                    }
                  }
                }
              }

              for (let i = 0; i < this.IADLs.length; i++) {
                if (this.IADLs[i].Hide) {
                  const iadlTask = this.requestedServices.find(task => task.task === this.IADLs[i].Title);
                  if (iadlTask.Value === 1 || iadlTask.Value === 2) {
                    this.IADLs[i].Value = 1;
                  } else {
                    this.IADLs[i].Value = 0;
                  }
                }
              }
            }

            const invalidLocations = LocalStorageService.getLocationInvaildForVisit();
            if (invalidLocations.length > 0) {
              currentSA.visit.InvalidLocations = invalidLocations;
            }

            if (this.dualClientNum === 0) { // If regular client, or dualCLient 1
              currentSA.visit.Mileage = this.mileage;
              currentSA.visit.ADLs = this.createDictionaryForAPI(this.ADLs);
              currentSA.visit.IADLs = this.createDictionaryForAPI(this.IADLs);
            } else {  // If DualClient 2 only
              currentSA.visit2 = { ...currentSA.visit };
              currentSA.visit2.Mileage = this.mileage;
              currentSA.visit2.ADLs = this.createDictionaryForAPI(this.ADLs);
              currentSA.visit2.IADLs = this.createDictionaryForAPI(this.IADLs);
            }

            // TODO Add signature workflow to dualClient
            if (this.isDualClient) {
              if (this.dualClientNum === 0) { // First pass on dualClient (c1)
                this.routerHelper.replace(['/status/client-available']);
              } else {      // Second pass on dualClient (c2)
                this.submit(currentSA);
              }
            } else { // Regular client. (Not a dual clientt)
              if (this.isSummaryPage) {
                this.setEditShift.emit(currentSA);
                this.routerHelper.navigate(['/status/signature']);
              } else if (this.needsToSign) {
                this.updateCurrentSubmitActionRequest.emit(currentSA);
                this.setEditShift.emit(currentSA);
                this.routerHelper.replace(['/status/client-available']);
              } else {
                this.submit(currentSA);
              }
            }
          }
        });
      } else {
        console.log('WRONG DATA!!'); // TODO - Add error handling.
      }
    });
  }

  private submit(currentSA: SubmitActionRequest) {
    if (this.client.showLocationAlert) {
      let outside = false;
      for (const geo of currentSA.visit.GeofencingEvents) {
        if (geo.GeofencingType === GeofencingType.out) {
          outside = true;
          break;
        }
      }

      if (outside) {
        this.updateCurrentSubmitActionRequest.emit(currentSA);
        this.routerHelper.navigate(['/status/location-alert']);
      }
    } else {
      this.submitAction.emit(currentSA);
    }
  }

  editTap(row: number) {
    if (this.editRows[row] === '#ffffff') {
      this.editRows[row] = '#0091ff';
      this.editTextFieldColors[row] = '#0091ff';
    } else {
      this.editRows[row] = '#ffffff';
      this.editTextFieldColors[row] = '#979797';
    }
  }

  enableEdit(row: number) {
    if (this.isSummaryPage) {
      if (this.editRows[row] !== '#ffffff') {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }

  resetTap() {
    this.setDataFromVisit(this.oldVisit);
    this.mileage = this.oldVisit.Mileage;
    this.changedMileage = false;
  }

  /**
   * This is the tap for Edit Visit.
   */
  saveTap(save = false) {
    if (!save) { // Skip button was pressed. So reset all data.
      this.resetTap();
    }

    this.errorText = '';

    if (this.verifyInputs()) {
      this.editVisit$.pipe(first()).subscribe(editVisit => {
        for (let i = 0; i < this.changedADLs.length; i++) {
          editVisit[1].Visit[`${this.ADLs[i].Title}ID`] = this.ADLs[i].Value;
        }

        for (let i = 0; i < this.changedIADLs.length; i++) {
          editVisit[1].Visit.AdditionalServices[this.IADLs[i].Key] = this.IADLs[i].Value;
        }

        editVisit[1].Visit.Mileage = this.mileage;

        this.setEditVisit.emit(editVisit);

        this.routerHelper.nestedNavigate(['../edit-changes'], this.route);
      });
    }
  }

  private createDictionaryForAPI(list: ADL[] | IADL[]) {
    const dictionary = {};

    for (let i = 0; i < list.length; i++) {
      dictionary[list[i].Key] = list[i].Value;
    }

    return dictionary;
  }

  private async verifyInputs(): Promise<boolean> {
    if (this.requestedServices.length > 0) {
      let showAlert = false;

      for (let i = 0; i < this.requestedServices.length; i++) {
        if (this.requestedServices[i].isRequired && this.requestedServices[i].ValueString === 'Did not provide') {
          showAlert = true;
          break;
        }
      }

      if (showAlert) {
        let dialogAns: boolean;

        await this.dialogHelper.confirmAlert('Your required tasks were not completed, do you want to continue?',
        'Required Tasks', 'Yes', 'No').then(ans => {
          dialogAns = ans;
        });

        if (!dialogAns) {
          this.scrollview.nativeElement.scrollToVerticalOffset(0, true);
          return false;
        }
      }
    }

    if (this.mileage === undefined) {
      this.mileage = 0;
    }

    if (isNaN(this.mileage)) {
      this.errorText = 'Mileage has to be a number.';
      return false;
    }

    // if (this.client.Questions) {
    //     let continueCheckout = true;

    //     for (let i = 0; i < this.client.Questions.length; i++) {
    //         if (this.client.Questions[i].required && !this.client.Questions[i].answer) {
    //             this.client.Questions[i].showError = true;
    //             continueCheckout = false;
    //             this.errorText = 'You have 1 or more errors above';
    //         }
    //     }

    //     return continueCheckout;
    // }
    return true;
  }
}
