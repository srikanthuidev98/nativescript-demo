import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { PanGestureEventData } from 'tns-core-modules/ui/gestures';
import { View } from 'tns-core-modules/ui/page/page';
import { AnimationHelper } from '../../../../ACCommon/helpers';
import { ScrollView } from 'tns-core-modules/ui/scroll-view/scroll-view';
import { AcNotification } from '../../../../ACCommon/models';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  @ViewChild('card', { static: true }) card: ElementRef;

  @Input() scrollview: ScrollView;
  @Input() slideInIndex = -1;
  @Input() notification: AcNotification;
  @Input() html: string = undefined;

  @Output() swipeAway = new EventEmitter();

  public faStyle: string;
  public iconHex;

  private cardView: View;
  private prevDeltaX = 0;

  constructor(private animationHelper: AnimationHelper) { }

  ngOnInit() {
    if (this.notification) {
      this.iconHex = String.fromCharCode(parseInt(this.notification.IconString, 0));
      this.faStyle = this.notification.FaStyle;
    }

    if (this.html) {
      this.faStyle = 'far';
      this.iconHex = String.fromCharCode(parseInt('0xf96c', 0));
    }

    this.cardView = <View>this.card.nativeElement;
    this.cardView.translateX = 0;
    this.cardView.translateY = 0;
    this.cardView.scaleX = 1;
  }

  cardLoaded(view: View) {
    if (this.slideInIndex !== -1) {
      this.animationHelper.slideInto(view, this.slideInIndex, 'right');
    }
  }

  onPan(args: PanGestureEventData) {
    if (this.notification && this.notification.CanHide && this.scrollview) {
      if (args.state === 1) { // Card is pressed down
        this.prevDeltaX = 0;
        this.scrollview.isScrollEnabled = false;
      } else if (args.state === 2) { // Card is panning
        this.cardView.translateX += args.deltaX - this.prevDeltaX;
        this.prevDeltaX = args.deltaX;
      } else if (args.state === 3) { // User released card
        this.scrollview.isScrollEnabled = true;
        const closeNumber = this.cardView.getActualSize().width / 2; // Half of the card's width

        if (args.deltaX > closeNumber) {
          this.animationHelper.slideAway(this.cardView, 'right');
          setTimeout(() => {
            this.swipeAway.emit(this);
          }, 300);
        } else if (args.deltaX < -closeNumber) {
          this.animationHelper.slideAway(this.cardView, 'left');
          setTimeout(() => {
            this.swipeAway.emit(this);
          }, 300);
        } else {
          this.animationHelper.slideBack(this.cardView, 200);
          this.prevDeltaX = 0;
        }
      }
    }
  }
}
