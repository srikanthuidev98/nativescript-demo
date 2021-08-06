import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AnimationHelper } from '../../../../ACCommon/helpers';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { DialogData, dialogCloseEvent } from '../../../../ACCommon/models';

/**
 * This is a global custom dialog that can be called anywhere in the app.
 *
 * Please use the DialogHelper service to use this class.
 * Use either customDialog() or CustomDialogWithButtons()
 */
@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class CustomDialogComponent implements OnInit {

  @Input() data: DialogData;

  @Output() dialogClosed = new EventEmitter();

  private _dialog: any;
  private dialogAnimationDuration = 200;

  constructor(private animationhelper: AnimationHelper) { }

  ngOnInit() {}

  dialogLoaded(view) {
    this._dialog = view;
    this.animationhelper.slideInto(this._dialog, 0, 'up', this.dialogAnimationDuration);
  }

  closeDialog(event: dialogCloseEvent) {
    if (!this.data.cannotCloseDialog) {
      this.animationhelper.slideAway(this._dialog, 'up', this.dialogAnimationDuration);
      setTimeout(() => {
        this.dialogClosed.emit(event);
      }, this.dialogAnimationDuration + 50);
    } else {
      this.dialogClosed.emit(event);
    }
  }

  // Used for Android. The closeDialog function would go through the GirdLayout if it doesn't have a tap function.
  ignoreTap() {}

  onItemLoading(args) {
    if (isIOS) {
      const iosCell = args.ios;
      iosCell.selectionStyle = UITableViewCellSelectionStyle.None;
    }
  }
}
