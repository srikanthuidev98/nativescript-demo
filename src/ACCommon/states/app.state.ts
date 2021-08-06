import { State, Selector, StateContext } from '@ngxs/store';
import { Injector } from '@angular/core';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { AuthService } from '../services/data/auth.service';
import { LoginForm, ResetPassForm } from '../models/forms';
import { first } from 'rxjs/operators';
import { LocalStorageService } from '../storage/local-storage';
import { ThemeType, SubmitActionType, DisplayType } from '../enums';
import { LoadingHelper } from '../helpers/loading.helper';
import { Client, Profile, ClientPayroll, Visit, Payroll, ADL, IADL, Caregiver, EditVisit, DualClient,
    createDefaultIADLs, Schedule, Message, MessageRecipient, DialogData, AddionialQuestionsStateObject,
    TimecardSubmitRequest, SubmitActionRequest, LastVisit, compareVisits, convertTimecardRequestToVisit,
    LocationAlertOption } from '../models';
import { ClientService } from '../services/data/client.service';
import { ProfileService } from '../services/data/profile.service';
import { DialogHelper } from '../helpers';
import { FileStorageService } from '../storage/file-storage';
import { PushToken } from '../models/push-token.model';
import { ApiHelperService } from '../services/data/api-helper.service';
import { LoggingService } from '../services/logging.service';
import { DateService } from '../services/date.service';
import { customSort } from '../helpers/sort.helper';
import { HistoryService } from '../services/data/history.service';
import { ShiftService } from '../services/data/shift.service';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { TimerService } from '../services/timer.service';
import { ScheduleService } from '../services/data/schedule.service';
import { MessageService } from '../services/data/message.service';
import { getVersionName } from 'nativescript-appversion';
import { AddCalendarEvents } from '../services/calendar.service';
import * as nsCalendar from 'nativescript-calendar';

export interface AppStateModel {
    // Caregiver varibles
    caregiver: Caregiver;
    isAuth: boolean;
    clients: Client[];
    error: string;
    theme: ThemeType;
    profileInfo: Profile;
    pushToken: string;
    changePasswordForm: LoginForm;

    // History varibles
    historyClient: Client;
    currentClientPayrolls: ClientPayroll[];
    clientPayrolls: ClientPayroll[];
    visits: Visit[];
    selectedPayroll: Payroll;
    selectedVisit: Visit;
    adlKeys: ADL[];
    iadlKeys: IADL[];
    editVisit: EditVisit[];

    // Shift / Visit variables
    currentClient: Client;
    currentDualClient: DualClient;
    currentVisit: Visit;
    currentSubmitActionRequest: SubmitActionRequest;
    reminderDate: Date;
    visitsToSync: TimecardSubmitRequest[];
    tryingToSync: boolean;
    lastVisit: LastVisit;
    editShift: SubmitActionRequest;
    additionalAnswersToSync: AddionialQuestionsStateObject[];
    tryingToSyncAdditionalAnswers: boolean;
    locationAlertOptions: LocationAlertOption[];

    // Schedule variables
    currentSchedule: Schedule;
    calendarSchedule: Schedule;
    syncCalendar: { shouldSync: boolean, dateCalled: Date, schedule: Schedule };

    // Messaging variables
    messageRecipients: MessageRecipient[];
    messageThreads: Message[];
    unreadMessages: number;
    messages: Message[];

    // Taxonomy Switches
    scheduleEnabled: boolean;
    messagingEnabled: boolean;

    currentVersionDialogData: DialogData;
    loading: boolean;
}

@State<AppStateModel>({
    name: 'appData',
    defaults: {
        caregiver: undefined,
        isAuth: false,
        clients: [],
        error: '',
        theme: ThemeType.Fastpay,
        profileInfo: undefined,
        pushToken: '',
        changePasswordForm: undefined,

        historyClient: undefined,
        currentClientPayrolls: [],
        clientPayrolls: [],
        visits: [],
        selectedPayroll: undefined,
        selectedVisit: undefined,
        adlKeys: undefined,
        iadlKeys: undefined,
        editVisit: undefined,

        currentClient: undefined,
        currentDualClient: undefined,
        currentVisit: undefined,
        currentSubmitActionRequest: undefined,
        reminderDate: undefined,
        visitsToSync: [],
        tryingToSync: false,
        lastVisit: undefined,
        editShift: undefined,
        additionalAnswersToSync: [],
        tryingToSyncAdditionalAnswers: false,
        locationAlertOptions: [],

        currentSchedule: undefined,
        calendarSchedule: undefined,
        syncCalendar: { shouldSync: false, dateCalled: undefined, schedule: undefined },

        messageRecipients: [],
        messageThreads: [],
        unreadMessages: 0,
        messages: [],

        scheduleEnabled: false,
        messagingEnabled: false,

        currentVersionDialogData: undefined,
        loading: false
    },
})

export class AppState {
    private static authService: AuthService;
    private static clientService: ClientService;
    private static profileService: ProfileService;
    private static historyService: HistoryService;
    private static scheduleService: ScheduleService;
    private static messageService: MessageService;
    private static shiftService: ShiftService;
    private static timerService: TimerService;
    private static loadingIndicator: LoadingHelper;
    private static dialoghelper: DialogHelper;
    private static apiHelper: ApiHelperService;
    private static logger: LoggingService;

    private static appVersion: string;

    constructor(injector: Injector) {
        AppState.authService = injector.get<AuthService>(AuthService);
        AppState.clientService = injector.get<ClientService>(ClientService);
        AppState.profileService = injector.get<ProfileService>(ProfileService);
        AppState.historyService = injector.get<HistoryService>(HistoryService);
        AppState.scheduleService = injector.get<ScheduleService>(ScheduleService);
        AppState.messageService = injector.get<MessageService>(MessageService);
        AppState.shiftService = injector.get<ShiftService>(ShiftService);
        AppState.timerService = injector.get<TimerService>(TimerService);
        AppState.loadingIndicator = injector.get<LoadingHelper>(LoadingHelper);
        AppState.dialoghelper = injector.get<DialogHelper>(DialogHelper);
        AppState.apiHelper = injector.get<ApiHelperService>(ApiHelperService);
        AppState.logger = injector.get<LoggingService>(LoggingService);

        getVersionName().then((version: string) => {
            AppState.appVersion = version;
        });
    }

    @Selector()
    public static getCaregiver(state: AppStateModel) { return state.caregiver; }

    @Selector()
    public static getIsAuth(state: AppStateModel) { return state.isAuth; }

    @Selector()
    public static getClients(state: AppStateModel) { return state.clients; }

    @Selector()
    public static getError(state: AppStateModel) { return state.error; }

    @Selector()
    public static getTheme(state: AppStateModel) { return state.theme; }

    @Selector()
    public static getProfileInfo(state: AppStateModel) { return state.profileInfo; }

    @Selector()
    public static getPushToken(state: AppStateModel) { return state.pushToken; }

    @Selector()
    public static getChangePasswordForm(state: AppStateModel) { return state.changePasswordForm; }

    @Selector()
    public static getScheduleEnabled(state: AppStateModel) { return state.scheduleEnabled; }

    @Selector()
    public static getMessagingEnabled(state: AppStateModel) { return state.messagingEnabled; }

    @Selector()
    public static getClientPayrolls(state: AppStateModel) { return state.clientPayrolls; }

    @Selector()
    public static getCurrentClientPayrolls(state: AppStateModel) { return state.currentClientPayrolls; }

    @Selector()
    public static getSelectedPayroll(state: AppStateModel) { return state.selectedPayroll; }

    @Selector()
    public static getSelectedVisit(state: AppStateModel) { return state.selectedVisit; }

    @Selector()
    public static getVisits(state: AppStateModel) { return state.visits; }

