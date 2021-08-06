import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { Message, Caregiver, MessageRecipient, DialogData } from '../../../../ACCommon/models';
import { TextView } from 'tns-core-modules/ui/text-view';
import { isIOS, EventData, Page } from 'tns-core-modules/ui/page';
import { ItemEventData, ListView } from 'tns-core-modules/ui/list-view';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable, Subscription } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { customSort } from '../../../../ACCommon/helpers/sort.helper';
import { MessageService } from '../../../../ACCommon/services/data/message.service';
import { AttachmentType } from '../../../../ACCommon/enums';
import { ImageSource } from 'tns-core-modules/image-source';
import { FilePickerHelper, ModalHelper } from '../../../../ACCommon/helpers';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { ImageHelper } from '../../../../ACCommon/helpers/image.helper';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';
import * as base64 from 'base-64';

@Component({
  selector: 'ns-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, OnDestroy {

  // This needs to be static because templateSelector cannot reach non-static variables.
  private static caregiver: Caregiver;

  @ViewChild('listview', { static: true }) _listviewRef: ElementRef;

  @Select(AppState.getCaregiver) caregiver$: Observable<Caregiver>;
  @Select(AppState.getMessages) messages$: Observable<Message[]>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.pullMessageThreads)
  public pullMessageThreads: Emittable<null>;

  @Emitter(AppState.pullMessages)
  public pullMessages: Emittable<number>;

  @Emitter(AppState.postNewMessageThread)
  public postNewMessageThread: Emittable<Message>;

  @Emitter(AppState.replyMessage)
  public replyMessage: Emittable<Message>;

  public title = '';
  private messageSub: Subscription;
  private listview: ListView;
  public tv: TextView;
  public showControls = true;
  public showSend = false;
  public newRecipients: MessageRecipient[] = [];
  private recipients: MessageRecipient[] = [];
  private retrieveMessageThreads = false;
  private startLoadingAttachments = false;


  public dialogData: DialogData;
  public dialogOpen = false;

  constructor(private route: ActivatedRoute, private page: Page, private messageService: MessageService,
    private modalHelper: ModalHelper, private vcRef: ViewContainerRef, private imageHelper: ImageHelper,
    private filePickerHelper: FilePickerHelper) { }

  messages: Message[] = [];

  ngOnInit() {
    this.listview = this._listviewRef.nativeElement;

    this.page.on('navigatingFrom', (data) => {
      if (this.retrieveMessageThreads) {
        this.pullMessageThreads.emit(null);
      }
      setTimeout(() => {
        this.pullMessages.emit(null);
      }, 500);
    });

    this.caregiver$.pipe(first()).subscribe(cg => {
      MessagingComponent.caregiver = cg;
    });

    // Checks to see if its an array or not, and then adds the recipients to the varible
    const newR = JSON.parse(this.route.snapshot.paramMap.get('newRecipients'));
    if (newR) {
      if (Array.isArray(newR)) {
        this.newRecipients = newR;
      } else {
        this.newRecipients.push(newR);
      }

      if (this.newRecipients.length > 1) {
        this.title = `${this.newRecipients[0].name} +${this.newRecipients.length - 1}`;
      } else {
        this.title = this.newRecipients[0].name;
      }
      this.recipients = this.newRecipients;
    } else {
      this.messages$.pipe(take(2)).subscribe(messages => {
        if (messages.length > 0) {
          const rs: MessageRecipient[] = [];
          for (let i = 0; i < messages[0].recipients.length; i++) {
            if (messages[0].recipients[i].ltcUniqueCaregiverId !== `${MessagingComponent.caregiver.Id}`) {
              rs.push(messages[0].recipients[i]);
            }
          }

          customSort(rs, 'name');
          this.recipients = rs;

          if (rs.length === 1) {
            this.title += rs[0].name;
          } else {
            this.title = `${rs[0].name} +${rs.length - 1}`;
          }
        }
      });
    }

    this.messageSub = this.messages$.subscribe(messages => {
      this.messages = messages;
      if (messages) {
        setTimeout(() => {
          this.listview.scrollToIndex(this.messages.length - 1);
        }, 50);
      }
    });
  }

  ngOnDestroy(): void {
    this.messageSub.unsubscribe();
  }

  titleTapped() {
    let names = '';
    for (let i = 0; i < this.recipients.length; i++) {
      if (i === this.recipients.length - 1) {
        names += this.recipients[i].name;
      } else {
        names += this.recipients[i].name + '\n';
      }
    }
    this.dialogData = {
      title: 'Recipients',
      message: names,
      color: '#593c81'
    };

    this.dialogOpen = true;
  }

  textViewLoaded(args: TextView) {
    this.tv = args;
  }

  onItemLoading(args: ItemEventData) {
    if (isIOS) {
      const iosCell = args.ios;
      iosCell.selectionStyle = UITableViewCellSelectionStyle.None;
    }

    if (!this.startLoadingAttachments) {
      if (this.messages.length <= 10 || args.index === this.messages.length - 10) {
        this.startLoadingAttachments = true;
      }
    }

    if (this.startLoadingAttachments && !this.messages[args.index].file && this.messages[args.index].filename) {
      this.getMessageAttachment(this.messages[args.index]);
    }
  }

  templateSelector(message: Message) {
    if (message.ltcUniqueCaregiverId === `${MessagingComponent.caregiver.Id}`) {
      return 'sent';
    } else {
      return 'received';
    }
  }

  textViewTap() {
    // Used to scroll the list view to the bottom when the user taps on the text view.
    setTimeout(() => {
      this.dialogOpen = false;
      this.listview.scrollToIndex(this.messages.length - 1);
    }, 200);
  }

  disableTapHighlight() {}

  choosePicture() {
    this.imageHelper.choosePicture(true).then(imageSource => {
      this.sendImage(imageSource);
    }, error => {
      console.log(error);
    });
  }

  takePicture() {
    this.imageHelper.takePicture(true).then(imageSource => {
      this.sendImage(imageSource);
    }, error => {
      console.log(error);
    });
  }

  chooseAttachment() {
    this.filePickerHelper.chooseSingleFile().then(res => {
      this.sendTap(res.base64String, res.filename);
    }).catch(err => {
      console.log(err);
    });
  }

  private sendImage(imageSource: ImageSource) {
    if (imageSource) {
      const filename = FileStorageService.createFileName('image', '.jpeg');

      const file = imageSource.toBase64String('jpeg');

      this.sendTap(file, filename);
    } else {
      console.log('Error: No Image Source.');
    }
  }

  onTextChange(args: EventData) {
    const tv = args.object as TextView;

    if (tv.text.split(/\r\n|\r|\n/).length > 4 || tv.text.length > 120) {
      this.tv.height = (this.tv.getMeasuredHeight() / 2);
    } else {
      this.tv.height = 'auto';
    }

    if (tv.text.length > 0) {
      this.showSend = true;
      // this.showControls = false;
    } else {
      this.showSend = false;
      // this.showControls = true;
    }
  }

  arrowTapped() {
    this.showControls = true;
  }

  showDateSplit(index: number) {
    if (index === 0) {
      return true;
    }

    const pTimestamp = new Date(this.messages[index - 1].timestamp);
    const curTimestamp = new Date(this.messages[index].timestamp);

    if (pTimestamp.getFullYear() === curTimestamp.getFullYear() && pTimestamp.getDate() !== curTimestamp.getDate()) {
      return true;
    }

    return false;
  }

  sendTap(file?: string, filename?: string) {
    const newMessage: Message = {
      ltcUniqueCaregiverId: `${MessagingComponent.caregiver.Id}`,
      cwUniqueCaregiverId: '',
      cwMessageId: 0,
      cwParentMessageId: null,
      wasRead: false,
      isRecipient: false,
      timestamp: null,
      updatedWhen: null,
      sentBy: '',
      content: this.tv.text,
      unreadMessageCount: 0,
      recipients: []
    };

    if (file && filename) {
      newMessage.filename = filename;
      newMessage.file = file;
    }

    if (this.newRecipients && this.newRecipients.length > 0) {
      this.newThread(newMessage);
    } else {
      this.reply(newMessage);
    }

    this.tv.text = '';
    this.showControls = true;
    this.tv.dismissSoftInput();
    this.retrieveMessageThreads = true;
  }

  private reply(message: Message) {
    message.cwParentMessageId = this.messages[0].cwParentMessageId;

    this.replyMessage.emit(message);
  }

  private newThread(message: Message) {
    message.recipients = this.newRecipients;

    this.postNewMessageThread.emit(message);
    this.newRecipients = [];
  }

  closeDialog(args) {
    this.dialogOpen = false;
  }

  imageTapped(message: Message) {
    this.modalHelper.openFullscreenModal(ImageModalComponent, this.vcRef,
      {source: message.attachmentSource, filename: message.filename}).then((res: string) => {});
  }

  attachmentTapped(index: number) {
    if (this.messages[index].attachmentSource) {
      const message = this.messages[index];
      FileStorageService.saveFileToDownloads(message.attachmentSource, message.filename);
    }
  }

  getMessageAttachment(message: Message) {
    if (message.loadingAttachment) {
      return;
    }

    console.log('Loading...', message.filename);

    message.loadingAttachment = true;

    this.messageService.apiGetAttachment(MessagingComponent.caregiver.APIToken, MessagingComponent.caregiver.Id,
      message.cwMessageId, message.filename).pipe(first()).subscribe(resData => {

      message.file = resData.file;

      if (resData.fileType === AttachmentType.Image) {
        const loadedSource64 = ImageSource.fromBase64Sync(resData.file);
        if (loadedSource64 ) {
          message.attachmentSource = loadedSource64;
        }
      } else {
        const binaryString = base64.decode(resData.file);
        message.attachmentSource = binaryString;
      }

      message.loadingAttachment = false;
  },
  (error) => {
    message.loadingAttachment = false;
    console.log(error);
  });
  }
}
