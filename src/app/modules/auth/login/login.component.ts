import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { first } from 'rxjs/operators';

import { AppState } from '../../../../ACCommon/states/app.state';
import { LoginForm } from '../../../../ACCommon/models/forms/login-form.model';
import { ThemeType } from '../../../../ACCommon/enums/theme.enum';
import { SwitchHelper, ToolsHelper, DialogHelper, ModalHelper, RedirectHelper } from '../../../../ACCommon/helpers';
import { ValidateService } from '../../../../ACCommon/services/validate.service';
import { LocalStorageService } from '../../../../ACCommon/storage/local-storage';
import { FingerprintService } from '../../../../ACCommon/services/fingerprint.service';
import { TouchIdTermsComponent } from '../touch-id-terms/touch-id-terms.component';
import { currentEnvironment, updateEnvironmentAndEndpoint } from '../../../../ACCommon/config/app-config.module';


@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {

    @Select(AppState.getIsAuth) auth$: Observable<boolean>;
    @Select(AppState.getTheme) theme$: Observable<ThemeType>;
    @Select(AppState.getError) error$: Observable<string>;

    @Emitter(AppState.setDefaultTheme)
    public setDefaultTheme: Emittable<null>;

    @Emitter(AppState.attemptLogin)
    public login: Emittable<LoginForm>;

    @Emitter(AppState.setTheme)
    public setTheme: Emittable<ThemeType>;

    constructor(public switchHelper: SwitchHelper, public validateService: ValidateService,
                private fingerprintService: FingerprintService, private toolsHelper: ToolsHelper, private dialogHelper: DialogHelper,
                private modalHelper: ModalHelper, private vcRef: ViewContainerRef, private redirectHelper: RedirectHelper) {}

    public remembereEmailText = '';
    public showError = false;
    public errorText = '';

    private email = '';
    private password = '';
    public rememberEmail = false;
    public fingerprintEnabled = false;
    public fingerprintString = '';

    public currentEnvironment = '';

    ngOnInit(): void {
        this.currentEnvironment = currentEnvironment;
        this.setDefaultTheme.emit(null);

        const email = LocalStorageService.getEmail();
        if (email) {
            this.rememberEmail = true;
            this.email = email;
            this.remembereEmailText = email;
        }

        if (this.fingerprintService.isFingerprintEnabled()) {
            this.fingerprintEnabled = true;
            setTimeout(() => {
                this.fingerprintService.verifyFingerprint();
            }, 500);
        }

        this.fingerprintService.fingerprintStringType().then(type => {
            this.fingerprintString = type;
        });
    }

    valueChanged(value: string, type: string) {
        if (type === 'email') {
            this.email = value;
        } else {
            this.password = value;
        }
    }

    fingerprintTap() {
        this.fingerprintEnabled = !this.fingerprintEnabled;
        if (this.fingerprintEnabled) {
            this.modalHelper.openFullscreenModal(TouchIdTermsComponent, this.vcRef).then((res: string) => {
                if (res === 'accept') {
                    this.fingerprintService.loginFingerprintSetup().then(() => {
                        this.dialogHelper.alert(`Please finish logging in to complete the ${this.fingerprintString} setup.`,
                        `${this.fingerprintString} Enabled!`);
                    }).catch(e => {
                        this.fingerprintEnabled = false;
                        console.log(e);
                    });
                } else {
                    this.fingerprintEnabled = false;
                }
            });
        } else {
            this.fingerprintService.removeFingerprint();
        }
    }

    onCheckedChange(args: any) {
        this.rememberEmail = this.switchHelper.switch(args);
    }

    onLoginClick() {
        this.toolsHelper.closeKeyboard();
        this.showError = false;
        if (this.validateInputs()) {
            const loginForm = {
                Email: this.email,
                Password: this.password,
                rememberEmail: this.rememberEmail
            };

            if (this.rememberEmail) {
                LocalStorageService.setEmail(this.email);
            } else {
                LocalStorageService.setEmail('');
            }

            this.login.emit(loginForm);
        }
    }

    validateInputs(): boolean {
        if (this.email === '') {
            this.showError = true;
            this.errorText = 'Please enter an email and password.';
            return false;
        }
        if (!this.validateService.validateEmail(this.email)) {
            this.showError = true;
            this.errorText = 'Please enter a valid email.';
            return false;
        }
        if (!this.validateService.validatePassword(this.password)) {
            this.showError = true;
            this.errorText = 'Password has to be 6 or more characters.';
            return false;
        }

        return true;
    }

    changeTheme() {
        this.theme$.pipe(first()).subscribe(theme => {
            if (theme === ThemeType.Fastpay) {
                this.setTheme.emit(ThemeType.Payroll);
            } else {
                this.setTheme.emit(ThemeType.Fastpay);
            }
        });
    }

    changeEnvironment() {
        this.dialogHelper.genericActionDialog(['Dev', 'Integration', 'Release1'], 'Choose Environment').then(result => {
            if (result !== 'Cancel') {
                updateEnvironmentAndEndpoint(result);
                this.currentEnvironment = result;
                LocalStorageService.setEnvironment(result);
            }
        });
    }

    termsTap() {
        this.redirectHelper.openTermsOfUseWebpage();
    }
}

