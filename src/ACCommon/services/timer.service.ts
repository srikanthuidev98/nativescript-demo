import { Injectable } from '@angular/core';
import { Visit } from '../../ACCommon/models';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { DateService } from './date.service';

/**
 * This service is used for the timer functionality for TimerComponent and the timer used in RecordComponent.
 */
@Injectable()
export class TimerService {

    private hours = '00';

    private minutes = '00';

    private seconds = '00';

    /**
     * Subscribe to this to get the time as hh:mm:ss.
     * Current it is being used in TimerComponent
     */
    public timerString$ = new BehaviorSubject<string>(this.hours + ':' + this.minutes + ':' + this.seconds);

    private timeInterval: any;

    private timerInUse = false;
    private shiftSubscribtion: Subscription;

    constructor() { }

    /**
     * Used to subscribed to the timer interval to start counting time.
     * This also subscribes to the visit Observable.
     *
     * @param visit$ - visit Observable - This should always be from AppState.getCurrentVisit
     */
    subscribeToTimer(visit$: Observable<Visit>) {
        this.shiftSubscribtion = visit$.subscribe(visit => {
            if (!visit || this.timerInUse) {
                return null;
            }

            this.updateTime(DateService.getDate(visit.CheckInTime)); // Set Initial Time

            this.timerInUse = true;
            console.log('Timer Interval has started running.');
            this.timeInterval = setInterval(() => {
                this.updateTime(DateService.getDate(visit.CheckInTime));
                this.timerString$.next(this.hours + ':' + this.minutes + ':' + this.seconds);
            }, 1000);
        });
    }

    /**
     * Used to unsubscribe from both the time interval and the shift subscription.
     */
    public unsubscribeFromTimer() {
        if (!this.timerInUse) {
            return;
        }

        console.log('Timer Interval has stopped running.');
        this.shiftSubscribtion.unsubscribe();
        clearTimeout(this.timeInterval);
        this.timerInUse = false;
    }

    private updateTime(time: Date): any {
        const currentTime = new Date(Date.now());

        let difference = currentTime.getTime() - time.getTime();

        this.hours = `${Math.floor(difference / 3600000)}`;
        difference = difference - (+this.hours * 3600000);
        this.hours = this.checkIfOneDigit(this.hours);

        this.minutes = `${Math.floor(difference / 60000)}`;
        difference = difference - (+this.minutes * 60000);
        this.minutes = this.checkIfOneDigit(this.minutes);

        this.seconds = `${Math.floor(difference / 1000)}`;
        difference = difference - (+this.seconds * 1000);
        this.seconds = this.checkIfOneDigit(this.seconds);
    }

    private checkIfOneDigit(time: string) {
        if (time.length === 1) {
            return `0${time}`;
        }
        return time;
    }
}
