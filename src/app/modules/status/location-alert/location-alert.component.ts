import { Component, OnInit } from '@angular/core';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { LocationAlertOption, SubmitActionRequest } from '../../../../ACCommon/models';
import { AppState } from '../../../../ACCommon/states';

@Component({
  selector: 'app-location-alert',
  templateUrl: './location-alert.component.html',
  styleUrls: ['./location-alert.component.scss']
})
export class LocationAlertComponent implements OnInit {

  @Select(AppState.getLocationAlertOptions) options$: Observable<LocationAlertOption[]>;
  @Select(AppState.getCurrentSubmitActionRequest) currentSubmitAction$: Observable<SubmitActionRequest>;

  @Emitter(AppState.submitAction)
  public submitAction: Emittable<SubmitActionRequest>;

  constructor() {}

  public reason = '';

  public showTextField: number[] = [];
  public selectedOptions: number[] = [];

  public errorText = '';
  public noOptionSelectedError = false;
  public noReasonError = false;

  ngOnInit() {}

  checkTap(option: LocationAlertOption, checked: boolean) {
    if (this.noOptionSelectedError) {
      this.noOptionSelectedError = false;
      this.errorText = '';
    }

    if (checked && option.commentRequired) {
      this.showTextField.push(option.id);
    } else if (!checked && option.commentRequired) {
      const index = this.showTextField.findIndex(num => num === option.id);
      if (index > -1) {
        this.showTextField.splice(index, 1);
      }
    }

    if (checked) {
      this.selectedOptions.push(option.id);
    } else {
      const index = this.selectedOptions.findIndex(num => num === option.id);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
  }

  onTextChange(args: any) {
    if (this.noReasonError) {
      this.noReasonError = false;
      this.errorText = '';
    }
    this.reason = args.value;
  }

  continueTap() {
    if (this.selectedOptions.length === 0) {
      this.noOptionSelectedError = true;
      this.errorText = 'Please select at least one option from above.';
      return;
    }

    if (this.showTextField.length > 0 && !this.reason) {
      this.noReasonError = true;
      this.errorText = 'Please give a reason on the selected answer.';
      return;
    }

    this.currentSubmitAction$.pipe(first()).subscribe(currentSA => {
      currentSA.visit.GeofencingEventOptions = this.selectedOptions;
      if (this.reason) {
        currentSA.visit.GeofencingEventCause = this.reason;
      }

      if (currentSA.visit2) {
        currentSA.visit2.GeofencingEventOptions = currentSA.visit.GeofencingEventOptions;
        currentSA.visit2.GeofencingEventCause = currentSA.visit.GeofencingEventCause;
      }

      this.submitAction.emit(currentSA);
    });
  }
}
