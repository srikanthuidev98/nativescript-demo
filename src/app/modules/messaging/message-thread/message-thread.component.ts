import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterHelper, JsAnimationDefinition, animate, AnimationRange } from '../../../../ACCommon/helpers';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { Message, MessageRecipient, Caregiver } from '../../../../ACCommon/models';
import { View, isAndroid, Page } from 'tns-core-modules/ui/page';
import { screen } from 'tns-core-modules/platform';
import { take, first } from 'rxjs/operators';
import * as d3 from 'd3-ease';
import { customSort } from '../../../../ACCommon/helpers/sort.helper';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';

@Component({
  selector: 'ns-message-thread',
  templateUrl: './message-thread.component.html',
  styleUrls: ['./message-thread.component.scss']
})
export class MessageThreadComponent implements OnInit {

  @ViewChild('fab', { static: true }) _fabRef: ElementRef;
  @ViewChild('fabPlus', { static: true }) _fabPlusRef: ElementRef;
  @ViewChild('modal', { static: true }) _modalRef: ElementRef;

  @Select(AppState.getCaregiver) caregiver$: Observable<Caregiver>;
  @Select(AppState.getMessageThreads) threads$: Observable<Message[]>;
  @Select(AppState.getUnreadMessages) unreadMessages$: Observable<number>;
  @Select(AppState.getMessageRecipients) recipients$: Observable<MessageRecipient[]>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.pullMessageThreads)
  public pullMessageThreads: Emittable<null>;

  @Emitter(AppState.pullMessages)
  public pullMessages: Emittable<number>;

  @Emitter(AppState.pullMessageRecipients)
  public pullMessageRecipients: Emittable<null>;

  @Emitter(AppState.deleteThread)
  public deleteThread: Emittable<number>;

  private fab: View;
  private fabPlus: View;
  private modal: View;

  public fabTop = 0;
  public fabLeft = 0;
  public fabSize = 56;
  public modalOpen = false;
  public showError = false;
  private caregiver: Caregiver;

  // Delete Section variables
  public deleteSelection = false;
  public selectedForDeletion: boolean[] = [];
  public enableDeleteButton = false;

  // Group Selection variables
  public groupText = 'Create Group';
  public isGroupSelection = false;
  public selectedRecipients: { recipient: MessageRecipient, selected: boolean }[] = [];
  private checkBoxes = [];
  public enableContinueButton = false;

  constructor(private routerHelper: RouterHelper, private page: Page) { }

  ngOnInit() {
    this.pullMessageThreads.emit(null);
    this.pullMessageRecipients.emit(null);

    this.page.on('navigatingTo', (data) => {
      FileStorageService.iosDeleteTempFolderContents();
      if (this.modalOpen) {
        this.fabTap(true);
      }
    });

    this.recipients$.pipe(take(2)).subscribe(recipients => {
      if (recipients) {
        this.selectedRecipients = [];
        recipients.forEach(r => {
          this.selectedRecipients.push({ recipient: r, selected: false });
        });
      }
    });

    this.fab = this._fabRef.nativeElement;
    this.fabPlus = this._fabPlusRef.nativeElement;
    this.modal = this._modalRef.nativeElement;

    this.modal.opacity = 0;

    if (isAndroid) {
      this.fab.top = screen.mainScreen.heightDIPs * 0.72;
    } else {
      this.fab.top = screen.mainScreen.heightDIPs * 0.8;
    }
    this.fab.left = screen.mainScreen.widthDIPs * 0.8;

    this.fabTop = this.fab.top;
    this.fabLeft = this.fab.left;

    this.caregiver$.pipe(first()).subscribe(caregiver => {
      this.caregiver = caregiver;
    });
  }

  refreshList(args) {
    const refreshPull = args.object;

    this.pullMessageThreads.emit(null);

    this.loading$.pipe(take(2)).subscribe(loading => {
      if (!loading) {
        if (refreshPull) {
          refreshPull.refreshing = false;
        }
      }
    });
  }

  getDisplayName(thread: Message): string {
    const rs: MessageRecipient[] = [];

    for (let i = 0; i < thread.recipients.length; i++) {
      if (thread.recipients[i].ltcUniqueCaregiverId !== `${this.caregiver.Id}`) {
        rs.push(thread.recipients[i]);
      }
    }

    if (rs.length > 1) {
      return `${rs[0].name} + ${rs.length - 1}`;
    } else {
      return `${rs[0].name}`;
    }
  }

  trashIconTap() {
    this.deleteSelection = !this.deleteSelection;
    this.selectedForDeletion = [];
    this.enableDeleteButton = false;

    if (this.deleteSelection) {
      this.threads$.pipe(first()).subscribe(threads => {
        threads.forEach(thread => {
          this.selectedForDeletion.push(false);
        });
      });
    }
  }

  deleteThreadTap() {
    const parentIds: number[] = [];

    this.threads$.pipe(first()).subscribe(threads => {
      for (let i = 0; i < this.selectedForDeletion.length; i++) {
        if (this.selectedForDeletion[i]) {
          parentIds.push(threads[i].cwParentMessageId);
        }
      }

      this.deleteThread.emitMany(parentIds);
      this.trashIconTap();
    });
  }

  fabTap(isOpen: boolean) {
    if (isOpen === this.modalOpen) {
      this.animateFab(this.modalOpen);
      this.modalOpen = !this.modalOpen;
    }
  }

  threadTap(thread: Message, index: number) {
    if (this.deleteSelection) {
      this.selectedForDeletion[index] = !this.selectedForDeletion[index];

      for (let i = 0; i < this.selectedForDeletion.length; i++) {
        if (this.selectedForDeletion[i]) {
          this.enableDeleteButton = true;
          return;
        }
      }

      this.enableDeleteButton = false;
    } else {
      this.pullMessages.emit(thread.cwParentMessageId);
      this.routerHelper.navigate(['messaging/messaging']);
    }
  }

  groupTap() {
    this.isGroupSelection = !this.isGroupSelection;
    if (this.isGroupSelection) {
      this.groupText = 'Cancel Group';
    } else {
      this.groupText = 'Create Group';
      this.selectedRecipients.forEach(r => {
        r.selected = false;
      });
      this.enableContinueButton = false;
      this.checkBoxes = [];
    }
  }

  checkboxLoaded(args) {
    this.checkBoxes.push(args);
  }

  recipientTap(recipient: MessageRecipient, index) {
    if (this.isGroupSelection) {
      this.checkBoxes[index].object.checked = !this.checkBoxes[index].object.checked;

      setTimeout(() => {
        this.selectedRecipients[index].selected = this.checkBoxes[index].object.checked;
        this.enableContinueButton = this.checkSelectedRecipients();
      }, 200);

      if (isAndroid) {
        if (this.checkBoxes[index].object.checked) {
          this.checkBoxes[index].object.fillColor = '#038424';
        } else {
          this.checkBoxes[index].object.fillColor = '#593c81';
        }
      }
    } else {
      this.threads$.pipe(first()).subscribe(threads => {
        let sameRecipientThread: Message;

        for (let i = 0; i < threads.length; i++) {
          if (threads[i].recipients.length === 2) {
            const threadRecipient = threads[i].recipients.find(r => r.ltcUniqueCaregiverId !== `${this.caregiver.Id}`);

            if (threadRecipient.cwUniqueCaregiverId === recipient.cwUniqueCaregiverId) {
              sameRecipientThread = threads[i];
              break;
            }
          }
        }

        if (sameRecipientThread) {
          this.pullMessages.emit(sameRecipientThread.cwParentMessageId);
          this.routerHelper.navigate(['messaging/messaging']);
        } else {
          this.routerHelper.navigate(['messaging/messaging', { newRecipients: JSON.stringify([recipient])}]);
        }
      });
    }
  }

  continueNewGroupTap() {
    this.threads$.pipe(first()).subscribe(threads => {
      // Going through the selected Recipients, then sorting and then taking only the cwUniqueCaregiverId
      const newRecipientList = customSort(this.selectedRecipients.filter(r => r.selected).map(r => r.recipient), 'name');
      const newRecipientIds = newRecipientList.map(r => r.cwUniqueCaregiverId);
      let sameRecipientsThread: Message;

      for (let i = 0; i < threads.length; i++) {
        const threadRecipients = threads[i].recipients;

        if (threadRecipients.length - 1 === newRecipientList.length) {
          // Doing the same as above, but doing for each thread that has the same amount of receipients.
          const sortedList = customSort(threadRecipients.filter(r => r.ltcUniqueCaregiverId !== `${this.caregiver.Id}`), 'name');
          const threadIds = sortedList.map(r => r.cwUniqueCaregiverId);

          if (JSON.stringify(newRecipientIds) === JSON.stringify(threadIds)) {
            sameRecipientsThread = threads[i];
            break;
          }
        }
      }

      if (sameRecipientsThread) {
        this.pullMessages.emit(sameRecipientsThread.cwParentMessageId);
        this.routerHelper.navigate(['messaging/messaging']);
      } else {
        this.routerHelper.navigate(['messaging/messaging', { newRecipients: JSON.stringify(newRecipientList)}]);
      }
    });
  }

  getDateFormat(date: string): string {
    const d = new Date(date);
    const now = new Date();

    if (d.getFullYear() === now.getFullYear() && d.getDate() === now.getDate()) {
      return 'h:mm a';
    } else {
      return 'MMM d';
    }
  }

  getInitials(name: string): string {
    name = name.replace(/[0-9]/g, '');
    return name.match(/\b(\w)/g).join('');
  }

  private checkSelectedRecipients() {
    for (let i = 0; i < this.selectedRecipients.length; i++) {
      if (this.selectedRecipients[i].selected) {
        return true;
      }
    }
    return false;
  }

  private animateFab(reverse: boolean) {
    const ani1: JsAnimationDefinition = {
      curve: d3.easeExpInOut,
      getRange: () => this.orderRange({ from: this.fabTop, to: 0 }, reverse),
      step: (v) => this.fab.top = v
    };
    const ani2: JsAnimationDefinition = {
      curve: d3.easeExpInOut,
      getRange: () => this.orderRange({ from: this.fabLeft, to: 0 }, reverse),
      step: (v) => this.fab.left = v
    };
    const ani3: JsAnimationDefinition = {
      curve: d3.easeExpInOut,
      getRange: () => this.orderRange({ from: this.fabSize, to: screen.mainScreen.heightDIPs }, reverse),
      step: (v) => this.fab.height = v
    };
    const ani4: JsAnimationDefinition = {
      curve: d3.easeExpInOut,
      getRange: () => this.orderRange({ from: this.fabSize, to: screen.mainScreen.widthDIPs }, reverse),
      step: (v) => this.fab.width = v
    };
    const ani5: JsAnimationDefinition = {
      curve: d3.easeExpInOut,
      getRange: () => this.orderRange({ from: this.fabSize / 2, to: 0 }, reverse),
      step: (v) => this.fab.borderRadius = v
    };
    const ani6: JsAnimationDefinition = {
      curve: d3.easeExpInOut,
      getRange: () => this.orderRange({ from: 1, to: 0 }, reverse),
      step: (v) => this.fabPlus.opacity = v
    };
    const ani7: JsAnimationDefinition = {
      curve: d3.easeExpInOut,
      getRange: () => this.orderRange({ from: 0, to: 1 }, reverse),
      step: (v) => this.modal.opacity = v
    };

    animate(600, [ani1, ani2, ani3, ani4, ani5, ani6, ani7]);
  }

  private orderRange(range: AnimationRange, rev: boolean): AnimationRange {
    return {
      from: rev ? range.to : range.from,
      to: rev ? range.from : range.to
    };
  }
}
