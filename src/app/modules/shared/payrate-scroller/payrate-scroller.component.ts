import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Client } from '../../../../ACCommon/models';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { PayRateType } from '../../../../ACCommon/enums';

@Component({
  selector: 'app-payrate-scroller',
  templateUrl: './payrate-scroller.component.html',
  styleUrls: ['./payrate-scroller.component.scss']
})
export class PayrateScrollerComponent implements OnInit {

  @Select(AppState.getClients) clients$: Observable<Client[]>;

  @Input() client: Client = undefined;

  @Output() filterChanged = new EventEmitter();

  public clientList: Client[] = [];
  public payRateList: string[] = ['All Rates'];
  public filter = 0;

  constructor() { }

  ngOnInit() {
    if (!this.client) {
      return;
    }

    this.clients$.pipe(first()).subscribe(clients => {
      clients.forEach(c => {
        if (c.Id === this.client.Id) {
          this.clientList.push(c);
          const payRate = this.payRateList.find(rate => rate === c.PayRateComment);
          if (!payRate) {
            if (c.PayRateComment) {
              this.payRateList.push(c.PayRateComment);
            } else {
              this.payRateList.push(PayRateType[c.PayRateType]);
            }
          }
        }
      });
    });
  }

  scrollBarLoaded(args) {
    const listView = args.object;
    if (listView.ios) {
      listView.ios.showsHorizontalScrollIndicator = false;
    } else {
      listView.android.setHorizontalScrollBarEnabled(false);
    }
  }

  filterTap(filterNumber: number) {
    this.filter = filterNumber;
    if (this.filter === 0) {
      this.filterChanged.emit({ caregiverId: 0, payRateComment: 'All'});
    } else {
      const client = this.clientList[filterNumber - 1];
      this.filterChanged.emit({ caregiverId: client.CaregiverId, payRateComment: client.PayRateComment});
    }
  }
}
