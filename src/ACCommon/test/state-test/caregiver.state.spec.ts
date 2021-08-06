import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { AppState } from '../../states/app.state';
import { EmitterService } from '@ngxs-labs/emitter';
import { AuthService } from '../../services/data/auth.service';
import { StoreTestBedModule } from '@ngxs-labs/emitter/testing';
import { FakeAuthService } from '../services-fake/auth.service.test';
import { LoginForm } from '../../models/forms/login-form.model';
import { ThemeType } from '../../enums/theme.enum';

describe('AppState', () => {
    let store: Store;
    let emitter: EmitterService;
    let service: FakeAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ StoreTestBedModule.configureTestingModule([AppState]) ],
            providers: [
                {
                    provide: AuthService,
                    useClass: FakeAuthService,
                    multi: true
                },
            ]
        });
        store = TestBed.get(Store);
        emitter = TestBed.get(EmitterService);
        service = new FakeAuthService;
    });

    it('should update deviceType and give deviceType of iOS', () => {
        // emitter.action(AppState.setDeviceType).emit('iOS');

        store.selectOnce(state => state.caregiverData.deviceType).subscribe(type => {
            expect(type).toBe('iOS');
        });
    });

    it('should update theme and give theme of Payroll', () => {
        emitter.action(AppState.setTheme).emit(ThemeType.Payroll);

        store.selectOnce(state => state.caregiverData.theme).subscribe(theme => {
            expect(theme).toBe(ThemeType.Payroll);
        });
    });

    it('should update caregiver and give isAuth is true', () => {
        const loginForm: LoginForm = { Email: 'test@email.com', Password: 'Password', rememberEmail: false };

        AppState.authService = service as AuthService;
        emitter.action(AppState.attemptLogin).emit(loginForm);

        store.selectOnce(state => state.caregiverData.isAuth).subscribe(auth => {
            expect(auth).toBeTruthy();
        });
    });

    it('should update caregiver and give caregiver', () => {
        const loginForm: LoginForm = { Email: 'test@email.com', Password: 'Password', rememberEmail: false };

        AppState.authService = service as AuthService;
        emitter.action(AppState.attemptLogin).emit(loginForm);

        store.selectOnce(state => state.caregiverData.caregiver).subscribe(caregiver => {
            expect(caregiver).toBeTruthy();
        });
    });

    it('should fail login and update error', () => {
        const loginForm: LoginForm = { Email: 'fail@email.com', Password: 'Fail', rememberEmail: false };

        AppState.authService = service as AuthService;
        emitter.action(AppState.attemptLogin).emit(loginForm);

        store.selectOnce(state => state.caregiverData.error).subscribe(caregiver => {},
            error => {
            expect(error).toContain('Failed login');
        });
    });
});