    @Selector()
    public static getADLKeys(state: AppStateModel) { return state.adlKeys; }

    @Selector()
    public static getIADLKeys(state: AppStateModel) { return state.iadlKeys; }

    @Selector()
    public static getHistoryClient(state: AppStateModel) { return state.historyClient; }

    @Selector()
    public static getEditVisit(state: AppStateModel) { return state.editVisit; }

    @Selector()
    public static getLoading(state: AppStateModel) { return state.loading; }

    @Selector()
    public static getCurrentClient(state: AppStateModel) { return state.currentClient; }

    @Selector()
    public static getCurrentDualClient(state: AppStateModel) { return state.currentDualClient; }

    @Selector()
    public static getCurrentVisit(state: AppStateModel) { return state.currentVisit; }

    @Selector()
    public static getCurrentSubmitActionRequest(state: AppStateModel) { return state.currentSubmitActionRequest; }

    @Selector()
    public static getReminderDate(state: AppStateModel) { return state.reminderDate; }

    @Selector()
    public static getVisitsToSync(state: AppStateModel) { return state.visitsToSync; }

    @Selector()
    public static getEditShift(state: AppStateModel) { return state.editShift; }

    @Selector()
    public static getSavedLastVisit(state: AppStateModel) { return state.lastVisit; }

    @Selector()
    public static getCurrentSchedule(state: AppStateModel) { return state.currentSchedule; }

    @Selector()
    public static getCalendarSchedule(state: AppStateModel) { return state.calendarSchedule; }

    @Selector()
    public static getSyncSchedule(state: AppStateModel) { return state.syncCalendar; }

    @Selector()
    public static getMessageRecipients(state: AppStateModel) { return state.messageRecipients; }

    @Selector()
    public static getMessageThreads(state: AppStateModel) { return state.messageThreads; }

    @Selector()
    public static getMessages(state: AppStateModel) { return state.messages; }

    @Selector()
    public static getUnreadMessages(state: AppStateModel) { return state.unreadMessages; }

    @Selector()
    public static getCurrentVersionDialogData(state: AppStateModel) { return state.currentVersionDialogData; }

    @Selector()
    public static getLocationAlertOptions(state: AppStateModel) { return state.locationAlertOptions; }

    @Receiver()
    public static async setCurrentClient(ctx: StateContext<AppStateModel>, action: EmitterAction<Client>) {
        ctx.patchState({
            currentClient: action.payload
        });
    }

    @Receiver()
    public static async setCurrentDualClient(ctx: StateContext<AppStateModel>, action: EmitterAction<DualClient>) {
        ctx.patchState({
            currentDualClient: action.payload
        });
        LocalStorageService.setAppState(ctx.getState());
    }

    /**
     * This method is used to try to log the caregiver in.
     * If successful, this will also save the caregiver to the local DB.
     * If an error occures, please use AppState.getError, to get the error that happened.
     */
    @Receiver()
    public static async attemptLogin(ctx: StateContext<AppStateModel>, action: EmitterAction<LoginForm>) {
        this.loadingIndicator.showIndicator();
        this.authService.login(action.payload).pipe(first()).subscribe(resData => {
            const fingerprintData = LocalStorageService.getFingerprintData();

            console.log('Authentication Token: ' + resData.Token);
            if (!resData.Token) {
                console.log('Token is empty, need to reset password.');
                console.log('Current Caregiver Email: ' + action.payload.Email );
                ctx.patchState({
                    caregiver: resData,
                    isAuth: false,
                    changePasswordForm: action.payload,
                });
                LocalStorageService.setAppState(ctx.getState());
            } else {
                if (fingerprintData && fingerprintData.Name === 'temp') {
                    LocalStorageService.setFingerprintData(resData);
                    this.logger.trackEvent('Fingerprint', 'Enabled');
                }
                ctx.patchState({
                    caregiver: resData,
                    isAuth: true
                });
                LocalStorageService.setAppState(ctx.getState());
                this.logger.trackEvent('Login', 'Successful', true);
                console.log('Attempt Login Success');
            }
        }, (error) => {
            this.apiHelper.handleHttpError('attemptLogin', error);
            ctx.patchState({
                error: this.getErrorString(error.status)
            });
            this.loadingIndicator.hideIndicator();
        });
    }

    /**
     * This method is used to log into the app if fingerprint was set up.
     */
    @Receiver()
    public static async fingerprintLogin(ctx: StateContext<AppStateModel>) {
        const fingerprintData = LocalStorageService.getFingerprintData();
        this.loadingIndicator.showIndicator();

        this.authService.getAuthorizationStatus(fingerprintData.Token).pipe(first()).subscribe(resData => {

            if (fingerprintData) {
                ctx.patchState({
                    caregiver: fingerprintData,
                    isAuth: true
                });

                LocalStorageService.setAppState(ctx.getState());
                this.logger.trackEvent('Login - Fingerprint', 'Successful', true);
            } else {
                console.log('ERROR: No fingerprint Data to load.');
            }
        }, error => {
            this.apiHelper.handleHttpError('fingerprintLogin', error);
        });
    }

    /**
     * Will reset their password with a new Password.
     * The state will also refresh the caregiver object.
     *
     * @param action - ResetPassForm
     */
    @Receiver()
    public static async resetPassword(ctx: StateContext<AppStateModel>, action: EmitterAction<ResetPassForm>) {
        const token = ctx.getState().caregiver.Token;
        const changePassForm = ctx.getState().changePasswordForm;
        let email: string;

        if (!changePassForm) {
            console.log('User is logged in');
            email = ctx.getState().profileInfo.Email;
        } else {
            console.log('Came from forgot password');
            email = changePassForm.Email;
        }

        console.log('Password Reset Email: ' + email);

        this.authService.resetPassword(token, email, action.payload).pipe(first()).subscribe(resData => {
            ctx.patchState({
                caregiver: resData,
                changePasswordForm: undefined,
                isAuth: true
            });

            LocalStorageService.setAppState(ctx.getState());

            this.logger.trackEvent('Password Reset', 'Successful');
            setTimeout(() => {
                this.dialoghelper.alert('Your password has been changed!', 'Success!', 'OK');
            }, 1000);
        },
        (error) => {
            this.apiHelper.handleHttpError('resetPassword', error);
            ctx.patchState({
                error: this.getErrorString(error.status)
            });
            this.logger.trackEvent('Password Reset', 'Failed');
            this.dialoghelper.alert('Current password was incorrect. Please try again.', 'Incorrect Password', 'OK');
        });
    }

    /**
     * Will send an email to the user if they forgot their password.
     *
     * @param action - Email string
     */
    @Receiver()
    public static async forgotPassword(ctx: StateContext<AppStateModel>, action: EmitterAction<string>) {
        this.authService.recoverPassword(action.payload).pipe(first()).subscribe(() => {
                this.dialoghelper.alert('Password has been sent to your email!');
            },
            (error) => {
                this.apiHelper.handleHttpError('forgotPassword', error);
                ctx.patchState({
                    error: this.getErrorString(error.status)
                });
                this.logger.trackEvent('Forgot Password', 'Successful');
            });
    }

    @Receiver()
    public static async uploadPushToken(ctx: StateContext<AppStateModel>, action: EmitterAction<PushToken>) {
        const token = ctx.getState().caregiver.Token;
        this.authService.uploadPushToken(action.payload, token).subscribe( response => {
            console.log('Upload push token response: ' + response);
            ctx.patchState({
                pushToken: action.payload.PushToken
            });
            LocalStorageService.setAppState(ctx.getState());
            this.logger.trackEvent('Upload Push Token', 'Successful');
        }, (error) => {
            this.apiHelper.handleHttpError('uploadPushToken', error);
        });
    }

