import { Injectable } from '@angular/core';
import { Schedule, ScheduleVisit } from '../../ACCommon/models';
import { alert } from 'tns-core-modules/ui/dialogs';
import { LoadingHelper, Toast } from '../helpers';
import { Observable } from 'rxjs';
import * as nsCalendar from 'nativescript-calendar';
import { first } from 'rxjs/operators';
import { EmitterService } from '@ngxs-labs/emitter';
import { AppState } from '../states';
import { Store } from '@ngxs/store';
import { isIOS } from 'tns-core-modules/ui/page';

@Injectable({ providedIn: 'root' })
export class CalendarService {

    constructor(private loading: LoadingHelper, private emitter: EmitterService, private store: Store) {
        this.syncCalendar$ = this.store.select(state => state.appData.syncCalendar);
        this.checkIfCalendarHasEvents();
    }

    private syncCalendar$: Observable<{ shouldSync: boolean, dateCalled: Date, schedule: Schedule }>;

    /**
     * Creates events and adds them to the phone's calendar.
     */
    public initialSync() {
        this.loading.showIndicator();
        nsCalendar.hasPermission().then(permission => {
            if (!permission) {
                nsCalendar.requestPermission().then(() => {
                    this.initialSync();
                }).catch(() => {
                    this.loading.hideIndicator();
                    alert({
                        title: 'Permission denined',
                        message: 'Please allow access to the Calendar for AssuriCare to sync visits.',
                        okButtonText: 'Ok'
                    });
                });
            } else {
                this.emitter.action<boolean>(AppState.updateCalendarSync).emit(true);
                this.loading.hideIndicator();
            }
        }).catch(() => {
            this.loading.hideIndicator();
            alert({
                title: 'Permission denined',
                message: 'Please allow access to the Calendar for AssuriCare to sync visits.',
                okButtonText: 'Ok'
            });
        });
    }

    /**
     * Removes the AssuriCare calendar.
     * This will delete all calendar events that were created.
     */
    public desync() {
        nsCalendar.deleteCalendar({ name: 'AssuriCare' }).then(() => {
            this.emitter.action<boolean>(AppState.updateCalendarSync).emit(false);
            new Toast().show(`Your calendar has been unsynced.`);
        }).catch(() => {
            alert({
                title: 'Could not unsync calendar',
                message: 'Please verify access to Calendar to unsync events. (Settings -> Permissions)',
                okButtonText: 'Ok'
            });
        });
    }

    private checkIfCalendarHasEvents() {
        this.syncCalendar$.pipe(first()).subscribe(syncCalendar => {
            if (!syncCalendar.shouldSync) {
                nsCalendar.hasPermission().then(permission => {
                    if (permission) {
                        nsCalendar.listCalendars().then(calendars => {
                            const assuricareCal = calendars.find(cal => cal.name === 'AssuriCare');
                            if (assuricareCal) {
                                this.emitter.action<boolean>(AppState.updateCalendarSync).emit(true);
                            } else {
                                this.emitter.action<boolean>(AppState.updateCalendarSync).emit(false);
                            }
                        }).catch(() => {
                            this.emitter.action<boolean>(AppState.updateCalendarSync).emit(false);
                        });
                    } else {
                        this.emitter.action<boolean>(AppState.updateCalendarSync).emit(false);
                    }
                }).catch(() => {
                    this.emitter.action<boolean>(AppState.updateCalendarSync).emit(false);
                });
            }
        });
    }
}

export function AddCalendarEvents(visits: ScheduleVisit[], showToast: boolean) {
    if (visits && visits.length > 0) {
        for (const visit of visits) {
            const names = visit.name.split(' ');
            const event: nsCalendar.CreateEventOptions = {
                calendar: {
                    name: 'AssuriCare',
                    color: '#593c81',
                    accountName: 'AssuriCare'
                },
                startDate: visit.checkInTime,
                endDate: visit.checkOutTime,
                title: `AssuriCare Visit with ${names[0]} ${names[1].substring(0, 1)}`,
                reminders: {
                    first: 60
                }
            };

            if (isIOS) {
                event.url = <any>'AssuriCare://visit';
            } else {
                event.notes = '<a href="AssuriCare://visit/">Open AssuriCare app</a>';
            }

            nsCalendar.createEvent(event);
        }

        if (showToast) {
            new Toast().show('Your calendar has been successfully synced.');
        }
    }
}
