import { Component, OnInit } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

import { AppState } from '../../../../ACCommon/states/app.state';
import { ValidateService } from '../../../../ACCommon/services/validate.service';


@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

    @Emitter(AppState.forgotPassword)
    public forgotPassword: Emittable<string>;

    constructor(public validateService: ValidateService) { }

    public email = '';
    public showError = false;
    public errorText = '';

    ngOnInit(): void { }

    public onForgotPasswordTap() {
        this.showError = false;
        if (this.validateInputs()) {
            this.forgotPassword.emit(this.email);
        }
    }

    validateInputs(): boolean {
        if (this.email === '') {
            this.showError = true;
            this.errorText = 'Please enter an email.';
            return;
        }
        if (!this.validateService.validateEmail(this.email)) {
            this.showError = true;
            this.errorText = 'Please enter a valid email.';
            return;
        }

        return true;
    }

    valueChanged(value: string) {
        this.email = value;
    }
}
