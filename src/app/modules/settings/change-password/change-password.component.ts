import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../../../ACCommon/services/validate.service';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { ResetPassForm, LoginForm } from '../../../../ACCommon/models/forms';
import { ToolsHelper, LoadingHelper } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  @Select(AppState.getChangePasswordForm) changePasswordForm$: Observable<LoginForm>;

  @Emitter(AppState.resetPassword)
  public resetPassword: Emittable<ResetPassForm>;

  constructor(private validateService: ValidateService, private toolsHelper: ToolsHelper, private loadingIndicator: LoadingHelper) { }

  private currentPass = '';
  private newPass = '';
  private confirmPass = '';
  private strength = 0;

  public strengthText = '';
  public strengthTextColor = '#e00720';
  public lengthLabelColor = '#6d7278';
  public lettersLabelColor = '#6d7278';
  public numberSymbolLabelColor = '#6d7278';
  public errorText = '';

  public oldPass = '';

  public enableBtn = false;

  ngOnInit() {
    this.changePasswordForm$.pipe(first()).subscribe(changePassForm => {
      this.oldPass = changePassForm.Password;
    });

    this.loadingIndicator.hideIndicator();
  }

  valueChanged(value: string, type: string) {
    this.enableBtn = false;
    if (type === 'current') {
      this.currentPass = value;
    } else if (type === 'new') {
      this.newPass = value;
      this.updateView(value);
    } else {
      this.confirmPass = value;
    }

    if (this.currentPass && this.newPass && this.confirmPass && this.strength === 3) {
      this.enableBtn = true;
    }
  }

  updateView(text: string) {
    const result = this.validateService.validateNewPassword(text);
    this.strength = 0;

    if (result.length) {
      this.strength++;
      this.lengthLabelColor = '#038424';
    } else {
      this.lengthLabelColor = '#6d7278';
    }

    if (result.letters) {
      this.strength++;
      this.lettersLabelColor = '#038424';
    } else {
      this.lettersLabelColor = '#6d7278';
    }

    if (result.numberSymbol) {
      this.strength++;
      this.numberSymbolLabelColor = '#038424';
    } else {
      this.numberSymbolLabelColor = '#6d7278';
    }

    switch (this.strength) {
      case 0:
        this.strengthText = '';
        break;
      case 1:
        this.strengthText = 'Weak';
        this.strengthTextColor = '#e00720';
        break;
      case 2:
        this.strengthText = 'Good';
        this.strengthTextColor = '#593c81';
        break;
      case 3:
        this.strengthText = 'Strong';
        this.strengthTextColor = '#038424';
        break;
    }
  }

  confirmTap() {
    this.toolsHelper.closeKeyboard();
    this.errorText = '';

    if (/['"]/g.test(this.newPass)) {
      this.errorText = 'Passwords cannot contain \' or \"';
      return;
    }

    if (this.newPass !== this.confirmPass) {
      this.errorText = 'Your Passwords do not match';
      return;
    }

    const resetForm: ResetPassForm = {
      OldPassword: this.currentPass,
      NewPassword: this.newPass
    };

    this.resetPassword.emit(resetForm);
  }
}
