import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Visit, Payroll } from '../../../../ACCommon/models';
import { Observable } from 'rxjs';
import { TimerService } from '../../../../ACCommon/services/timer.service';
import { Page, EventData, isIOS } from 'tns-core-modules/ui/page';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation/animation';

/**
 * Two ways to use this component.
 *
 * 1. Send a visit$ observable.
 * 2. Send visits and payroll
 *
 * The first option will show the timer counting up. Used on checkout-container.
 * The second option will have static text that displays the total amount of time for all visits
 */
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent implements OnInit, OnChanges {

  constructor(public timerService: TimerService, private page: Page) { }

  public static animation; // This needs to be public static because it is used in main.ts

  // Option 1 - Send a visit$ observable.
  @Input() visit$: Observable<Visit> = undefined;

  // Option 2 - Send visits and payroll
  @Input() visits: Visit[] = [];
  @Input() payroll: Payroll = undefined;

  @Input() hideAnimation = false;

  public totalTime = '0h:0m';

  startAnimation(args: EventData) {
    const rotatingCircle = args.object;
    this.animateCircle(rotatingCircle);
  }

  ngOnInit() {
    this.page.on('navigatingFrom', (data) => {
      if (TimerComponent.animation !== undefined) {
        setTimeout(() => {
          TimerComponent.animation.cancel();
        }, 300);
      }
    });

    if (this.visit$) { // Option 1
      this.timerService.subscribeToTimer(this.visit$);
    } else {  // Option 2
      if (this.visits) {
        let hours = 0;
        for (let i = 0; i < this.visits.length; i++) {
          hours += this.visits[i].PaidHours;
          if (i === this.visits.length - 1) {
            const minutes = hours % 1;
            this.totalTime = `${Math.floor(hours)}h:${minutes * 60}m`;
          }
        }
      }
    }
  }

  ngOnChanges(changes: any): void { // This is needed to update the hour count after a edit Visit change.
    if (this.visits) {
      let hours = 0;
      for (let i = 0; i < this.visits.length; i++) {
        hours += this.visits[i].PaidHours;
        if (i === this.visits.length - 1) {
          const minutes = hours % 1;
          this.totalTime = `${Math.floor(hours)}h:${minutes * 60}m`;
        }
      }
    }
  }

  animateCircle(rotatingCircle) {
    const animationDefinition: AnimationDefinition = {
      target: rotatingCircle, // provide the view to animate
      curve: AnimationCurve.linear,
      duration: 5000,
      rotate: 360,
      iterations: Infinity
    };

    // iOS 14 Broke this. Infinity no longer works.
    if (isIOS) {
      animationDefinition.iterations = undefined;
    }

    TimerComponent.animation = new Animation([animationDefinition], false);

    TimerComponent.animation.play().then(() => {
      if (isIOS) {
        this.animateCircle(rotatingCircle);
      }
    }).catch(e => {
      console.log('Animation was cancelled.');
    });
  }
}
