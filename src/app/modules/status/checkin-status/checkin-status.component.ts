import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { RouterHelper, LocationHelper, LocalNotificationHelper, ConnectivityHelper, RedirectHelper } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable, Subscription } from 'rxjs';
import { Caregiver, AcNotification, Client, Schedule, ScheduleVisit, isScheduleVisitCancelled,
  DialogData, dialogCloseEvent, LastVisit } from '../../../../ACCommon/models';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { first, take } from 'rxjs/operators';
import { LoadingHelper } from '../../../../ACCommon/helpers';
import { ScrollView } from 'tns-core-modules/ui/scroll-view/scroll-view';
import { DateService } from '../../../../ACCommon/services/date.service';
import { PayRateType, VisitStatus } from '../../../../ACCommon/enums';

@Component({
  selector: 'app-checkin-status',
  templateUrl: './checkin-status.component.html',
  styleUrls: ['./checkin-status.component.scss']
})
export class CheckinStatusComponent implements OnInit, OnDestroy {

  @ViewChild('scroll', { static: true }) scroll: ElementRef;

  @Select(AppState.getClients) clients$: Observable<Client[]>;
  @Select(AppState.getSavedLastVisit) lastVisit$: Observable<LastVisit>;
  @Select(AppState.getCaregiver) caregiver$: Observable<Caregiver>;
  @Select(AppState.getCurrentSchedule) currentSchedule$: Observable<Schedule>;
  @Select(AppState.getCurrentVersionDialogData) currentVersionDialogData$: Observable<DialogData>;

  @Emitter(AppState.removeCurrnetClientAndShift)
  public removeCurrnetClientAndShift: Emittable<null>;

  @Emitter(AppState.setReminderDate)
  public setReminderDate: Emittable<Date>;

  @Emitter(AppState.sendAllNeedsToSyncShifts)
  private syncOfflineShifts: Emittable<null>;

  @Emitter(AppState.sendAllNeedsToSyncAdditionalQuestions)
  private syncAdditionalQuestions: Emittable<null>;

  @Emitter(AppState.getScheduleFromDb)
  public getScheduleFromDb: Emittable<{from: Date, to: Date}>;

  constructor(private locationHelper: LocationHelper, private routerHelper: RouterHelper, private loadingIndicator: LoadingHelper,
              private notification: LocalNotificationHelper, public connection: ConnectivityHelper,
              private redirectHelper: RedirectHelper) { }

  header = '';
  headerName = '';
  scrollView: ScrollView;
  noNotifications = false;
  checkinMessage = '';
  public nextVisit: ScheduleVisit;
  public upcomingVisits: ScheduleVisit[] = [];

  // Dialog Variables
  public dialogOpen = false;
  public dialogData: DialogData;

  private scheduleSubscription: Subscription;

  public offlineNotification: AcNotification = {
      Title: 'Offline',
      Body: 'Your pending time entries will be saved to our system when an internet connection is available',
      FaStyle: 'fas',
      IconString: '0xf2f1',
      Hide: false,
      CanHide: false
  };

  ngOnInit() {
    this.getScheduleFromDb.emit(null);

    setTimeout(() => {
      this.currentVersionDialogData$.pipe(first()).subscribe(dialogData => {
        if (dialogData) {
          this.dialogData = dialogData;
          this.dialogOpen = true;
        }
      });
    }, 1000);

    this.scheduleSubscription = this.currentSchedule$.subscribe(currentSchedule => {
      if (currentSchedule) {
        this.nextVisit = undefined;
        this.upcomingVisits = [];

        for (let i = 0; i < currentSchedule.visits.length; i++) {
          if (!this.nextVisit) {
            if (!isScheduleVisitCancelled(currentSchedule.visits[i]) && currentSchedule.visits[i].status !== VisitStatus.Completed) {
              if (currentSchedule.visits[i].payRateType === PayRateType.Daily) { // Daily
                this.nextVisit = currentSchedule.visits[i];
              } else {
                if (DateService.isBefore(currentSchedule.visits[i].checkInTime, new Date())) { // Beforee current time
                  const hoursBetween = Math.floor(
                    DateService.durationBetweenDates(new Date(), currentSchedule.visits[i].checkInTime, 'asHours'));
                  if (hoursBetween <= 6) { // 6 or less hours, show this visit.
                    this.nextVisit = currentSchedule.visits[i];
                  }
                } else { // After current time
                  this.nextVisit = currentSchedule.visits[i];
                }
              }
            }
          } else {
            if (this.upcomingVisits.length < 5) {
              this.upcomingVisits.push(currentSchedule.visits[i]);
            } else {
              break;
            }
          }
        }
      }
    });

    this.scrollView = this.scroll.nativeElement;
    this.syncOfflineShifts.emit(null); // Tries to sync shifts if they haven't been sent yet.
    this.syncAdditionalQuestions.emit(null);
    this.notification.cancelNotification(1);
    this.locationHelper.disableWatchLocation();
    this.removeCurrnetClientAndShift.emit(null);
    this.setReminderDate.emit(undefined);

    const hours = new Date().getHours();

    this.clients$.pipe(take(2)).subscribe(clients => {
      if (clients && clients[0] && clients[0].CheckInMessage) {
        this.checkinMessage = clients[0].CheckInMessage;
        this.noNotifications = false;
      } else {
        this.noNotifications = true;
      }
    });

    this.caregiver$.pipe(first()).subscribe(caregiver => {
      const firstName = caregiver.Name.substr(0, caregiver.Name.indexOf(' '));
      if (hours > 0 && hours < 12) {
        this.header = `Good Morning,`;
        this.headerName = firstName;
      } else if (hours >= 12 && hours <= 18) {
        this.header = `Good Afternoon,`;
        this.headerName = firstName;
      } else {
        this.header = `Good Evening,`;
        this.headerName = firstName;
      }
    });

    this.lastVisit$.pipe(first()).subscribe(lastVisit => {
      if (lastVisit && lastVisit.Visit && lastVisit.Visit.CheckOutTime) {
        const lastVisitDate = new Date(lastVisit.Visit.CheckOutTime);

        if (new Date().getTime() - lastVisitDate.getTime() < 30000) { // If lastVisit CheckOut was less than 30 seconds
          this.header = `Check Out`;
          this.headerName = 'Complete!';
        }
      }
    });

    this.notification.iosStopReminderNotification();

    this.loadingIndicator.hideIndicator();
  }

  ngOnDestroy(): void {
    this.scheduleSubscription.unsubscribe();
  }

  checkInTap() {
    this.removeCurrnetClientAndShift.emit(null);
    this.routerHelper.navigate(['/status/clients-list/checkin', { backBtnText: 'Back'}]);
  }

  swipedAway(num: number) {
    // this.testNotifications[num].Hide = true;

    // for (let i = 0; i < this.testNotifications.length; i++) {
    //   if (!this.testNotifications[i].Hide) {
    //     return;
    //   }
    // }

    // this.noNotifications = true;
  }

  scheduleTap() {
    this.routerHelper.replace(['/scheduler']);
  }

  cancelledDetailTap(dialogData: DialogData) {
    this.dialogData = dialogData;
    this.dialogOpen = true;
  }

  closeDialog(event: dialogCloseEvent) {
    // this.dialogOpen = false;
    this.redirectHelper.goToAppStorePage();
  }
}