    @Receiver()
    public static async deletePushToken(ctx: StateContext<AppStateModel>, action: EmitterAction<PushToken>) {
        const token = ctx.getState().caregiver.Token;
        this.authService.deletePushToken(action.payload, token).subscribe( response => {
            console.log('Delete push token response: ' + response);
            ctx.patchState({
                pushToken: ''
            });
            LocalStorageService.setAppState(ctx.getState());
            this.logger.trackEvent('Delete Push Token', 'Successful');
        }, (error) => {
            this.apiHelper.handleHttpError('deletePushToken', error);
        });
    }

    @Receiver()
    public static async isTokenExpired(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;

        if (!caregiver || !caregiver.APIToken) {
            console.log('Caregiver doesnt exisit. Logging out user.');
            this.logout(ctx);
            return;
        }

        if (DateService.durationBetweenDates(new Date(), caregiver.Expires, 'asHours') > 3) {
            console.log('More than 3 hours. Dont do anything');
            return;
        }

        this.apiHelper.apiRefreshToken(caregiver).subscribe(res => {
            ctx.patchState({
                caregiver: res
            });

            LocalStorageService.setAppState(ctx.getState());
            this.logger.trackEvent('Token Refreshed', 'Successful');
        }, (error) => {
            this.apiHelper.handleHttpError('isTokenExpired', error);
        });
    }


    /**
     * Gets the Authorization Status for user that is logged in.
     */
    @Receiver()
    public static async getAuthorizationStatus(ctx: StateContext<AppStateModel>) {
        const token = ctx.getState().caregiver.Token;
        this.authService.getAuthorizationStatus(token).pipe(first()).subscribe(resData => {
                // TODO something with auth Status.
                console.log('Get Authorization Status: ' + resData);
            },
            (error) => {
                this.apiHelper.handleHttpError('getAuthorizationStatus', error);
            });
    }

