import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { DialogData, dialogCloseEvent, Visit } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { RedirectHelper } from '../../../../ACCommon/helpers';

@Component({
  selector: 'app-checkout-container',
  templateUrl: './checkout-container.component.html',
  styleUrls: ['./checkout-container.component.scss']
})
export class CheckoutContainerComponent implements OnInit {

  @Select(AppState.getCurrentVisit) visit$: Observable<Visit>;
  @Select(AppState.getCurrentVersionDialogData) currentVersionDialogData$: Observable<DialogData>;

  constructor(private redirectHelper: RedirectHelper) { }

  public selectedTab = 0;

  // Dialog Variables
  public dialogOpen = false;
  public dialogData: DialogData;

  ngOnInit() {
    setTimeout(() => {
      this.currentVersionDialogData$.pipe(first()).subscribe(dialogData => {
        if (dialogData) {
          this.dialogData = dialogData;
          this.dialogOpen = true;
        }
      });
    }, 1000);
  }

  tabTap(tabNumber: number) {
    this.selectedTab = tabNumber;
  }

  closeDialog(event: dialogCloseEvent) {
    // this.dialogOpen = false;
    this.redirectHelper.goToAppStorePage();
  }
}