    /**
     * Used to get Clients from DB.
     *
     * @param action - boolean to see if getLastVisits needs to be ran.
     *
     * the action should only be ture on inital login.
     */
    @Receiver()
    public static getClientsFromDb(ctx: StateContext<AppStateModel>, action: EmitterAction<boolean> ) {
        const caregiver = ctx.getState().caregiver;

        ctx.patchState({ loading: true });

        this.clientService.apiGetClients(caregiver.APIToken, caregiver.Id).pipe(first()).subscribe(resData => {
            const clients = resData;
            let scheduleEnabled = false;
            let messagingEnabled = false;

            for (let i = 0; i < clients.length; i++) {
                clients[i].showLocationAlert = false; // TODO - Remove when real data is coming from API
                clients[i].showFinancialInfo = true; // TODO - Remove when real data is coming from API
                clients[i].showScheduler = false; // TODO - Remove when real data is coming from API
                clients[i].showEditShift = true; // TODO - Remove when real data is coming from API
                if (!scheduleEnabled) {
                    if (clients[i].ScheduleEnabled) {
                        scheduleEnabled = true;
                    }
                }
                if (!messagingEnabled) {
                    if (clients[i].MessagingEnabled) {
                        messagingEnabled = true;
                    }
                }
                clients[i].askCheckInQuestions = false;
                clients[i].askCheckOutQuestions = false;
                if (clients[i].Questions && clients[i].Questions.length > 0 &&
                        (!clients[i].askCheckInQuestions || !clients[i].askCheckOutQuestions)) {
                    clients[i].Questions.forEach(question => {
                        if (!clients[i].askCheckInQuestions && question.displayType === DisplayType.CheckIn) {
                            clients[i].askCheckInQuestions = true;
                        } else if (!clients[i].askCheckOutQuestions && question.displayType === DisplayType.CheckOut) {
                            clients[i].askCheckOutQuestions = true;
                        } else if (question.displayType === DisplayType.Both) {
                            clients[i].askCheckInQuestions = true;
                            clients[i].askCheckOutQuestions = true;
                        }
                    });
                }
            }

            ctx.patchState({
                clients: clients,
                scheduleEnabled: scheduleEnabled,
                messagingEnabled: messagingEnabled,
                loading: false
            });
            LocalStorageService.setAppState(ctx.getState());
            this.logger.trackEvent('Updated Clients', 'Successful');

            if (scheduleEnabled) {
                AppState.getScheduleFromDb(ctx, new EmitterAction(null));
            }

            if (action.payload) {
                AppState.getLastVisitFromDB(ctx);

                if (scheduleEnabled && !ctx.getState().syncCalendar.shouldSync) {
                    nsCalendar.hasPermission().then(permission => {
                        if (permission) {
                            nsCalendar.listCalendars().then(calendars => {
                                const assuricareCal = calendars.find(cal => cal.name === 'AssuriCare');
                                if (assuricareCal) {
                                    AppState.updateCalendarSync(ctx, new EmitterAction(true));
                                }
                            });
                        }
                    });
                }
            }
        },
        (error) => {
            ctx.patchState({ loading: false });
            this.handleNewApiError('getClientsFromDb', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static getScheduleFromDb(ctx: StateContext<AppStateModel>, action: EmitterAction<{ from?: Date, to?: Date }>) {
        const caregiver = ctx.getState().caregiver;
        const scheduleEnabled = ctx.getState().scheduleEnabled;

        if (!scheduleEnabled) {
            console.log('Caregiver doesnt have any clients with schedule.');
            return;
        }

        ctx.patchState({ loading: true });

        let from = new Date();
        let to = new Date();

        if (!action.payload) {
            from.setDate(from.getDate() - 1);
            from.setHours(0);
            from.setMinutes(0);
            to.setMonth(from.getMonth() + 1);
        } else {
            from = action.payload.from;
            to = action.payload.to;
        }

        this.scheduleService.apiGetSchedule(caregiver.APIToken, caregiver.Id, from, to).pipe(first()).subscribe(resData => {

            const uniqueIds = [];
            const clients = ctx.getState().clients;

            // Finding all unique clients and updating the model with the services from RC.
            for (let i = 0; i < resData.visits.length; i++) {
                const found = uniqueIds.find(id => id === resData.visits[i].ltcClientId);

                if (!found) {
                    uniqueIds.push(resData.visits[i].ltcClientId);
                    const clientIndex = clients.findIndex((client => client.Id === +resData.visits[i].ltcClientId));
                    if (clientIndex !== -1) {
                        clients[clientIndex].ScheduleServices = resData.visits[i].tasks;
                    }
                }
            }

            if (!action.payload) {
                ctx.patchState({
                    clients: clients,
                    currentSchedule: resData,
                    loading: false
                });
            } else {
                ctx.patchState({
                    clients: clients,
                    calendarSchedule: resData,
                    loading: false
                });
            }

            LocalStorageService.setAppState(ctx.getState());
            this.logger.trackEvent('Updated Schedule', 'Successful');
        },
        (error) => {
            ctx.patchState({ loading: false });
            this.handleNewApiError('getScheduleFromDb', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static updateCalendarSync(ctx: StateContext<AppStateModel>, action: EmitterAction<boolean>) {
        const scheduleEnabled = ctx.getState().scheduleEnabled;

        if (action.payload && scheduleEnabled) {
            ctx.patchState({
                syncCalendar: { shouldSync: true, dateCalled: undefined, schedule: undefined }
            });
        } else {
            ctx.patchState({
                syncCalendar: { shouldSync: false, dateCalled: undefined, schedule: undefined }
            });
        }
        LocalStorageService.setAppState(ctx.getState());

        if (action.payload && scheduleEnabled) {
            AppState.getSyncScheduleFromDb(ctx);
        }
    }

    @Receiver()
    public static getSyncScheduleFromDb(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        const scheduleEnabled = ctx.getState().scheduleEnabled;
        const syncSchedule = ctx.getState().syncCalendar;

        if (!scheduleEnabled || !syncSchedule.shouldSync) {
            console.log('Dont sync');
            return;
        }

        const from = new Date();
        const to = DateService.add(from, 30, 'day').toDate();

        if (syncSchedule.dateCalled && DateService.durationBetweenDates(from, syncSchedule.dateCalled, 'asHours') < 24 ) {
            console.log('Less than 24 hours since last sync.');
            return;
        }

        this.scheduleService.apiGetSchedule(caregiver.APIToken, caregiver.Id, from, to).pipe(first()).subscribe(resData => {
            nsCalendar.deleteEvents({ startDate: from, endDate: to, title: 'AssuriCare Visit with ' }).then(deletedEventsId => {
                console.log(deletedEventsId.length, 'events have been deleted.');

                AddCalendarEvents(resData.visits, deletedEventsId.length === 0);

                ctx.patchState({
                    syncCalendar: { shouldSync: true, dateCalled: from, schedule: resData }
                });
                LocalStorageService.setAppState(ctx.getState());
            });
            this.logger.trackEvent('Updated Sync Schedule', 'Successful');
        },
        (error) => {
            this.handleNewApiError('getSyncScheduleFromDb', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static pullMessageRecipients(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;

        this.messageService.apiGetMessageRecipients(caregiver.APIToken, caregiver.Id).pipe(first()).subscribe(resData => {

            ctx.patchState({
                messageRecipients: resData,
            });

            this.logger.trackEvent('Pulled Message Recipients', 'Successful');
        },
        (error) => {
            this.handleNewApiError('pullMessageRecipients', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static pullMessageThreads(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;

        ctx.patchState({ loading: true });

        this.messageService.apiGetMessageThreads(caregiver.APIToken, caregiver.Id).pipe(first()).subscribe(resData => {

            let unreadMessages = 0;

            resData.forEach(thread => {
                unreadMessages += thread.unreadMessageCount;
            });

            ctx.patchState({
                messageThreads: resData,
                unreadMessages: unreadMessages,
                loading: false
            });

            this.logger.trackEvent('Pulled Message Threads', 'Successful');
        },
        (error) => {
            ctx.patchState({ loading: false });
            this.handleNewApiError('pullMessageThreads', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static pullMessages(ctx: StateContext<AppStateModel>, action: EmitterAction<number>) {
        const caregiver = ctx.getState().caregiver;

        if (action.payload === null) {
            ctx.patchState({
                messages: []
            });

            return;
        }

        ctx.patchState({ loading: true });

        this.messageService.apiGetMessages(caregiver.APIToken, caregiver.Id, action.payload).pipe(first()).subscribe(resData => {

            const threads = ctx.getState().messageThreads;
            let unreadMessages = 0;

            threads.forEach(thread => {
                if (thread.cwParentMessageId === action.payload) {
                    thread.unreadMessageCount = 0;
                }
                unreadMessages += thread.unreadMessageCount;
            });

            ctx.patchState({
                messageThreads: threads,
                unreadMessages: unreadMessages,
                messages: resData,
                loading: false
            });

            this.logger.trackEvent(`Pulled Messages for ${action.payload}`, 'Successful');
        },
        (error) => {
            ctx.patchState({ loading: false });
            this.handleNewApiError('pullMessages', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static replyMessage(ctx: StateContext<AppStateModel>, action: EmitterAction<Message>) {
        const caregiver = ctx.getState().caregiver;

        ctx.patchState({ loading: true });

        this.messageService.apiReply(caregiver.APIToken, action.payload).pipe(first()).subscribe(resData => {
            const messages = ctx.getState().messages;
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].filename) {
                    if (messages[i].filename === resData[i].filename && messages[i].updatedWhen === resData[i].updatedWhen) {
                        if (messages[i].file && messages[i].attachmentSource) {
                            resData[i].file = messages[i].file;
                            resData[i].attachmentSource = messages[i].attachmentSource;
                        }
                    }
                }
            }

            ctx.patchState({
                messages: resData,
                loading: false
            });

            this.logger.trackEvent(`Replyed Message`, 'Successful');
        },
        (error) => {
            this.handleNewApiError('replyMessage', error, caregiver, ctx);
            ctx.patchState({ loading: false });
        });
    }

    @Receiver()
    public static postNewMessageThread(ctx: StateContext<AppStateModel>, action: EmitterAction<Message>) {
        const caregiver = ctx.getState().caregiver;

        ctx.patchState({ loading: true });

        this.messageService.apiPostNewThread(caregiver.APIToken, action.payload).pipe(first()).subscribe(resData => {

            ctx.patchState({
                messages: resData,
                loading: false
            });

            this.logger.trackEvent(`Posted New Thread`, 'Successful');

            AppState.pullMessageThreads(ctx);
        },
        (error) => {
            ctx.patchState({ loading: false });
            this.handleNewApiError('postNewMessageThread', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static deleteThread(ctx: StateContext<AppStateModel>, action: EmitterAction<number>) {
        const caregiver = ctx.getState().caregiver;

        ctx.patchState({ loading: true });

        this.messageService.apiDeleteThread(caregiver.APIToken, caregiver.Id, action.payload).pipe(first()).subscribe(resData => {

            ctx.patchState({
                messageThreads: resData,
                loading: false
            });

            this.logger.trackEvent(`Deleted Thread ${action.payload}`, 'Successful');
        },
        (error) => {
            ctx.patchState({ loading: false });
            this.handleNewApiError('deleteThread', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static checkAppVersion(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        const version = AppState.appVersion;
        const os = isIOS ? 'iOS' : 'Android';

        this.authService.appUpdater(caregiver.APIToken, version, os).pipe(first()).subscribe(resData => {
            if (resData) {
                const dialogData = {
                    title: 'New version available!',
                    message: 'Please click update below to download the new version!',
                    color: '#593c81',
                    // cancelButtonText: 'Not Now',
                    okButtonText: 'Update',
                    cannotCloseDialog: true
                };

                ctx.patchState({
                    currentVersionDialogData: dialogData
                });
            }
        }, error => {
            this.handleNewApiError('checkAppVersion', error, caregiver, ctx);
        });
    }

    @Receiver()
    public static fetchLocationAlertOptionsFromDB(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;

        const resData = this.shiftService.apiLocationAlertOptions(caregiver.APIToken);
        // this.shiftService.apiLocationAlertOptions(caregiver.APIToken).pipe(first()).subscribe(resData => {

            ctx.patchState({
                locationAlertOptions: resData
            });
        // }, error => {
        //     this.handleNewApiError('fetchLocationAlertoptionsFromDB', error, caregiver, ctx);
        // });
    }

    @Receiver()
    public static setDefaultTheme(ctx: StateContext<AppStateModel>) {
        ctx.patchState({
            theme: ThemeType.Fastpay
        });
    }

    @Receiver()
    public static setTheme(ctx: StateContext<AppStateModel>, action: EmitterAction<ThemeType>) {
        ctx.patchState({
            theme: action.payload,
        });
        LocalStorageService.setAppState(ctx.getState());
    }

    /**
     * Method is used to get profile info (Personal, Financial, etc) from Db.
     */
    @Receiver()
    public static setProfileInfo(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        this.profileService.getProfileInfo(caregiver.Token).pipe(first()).subscribe(resData => {
            ctx.patchState({
                profileInfo: resData
            });
            LocalStorageService.setAppState(ctx.getState());
            this.logger.trackEvent('Updated Profile', 'Successful');
        },
        (error) => {
            this.apiHelper.handleHttpError('getProfileInfo', error);
        });
    }

    /**
     * This method will get the profile picture from the Db and save it locally.
     */
    @Receiver()
    public static getProfilePicture(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        this.profileService.getProfilePictureAndSaveLocally(caregiver.Token).then(imageSaved => {
            this.logger.trackEvent('Updated Profile Picture', 'Successful');
        }).catch(error => {
            if (error === 'No Image') {
                console.log('Caregiver does noot have a profile picture.');
            } else {
                this.apiHelper.handleHttpError('getProfilePicture', error);
            }
        });
    }

    @Receiver()
    public static uploadProfilePicture(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        this.profileService.uploadPicture(caregiver.Token).pipe(first()).subscribe(res => {
            if (res.responseCode === 200) {
                console.log(res.data);
                this.logger.trackEvent('Uploaded Profile Picture', 'Successful');
            } else {
                console.log(`uploadProfilePicture Error: ${res.data}
                            Response code: ${res.responseCode}`);
                this.logger.trackEvent('Uploaded Profile Picture', 'Failed');
            }
        }, error => {
            this.apiHelper.handleHttpError('uploadProfilePicture', error);
        });
    }

    /**
     * This method will delete the picture from the Db and delete the picture locally.
     */
    @Receiver()
    public static deleteProfilePicture(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        this.profileService.deletePicture(caregiver.Token).pipe(first()).subscribe(() => {
            FileStorageService.deleteProfilePicture();
            this.logger.trackEvent('Delete Profile Picture', 'Successful');
        }, (error) => {
            this.apiHelper.handleHttpError('deleteProfilePicture', error);
        });
    }

    /**
     * Will pull all clientPayrolls from API, and saves locally into 2 groups.
     *
     * 1. currentClientPayrolls - which is any payroll from this pay period. (Should only be 1)
     * 2. clientPayrolls - which is all other clientPayrolls.
     */
    @Receiver()
    public static async pullPayrollData(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        if (!caregiver) {
            console.log('Token does not exsist');
            return;
        }
        const clients = ctx.getState().clients;
        if (!clients || clients.length === 0) {
            console.log('Clients do not exsist');
            return;
        }

        ctx.patchState({
            loading: true
        });

        const uniqueClientIds: number[] = [];
        const totalclientPayrolls: ClientPayroll[] = [];
        const totalcurrentClientPayrolls: ClientPayroll[] = [];

        for (let i = 0; i < clients.length; i++) {
            if (!uniqueClientIds.includes(clients[i].Id)) {
                uniqueClientIds.push(clients[i].Id);
            }
        }

        let loop = 0; // Using a loop instead of index because the service can return at different times.
        const failed: any[] = []; // Used if one of the calls fails.
        const payrollPromise = new Promise((resolve, reject) => {
            uniqueClientIds.forEach((customerId, i) => {
                this.historyService.apiGetPayroll(caregiver.APIToken, customerId, caregiver.Id)
                .pipe(first()).subscribe((resData) => {
                    const currentClientPayrolls: Payroll[] = [];
                    const clientPayrolls: Payroll[] = [];

                    customSort(resData, 'PeriodStartDate', true);

                    resData.forEach(payroll => {
                        if (new Date(payroll.PayrollDate).getTime() > new Date(Date.now()).getTime()) {
                            currentClientPayrolls.push(payroll);
                        } else {
                            clientPayrolls.push(payroll);
                        }
                    });

                    totalclientPayrolls.push({customerId: customerId, payrolls: clientPayrolls});
                    totalcurrentClientPayrolls.push({customerId: customerId, payrolls: currentClientPayrolls});

                    if (loop === uniqueClientIds.length - 1) {
                        resolve(true);
                    }

                    loop++;
                }, error => {
                    failed.push(error);
                    if (loop === uniqueClientIds.length - 1) {
                        resolve(true);
                    }

                    loop++;
                });
            });
        });

        payrollPromise.then(() => {
            if (failed.length > 0) {
                ctx.patchState({ loading: false });
                this.handleNewApiError('pullPayrollData', failed[0], caregiver, ctx);
            } else {
                ctx.patchState({
                    clientPayrolls: totalclientPayrolls,
                    currentClientPayrolls: totalcurrentClientPayrolls,
                    loading: false
                });

                LocalStorageService.setAppState(ctx.getState());
                this.logger.trackEvent('Updated clientPayrolls', 'Successful');
            }
        });
    }

    /**
     * Update a visit.
     *
     * @param action - EditVisit[]
     */
    @Receiver()
    public static updateVisit(ctx: StateContext<AppStateModel>, action: EmitterAction<EditVisit[]>) {
        const caregiver = ctx.getState().caregiver;
        const lastVisit = ctx.getState().lastVisit;

        let updateLastVisit = false;

        if (!caregiver || !action.payload || !lastVisit) {
            console.log('Not enough data.');
            return;
        }

        this.loadingIndicator.showIndicator();

        const visits = ctx.getState().visits;
        const edittedVisitIndex = ctx.getState().visits.findIndex(v => v.VisitId === action.payload[0].Visit.VisitId);

        if (DateService.checkIfDateStringsAreSame(action.payload[0].Visit.CheckInTime, lastVisit.Visit.CheckInTime)
        && DateService.checkIfDateStringsAreSame(action.payload[0].Visit.CheckOutTime, lastVisit.Visit.CheckOutTime)) {
            console.log('LastVisit and edit visit are the same. Will update LastVisit after response.');
            updateLastVisit = true;
        }

        this.historyService.updateVisit(action.payload, caregiver.APIToken).pipe(first()).subscribe(resData => {
            this.logger.trackEvent('Update Visit', 'Success');

            if (edittedVisitIndex !== -1) {
                ctx.patchState({
                    visits: []
                });
                visits[edittedVisitIndex] = resData;
            }

            if (updateLastVisit) {
                lastVisit.Visit.CheckInTime = action.payload[1].Visit.CheckInTime;
                lastVisit.Visit.CheckOutTime = action.payload[1].Visit.CheckOutTime;

                AppState.setLastVisit(ctx, new EmitterAction(lastVisit));
            }

            ctx.patchState({
                visits: visits,
                selectedVisit: resData,
                editVisit: undefined
            });
            LocalStorageService.setAppState(ctx.getState());
        }, error => {
            this.handleNewApiError('updateVisit', error, caregiver, ctx, action.payload);
        });
    }

    @Receiver()
    public static async pullVisitsData(ctx: StateContext<AppStateModel>, action: EmitterAction<number>) {
        const caregiver = ctx.getState().caregiver;

        // Reset visits data
        ctx.patchState({
            visits: []
        });

        if (!caregiver) {
            console.log('Token does not exsist');
            this.loadingIndicator.hideIndicator();
            return;
        }

        if (!action.payload) {
            console.log('No Payroll Id was sent.');
            this.loadingIndicator.hideIndicator();
            return;
        }

        ctx.patchState({
            visits: [],
            loading: true
        });

        this.historyService.apiGetVisits(caregiver.APIToken, action.payload, createDefaultIADLs(ctx.getState().iadlKeys))
        .pipe(first()).subscribe((resData) => {

            customSort(resData, 'CheckInTime', true);

            this.loadingIndicator.hideIndicator();
            ctx.patchState({
                visits: resData,
                loading: false
            });
        }, error => {
            ctx.patchState({ loading: false });
            this.loadingIndicator.hideIndicator();
            this.handleNewApiError('pullVisitsData', error, caregiver, ctx, action.payload);
        });
    }

    @Receiver()
    public static setSelectedPayroll(ctx: StateContext<AppStateModel>, action: EmitterAction<Payroll>) {
        ctx.patchState({
            selectedPayroll: action.payload
        });
    }

    @Receiver()
    public static setSelectedVisit(ctx: StateContext<AppStateModel>, action: EmitterAction<Visit>) {
        ctx.patchState({
            selectedVisit: action.payload
        });
    }

    @Receiver()
    public static setHistoryClient(ctx: StateContext<AppStateModel>, action: EmitterAction<Client>) {
        ctx.patchState({
            historyClient: action.payload
        });
    }

    @Receiver()
    public static async setEditVisit(ctx: StateContext<AppStateModel>, action: EmitterAction<EditVisit[]>) {
        ctx.patchState({
            editVisit: action.payload
        });
    }

    @Receiver()
    public static async setADLsKeys(ctx: StateContext<AppStateModel>) {
        const ADLs: ADL[] = [];
        ADLs.push( { Key: 'bath', Title: 'Bathing', Value: 0, ValueString: 'Did not provide' });
        ADLs.push( { Key: 'dress', Title: 'Dressing', Value: 0, ValueString: 'Did not provide' });
        ADLs.push( { Key: 'transf', Title: 'Transferring', Value: 0, ValueString: 'Did not provide' });
        ADLs.push( { Key: 'contin', Title: 'Continence', Value: 0, ValueString: 'Did not provide' });
        ADLs.push( { Key: 'toilet', Title: 'Toileting', Value: 0, ValueString: 'Did not provide' });
        ADLs.push( { Key: 'feed', Title: 'Feeding', Value: 0, ValueString: 'Did not provide' });
        ADLs.push( { Key: 'super', Title: 'Supervision', Value: 0, ValueString: 'Did not provide' });

        ctx.patchState({
            adlKeys: ADLs
        });
        LocalStorageService.setAppState(ctx.getState());
    }

    @Receiver()
    public static async pullIADLsFromDB(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        if (!caregiver) {
            console.log('Token does not exsist');
            return;
        }

        this.historyService.getIADLS(caregiver.Token).pipe(first()).subscribe(resData => {
            ctx.patchState({
                iadlKeys: resData
            });
            LocalStorageService.setAppState(ctx.getState());
            this.logger.trackEvent('Updated IADLs', 'Successful');
        },
        (error) => {
            this.apiHelper.handleHttpError('pullIADLsFromDB', error);
        });
    }

    @Receiver()
    public static async sendAdditionalQuestions(ctx: StateContext<AppStateModel>, action: EmitterAction<AddionialQuestionsStateObject>) {
        const caregiver = ctx.getState().caregiver;
        if (!caregiver) {
            console.log('Token does not exsist');
            return;
        }

        action.payload.questions.forEach(question => {
            if (!question.answer) {
                console.log('All questions need to have an answer.');
                return;
            }
        });

        this.shiftService.submitAdditionalQuestions(caregiver.APIToken, action.payload.questions,
                action.payload.caregiverId).pipe(first()).subscribe(resData => {
            this.logger.trackEvent('Submitted additioonal questions', 'Successful');
        },
        (error) => {
            this.apiHelper.handleHttpError('sendAdditionalQuestions', error);

            const answerToSync = ctx.getState().additionalAnswersToSync;

            answerToSync.push(action.payload);

            ctx.patchState({
                additionalAnswersToSync: JSON.parse(JSON.stringify(answerToSync)),
            });

            LocalStorageService.setAppState(ctx.getState());
        });
    }

    @Receiver()
    public static async sendAllNeedsToSyncAdditionalQuestions(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        const questions = <AddionialQuestionsStateObject[]>JSON.parse(JSON.stringify(ctx.getState().additionalAnswersToSync));
        const tryingToSync = ctx.getState().tryingToSyncAdditionalAnswers;

        if (!caregiver) {
            console.log('Token does not exsist');
            return;
        }
        if (questions.length === 0) {
            console.log('No questions to sync');
            return;
        }
        if (tryingToSync) {
            console.log('Is already trying to sync');
            return;
        }

        console.log('Starting to Sync questions. # of questions:', questions.length);

        ctx.patchState({
            tryingToSyncAdditionalAnswers: true,
        });

        const questionToSync = questions.shift(); // This grabs and removes the first object in the array.

        this.shiftService.submitAdditionalQuestions(caregiver.APIToken, questionToSync.questions,
            questionToSync.caregiverId).pipe(first()).subscribe(resData => {

            ctx.patchState({
                additionalAnswersToSync: JSON.parse(JSON.stringify(questions)),
                tryingToSyncAdditionalAnswers: false
            });
            LocalStorageService.setAppState(ctx.getState());

            console.log('Answer synced successfully.');

            if (questions.length > 0) {
                this.sendAllNeedsToSyncAdditionalQuestions(ctx);
            }
        }, error => {
            this.apiHelper.handleHttpError('sendAllNeedsToSyncAdditionalQuestions', error);
            ctx.patchState({
                tryingToSyncAdditionalAnswers: false
            });
        });
    }

    /**
     * This is used to submit a visit to the API
     * @param action - SubmitActionRequest
     */
    @Receiver()
    public static async submitAction(ctx: StateContext<AppStateModel>, action: EmitterAction<SubmitActionRequest>) {
        const caregiver = ctx.getState().caregiver;
        if (!caregiver) {
            console.log('Token does not exsist');
            return;
        }

        this.loadingIndicator.showIndicator();
        this.timerService.unsubscribeFromTimer();

        let numberOfClients = 1;
        const dualClient = ctx.getState().currentDualClient;
        if (dualClient) {
            numberOfClients = 2;
        }

        let client: Client;
        let clientLoop = 0; // Using a loop instead of index because the service can return at different times.
        const submitRequest = <SubmitActionRequest>JSON.parse(JSON.stringify(action.payload));

        for (let i = 0; i < numberOfClients; i++) {
            if (numberOfClients === 1) { // Use regular currentClient
                client = ctx.getState().currentClient;
            } else {                    // Use the dual Client object, currentDualClient
                // makes it go to either c1 or c2 of the object.
                client = dualClient[`c${i + 1}`]; // EX: currentDualClient.c1
                console.log('Selecting Client for submitAction: ', client.Name, client.Id, client.CaregiverId);
                this.logger.trackEvent('Submit Action', `${SubmitActionType[submitRequest.visit.ActionType]} Dual Clients`);
            }

            let visitToSend: TimecardSubmitRequest;
            if (i === 1 && submitRequest.visit2) { // If dualClient 2 and the client has different ADLs.
                visitToSend = submitRequest.visit2;
            } else {
                visitToSend = submitRequest.visit;
            }

            visitToSend.ClientId = client.Id;
            visitToSend.CaregiverId = client.CaregiverId;
            visitToSend.DeviceId = caregiver.Uuid;
            visitToSend.appVersion = AppState.appVersion;
            isIOS ? visitToSend.appOS = 'iOS' : visitToSend.appOS = 'Android';
            visitToSend.GeofencingEvents[0].EventDate = visitToSend.CheckInTime.split('-',3).join('-')+'-'+visitToSend.GeofencingEvents[0].EventDate.split('-')[3];
            visitToSend.GeofencingEvents[0].EventType = 0;
            visitToSend.GeofencingEvents[0].GeofencingType = 0;
            console.log('Starting...');
            const start = new Date().getTime();
            this.shiftService.submitAction(caregiver.APIToken, visitToSend).pipe(first()).subscribe(res => {
                // console.log('SUBMIT ACTION RES: ',res);
                console.log('VISIT TO SEND: ',visitToSend)
                const end = new Date().getTime();
                const time = end - start;
                console.log('Successful! Execution time: ' + time);

                this.logger.trackEvent('Submit Action', `${SubmitActionType[visitToSend.ActionType]} Successful`);

                const lastVisit: LastVisit = {
                    Client: ctx.getState().currentClient,
                    Visit: res
                };

                clientLoop++;

                if (clientLoop === numberOfClients) {
                    if (clientLoop === 2) {
                        lastVisit.DualClient = dualClient;
                    }
                    if (visitToSend.ActionType === SubmitActionType.CheckIn) {
                        const submitActionRequest: SubmitActionRequest = {
                            visit: {
                                ActionType: SubmitActionType.None,
                                CheckInTime: res.CheckInTime,
                                GeofencingEvents: [],
                                ShiftId: res.VisitDetails[0].ShiftId
                            }
                        };
                        ctx.patchState({
                            currentVisit: res,
                            currentSubmitActionRequest: submitActionRequest,
                            lastVisit: lastVisit
                        });
                    } else {
                        ctx.patchState({
                            currentClient: undefined,
                            currentDualClient: undefined,
                            currentVisit: undefined,
                            currentSubmitActionRequest: undefined,
                            lastVisit: lastVisit,
                            reminderDate: undefined,
                            editShift: undefined
                        });
                    }

                    LocalStorageService.setAppState(ctx.getState());
                }
            }, error => {
                console.dir(error);
                this.logger.trackEvent('Submit Action', 'Failed');
                this.apiHelper.handleHttpError('submitAction', error);
                AppState.saveVisitOffline(ctx, visitToSend, client, dualClient);
            });
        }
    }

    private static saveVisitOffline(ctx: StateContext<AppStateModel>, submitRequest: TimecardSubmitRequest,
                                    client: Client, dualClient: DualClient) {
        this.logger.trackEvent('Saving shift locally', 'Shift was not sent to SPANQI');

        const visits = <TimecardSubmitRequest[]>JSON.parse(JSON.stringify(ctx.getState().visitsToSync));

        // Checks if visit already has a checkin, if it does, deletes it and add the new visit and becomes Both.
        if (submitRequest.CheckInTime) {
            const sameShiftIndex = visits.findIndex(visit =>
                visit.CheckInTime === submitRequest.CheckInTime &&
                visit.CaregiverId === submitRequest.CaregiverId &&
                visit.ClientId === submitRequest.ClientId);
            if (sameShiftIndex !== -1) {
                visits.splice(sameShiftIndex, 1);
                submitRequest.ActionType = SubmitActionType.Both;
            }
        }

        visits.push(submitRequest);

        const lastVisit: LastVisit = {
            Visit: convertTimecardRequestToVisit(submitRequest, client)
        };

        if (dualClient) {
            lastVisit.DualClient = dualClient;
        } else {
            lastVisit.Client = client;
        }

        if (submitRequest.ActionType === SubmitActionType.CheckIn) {
            const submitActionRequest: SubmitActionRequest = {
                visit: submitRequest
            };

            ctx.patchState({
                currentVisit: lastVisit.Visit,
                currentSubmitActionRequest: submitActionRequest,
                visitsToSync: JSON.parse(JSON.stringify(visits)),
                lastVisit: lastVisit,
                loading: false
            });
        } else {
            ctx.patchState({
                currentClient: undefined,
                currentDualClient: undefined,
                currentVisit: undefined,
                currentSubmitActionRequest: undefined,
                visitsToSync: JSON.parse(JSON.stringify(visits)),
                lastVisit: lastVisit,
                editShift: undefined,
                loading: false
            });
        }
        LocalStorageService.setAppState(ctx.getState());
    }

    /**
     * This will send all shifts that are in AppState.visitsToSync
     */
    @Receiver()
    public static async sendAllNeedsToSyncShifts(ctx: StateContext<AppStateModel>) {
        const tryingToSync = ctx.getState().tryingToSync;

        if (tryingToSync) {
            console.log('Already syncing visits.');
            return;
        }

        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return;
        }

        const caregiver = ctx.getState().caregiver;
        const visits = <TimecardSubmitRequest[]>JSON.parse(JSON.stringify(ctx.getState().visitsToSync));

        if (!caregiver) {
            console.log('Token does not exsist');
            return;
        }
        if (visits.length === 0) {
            console.log('No shifts to sync');
            return;
        }

        ctx.patchState({
            tryingToSync: true,
        });

        console.log('Starting to Sync Visits. # of visits:', visits.length);

        const visitToSync = visits.shift(); // This grabs and removes the first object in the array.

        const start = new Date().getTime();
        this.shiftService.submitAction(caregiver.APIToken, visitToSync).pipe(first()).subscribe(res => {
            const end = new Date().getTime();
            const time = end - start;
            console.log('Visit synced successfully! Execution time: ' + time);

            ctx.patchState({
                visitsToSync: JSON.parse(JSON.stringify(visits)),
                tryingToSync: false
            });
            LocalStorageService.setAppState(ctx.getState());

            if (visits.length > 0) {
                this.sendAllNeedsToSyncShifts(ctx);
            }
        }, error => {
            this.apiHelper.handleHttpError('sendAllNeedsToSyncShifts', error);
            ctx.patchState({
                tryingToSync: false
            });
        });
    }

    @Receiver()
    public static async getLastVisitFromDB(ctx: StateContext<AppStateModel>) {
        const caregiver = ctx.getState().caregiver;
        if (!caregiver) {
            console.log('Token does not exsist');
            return;
        }

        this.shiftService.apiGetLastVisit(caregiver.APIToken, caregiver.Id).pipe(first()).subscribe((lastVisits) => {
            const savedLastVisit = ctx.getState().lastVisit;

            this.logger.trackEvent('Get Last Visits', 'Successful');

            if (!lastVisits) {
                console.log('User does not have any visits');
                ctx.patchState({
                    currentClient: undefined,
                    currentDualClient: undefined,
                    currentVisit: undefined,
                    lastVisit: null
                });
                return;
            }
            console.log('Last visit exsists');

            const clients = ctx.getState().clients;
            let dualClient: DualClient;
            let client: Client;

            if (lastVisits.length === 1) {
                client = clients.find(c => c.Id === lastVisits[0].CustomerId && +c.CaregiverId === +lastVisits[0].CaregiverId);
            } else if (lastVisits.length === 2) {
                dualClient = {
                    c1: clients.find(c => c.Id === lastVisits[0].CustomerId && +c.CaregiverId === +lastVisits[0].CaregiverId),
                    c2: clients.find(c => c.Id === lastVisits[1].CustomerId && +c.CaregiverId === +lastVisits[1].CaregiverId)
                };
            }

            if (!savedLastVisit) { // No savedLastVisit. So use responded lastVisits.
                console.log('Saved Last Visit doesn\'t exsist');
                AppState.patchStateForLastVisits(ctx, client, dualClient, lastVisits);
                return;
            }
            console.log('Saved Last visit exsist');

            if (lastVisits.length === 2 && savedLastVisit.DualClient && compareVisits(lastVisits[0], savedLastVisit.Visit) ||
                lastVisits.length === 1 && !savedLastVisit.DualClient && compareVisits(lastVisits[0], savedLastVisit.Visit)) {
                    console.log('lastVisit and savedLastVisit are the same.');
                    return;
            } else {
                console.log('lastVisit and savedLastVisit are different');
                AppState.patchStateForLastVisits(ctx, client, dualClient, lastVisits);
            }
        }, error => {
            this.handleNewApiError('getLastVisitFromDB', error, caregiver, ctx);
        });
    }

    /**
     * Used if you need to remove both currentClient and currentVisit.
     * For example, currently being used if shift is over 26 hours, and user can no longer checkout of that shift.
     */
    @Receiver()
    public static async removeCurrnetClientAndShift(ctx: StateContext<AppStateModel>) {
        ctx.patchState({
            currentClient: undefined,
            currentDualClient: undefined,
            currentVisit: undefined,
            currentSubmitActionRequest: undefined
        });
    }

    @Receiver()
    public static async updateCurrentSubmitActionRequest(ctx: StateContext<AppStateModel>, action: EmitterAction<SubmitActionRequest>) {
        ctx.patchState({
            currentSubmitActionRequest: action.payload
        });
        LocalStorageService.setAppState(ctx.getState());
    }

    @Receiver()
    public static setLastVisit(ctx: StateContext<AppStateModel>, action: EmitterAction<LastVisit>) {
        ctx.patchState({
            lastVisit: action.payload
        });
        LocalStorageService.setAppState(ctx.getState());
    }

    @Receiver()
    public static async setEditShift(ctx: StateContext<AppStateModel>, action: EmitterAction<SubmitActionRequest>) {
        ctx.patchState({
            editShift: action.payload
        });
        LocalStorageService.setAppState(ctx.getState());
    }

    @Receiver()
    public static async setReminderDate(ctx: StateContext<AppStateModel>, action: EmitterAction<Date>) {
        ctx.patchState({
            reminderDate: action.payload
        });
        LocalStorageService.setAppState(ctx.getState());
    }

    /**
     * !! Only call this method on app.component.ts !!
     *
     * This method will grab any locally saved information, and populate AppState.
     */
    @Receiver()
    public static rehydrateApp(ctx: StateContext<AppStateModel>) {
        console.log('Rehydrating app');
        const state: AppStateModel = LocalStorageService.getAppState();

        if (state) {
            if (state.currentSchedule) {
                for (let i = 0; i < state.currentSchedule.visits.length; i++) {
                    state.currentSchedule.visits[i].checkInTime = new Date(state.currentSchedule.visits[i].checkInTime);
                    state.currentSchedule.visits[i].checkOutTime = new Date(state.currentSchedule.visits[i].checkOutTime);
                }
            }
            if (state.calendarSchedule) {
                for (let i = 0; i < state.calendarSchedule.visits.length; i++) {
                    state.calendarSchedule.visits[i].checkInTime = new Date(state.calendarSchedule.visits[i].checkInTime);
                    state.calendarSchedule.visits[i].checkOutTime = new Date(state.calendarSchedule.visits[i].checkOutTime);
                }
            }

            ctx.setState({
                caregiver: state.caregiver,
                isAuth: state.isAuth,
                clients: state.clients,
                error: '',
                theme: state.theme,
                profileInfo: state.profileInfo,
                pushToken: state.pushToken,
                changePasswordForm: state.changePasswordForm,

                clientPayrolls: state.clientPayrolls,
                currentClientPayrolls: state.currentClientPayrolls,
                selectedPayroll: undefined,
                visits: [],
                selectedVisit: undefined,
                historyClient: undefined,
                adlKeys: state.adlKeys,
                iadlKeys: state.iadlKeys,
                editVisit: undefined,

                currentClient: state.currentClient,
                currentDualClient: state.currentDualClient,
                currentVisit: state.currentVisit,
                currentSubmitActionRequest: state.currentSubmitActionRequest,
                reminderDate: state.reminderDate,
                visitsToSync: state.visitsToSync,
                tryingToSync: false,
                lastVisit: state.lastVisit,
                editShift: state.editShift,
                additionalAnswersToSync: state.additionalAnswersToSync,
                tryingToSyncAdditionalAnswers: false,
                locationAlertOptions: state.locationAlertOptions,

                currentSchedule: state.currentSchedule,
                calendarSchedule: state.calendarSchedule,
                syncCalendar: state.syncCalendar,

                messageRecipients: [],
                messageThreads: [],
                unreadMessages: 0,
                messages: [],

                scheduleEnabled: false,
                messagingEnabled: false,

                currentVersionDialogData: undefined,
                loading: false
            });
        }
    }

    /**
     * When user logs out, All local storage is deleted and caregiver state becomes undefined.
     */
    @Receiver()
    public static async logout(ctx: StateContext<AppStateModel>) {
        this.logger.trackEvent('Logged Out', 'Successful', true);

        ctx.setState({
            caregiver: undefined,
            isAuth: false,
            clients: [],
            error: '',
            theme: ThemeType.Fastpay,
            profileInfo: undefined,
            pushToken: '',
            changePasswordForm: undefined,

            clientPayrolls: [],
            selectedPayroll: undefined,
            currentClientPayrolls: [],
            visits: [],
            selectedVisit: undefined,
            historyClient: undefined,
            adlKeys: undefined,
            iadlKeys: undefined,
            editVisit: undefined,

            currentClient: undefined,
            currentDualClient: undefined,
            currentVisit: undefined,
            currentSubmitActionRequest: undefined,
            reminderDate: undefined,
            visitsToSync: [],
            tryingToSync: false,
            lastVisit: undefined,
            editShift: undefined,
            additionalAnswersToSync: [],
            tryingToSyncAdditionalAnswers: false,
            locationAlertOptions: [],

            currentSchedule: undefined,
            calendarSchedule: undefined,
            syncCalendar: { shouldSync: false, dateCalled: undefined, schedule: undefined },

            messageRecipients: [],
            messageThreads: [],
            unreadMessages: 0,
            messages: [],

            scheduleEnabled: false,
            messagingEnabled: false,

            currentVersionDialogData: undefined,
            loading: false
        });

        FileStorageService.deleteAllFiles();
        LocalStorageService.setAppState(ctx.getState());
        LocalStorageService.setOtherDataOnLogout();
    }

    private static patchStateForLastVisits(ctx: StateContext<AppStateModel>, client: Client,
        dualClient: DualClient, lastVisits: Visit[]) {

        const lastVisit: LastVisit = {
            Visit: lastVisits[0],
        };

        if (dualClient) { // If dualClient, there SHOULD NOT be a currentClient
            console.log('Last Visit has a dual Client. Removing currentClient.');
            client = undefined;
            lastVisit.DualClient = dualClient;
        } else {
            dualClient = undefined;
            lastVisit.Client = client;
        }

        if (lastVisits[0].CheckOutTime) {
            ctx.patchState({
                currentClient: undefined,
                currentDualClient: undefined,
                currentVisit: undefined,
                lastVisit: lastVisit
            });
        } else {
            const submitActionRequest: SubmitActionRequest = {
                visit: {
                    ActionType: SubmitActionType.None,
                    CheckInTime: lastVisits[0].CheckInTime,
                    GeofencingEvents: [],
                    ShiftId: lastVisits[0].VisitDetails[0].ShiftId
                }
            };
            ctx.patchState({
                currentClient: client,
                currentDualClient: dualClient,
                currentVisit: lastVisits[0],
                currentSubmitActionRequest: submitActionRequest,
                lastVisit: lastVisit
            });
        }

        LocalStorageService.setAppState(ctx.getState());
    }

    /**
     * Handles new API requests. If response is a 401, recalls the method with new Token.
     * If the call fails again, logs out the user.
     *
     * @param methodName - The exact name of the Receiver method
     * @param error - The error that was returned from the API call
     * @param caregiver - caregiver object
     * @param ctx - State context
     * @param payload - Payload needed for the Receiver call. If method doesn't need payload, ignore this parameter
     */
    private static handleNewApiError(methodName: string, error: any, caregiver: Caregiver, ctx, payload = null) {
        this.apiHelper.handleHttpError(methodName, error, caregiver).then(res => {
            if (res) {
                ctx.patchState({
                    caregiver: res
                });
                AppState[methodName](ctx, new EmitterAction(payload));
            }
        }).catch(e => {
            console.log('Error happened during refresh token. Logging user out.');
            this.logout(ctx);
        });
    }

    private static getErrorString(statusCode: number): string {
        switch (statusCode) {
            case 0:
                return 'Not connected to the internet.';
            case 401:
                return 'Incorrect email or password.';
            case 500:
                return 'Internal Server Error';
        }
    }
}
