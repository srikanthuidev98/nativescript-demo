import { Component, OnInit, Input } from '@angular/core';
import { RouterHelper } from '../../../../ACCommon/helpers/router.helper';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { AppState } from '../../../../ACCommon/states/app.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Client, DualClient, ScheduleVisit } from '../../../../ACCommon/models';
import { first, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LoadingHelper } from '../../../../ACCommon/helpers';
import { PayRateType } from '../../../../ACCommon/enums';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {

  @Input() showActionBar = true;
  @Input() home = undefined;

  @Select(AppState.getClients) clients$: Observable<Client[]>;
  @Select(AppState.getLoading) loading$: Observable<boolean>;

  @Emitter(AppState.getClientsFromDb)
  public getClientsFromDb: Emittable<boolean>;

  @Emitter(AppState.setCurrentClient)
  public setCurrentClient: Emittable<Client>;

  @Emitter(AppState.setCurrentDualClient)
  public setCurrentDualClient: Emittable<DualClient>;

  @Emitter(AppState.setHistoryClient)
  public setHistoryClient: Emittable<Client>;

  @Emitter(AppState.pullPayrollData)
  public pullPayrollData: Emittable<null>;

  public backBtnText = '';
  public from = '';
  public labelText = '';

  public dot = '\u2022';

  public fromCheckIn = false;
  public outerClientList: [Client[]] = [[]];
  public showPayrateList: boolean[] = [];
  public showDualPayrateList: boolean[] = [];
  public outerDualClientList: [DualClient[]] = [[]];

  constructor(private routerHelper: RouterHelper, private route: ActivatedRoute, private loadingHelper: LoadingHelper) { }

  ngOnInit() {
    this.backBtnText = this.route.snapshot.paramMap.get('backBtnText');
    this.from = this.route.snapshot.paramMap.get('from'); // Grabs route parameter

    if (this.from === 'checkin') {
      this.fromCheckIn = true;
    } else {
      this.pullPayrollData.emit(null); // Payroll and CurrentPayroll
    }

    this.labelText = 'Select your client below to continue';

    this.populateClients();
  }

  populateClients(refreshPull?: any) {
    this.outerClientList.pop();
    this.outerDualClientList.pop();

    this.clients$.pipe(first()).subscribe(clients => {
      if (!clients || clients.length === 0) {
        this.labelText = 'You have no clients assigned';
      }

      clients.forEach((c, cIndex) => {
        let found = false;

        this.outerClientList.forEach((cList, index) => {
          if (cList[0] && c.Id === cList[0].Id) {
            found = true;
            let dupe = false;
            cList.forEach((client, i) => {
              if (client.CaregiverId === c.CaregiverId) {
                dupe = true;
              }
              if (i === cList.length - 1 && !dupe) {
                this.outerClientList[index].push(c);
              }
            });
          }
        });

        if (!found) {
          const clientArray: Client[] = [];
          clientArray.push(c);
          this.outerClientList.push(clientArray);
          this.showPayrateList.push(false);
        }

        // Checks if there are any dual Clients. (Spouse Clients)
        if (cIndex === clients.length - 1) {
          this.outerClientList.forEach((clientList, index) => {
            if (clientList[0].Relatives) {
              for (let i = index + 1 ; i < this.outerClientList.length; i++) {
                clientList[0].Relatives.forEach(relative => {
                  if (relative === this.outerClientList[i][0].Id) {

                    const spouse1List = clientList;
                    const spouse2List = this.outerClientList[i];
                    const dualClientList: DualClient[] = [];

                    const names: string[] = [];

                    spouse1List.forEach((spouse1, spouseIndex) => {
                      spouse2List.forEach(spouse2 => {
                        if (spouse1.PayRateType === spouse2.PayRateType) {
                          dualClientList.push({c1: spouse1, c2: spouse2});
                          names.push(`${spouse1.Name} ${spouse2.Name} ${spouse1.PayRateComment}/${spouse2.PayRateComment}`);
                        }
                      });

                      if (spouseIndex === spouse1List.length - 1) {
                        this.outerDualClientList.push(dualClientList);
                        this.showDualPayrateList.push(false);
                      }
                    });
                  }
                });
              }
            }
          });

          if (refreshPull) {
            refreshPull.refreshing = false;
          }
        }
      });
    });
  }

  refreshList(args) {
    const refreshPull = args.object;

    this.getClientsFromDb.emit(false);

    this.loading$.pipe(take(2)).subscribe(loading => {
      if (!loading) {
        setTimeout(() => {
          this.populateClients(refreshPull);
        }, 500);
      }
    });
  }

  onClientTap(index: number) {
    this.from = this.route.snapshot.paramMap.get('from'); // Grabs route parameter
    if (this.from !== 'checkin') {
      this.loadingHelper.showIndicator();
    }

    switch (this.from) {
      case 'checkin':
        this.checkInClientTap(index);
        break;
      case 'current-period':
        this.setHistoryClient.emit(this.outerClientList[index][0]);
        this.routerHelper.navigate(['/status/current-period']);
        break;
      case 'history':
        this.setHistoryClient.emit(this.outerClientList[index][0]);
        this.routerHelper.navigate(['/history']);
        break;
      default:  // This is when you import the component into another component. EX: checkout-container
        this.setHistoryClient.emit(this.outerClientList[index][0]);
        this.routerHelper.navigate(['/status/current-period']);
        break;
    }
  }

  public getPayRateType(payRateNumber: number): string {
    return PayRateType[payRateNumber];
  }

  private checkInClientTap(index: number) {
    if (this.outerClientList[index].length > 1) { // Outer client list has more than 1 Payrate. So show PayRate list
      this.showPayrateList[index] = !this.showPayrateList[index];
    } else { // Outer client list only has 1 client.
      this.setCurrentClient.emit(this.outerClientList[index][0]);
      this.setCurrentDualClient.emit(undefined);

      this.navigateOnCheckIn(this.outerClientList[index][0]);
    }
  }

  onPayrateTap(outerClientIndex: number, clientIndex: number) { // Sends payrate client, Only for Checkin
    this.setCurrentClient.emit(this.outerClientList[outerClientIndex][clientIndex]);
    this.setCurrentDualClient.emit(undefined);

    this.navigateOnCheckIn(this.outerClientList[outerClientIndex][clientIndex]);
  }

  onDualClientTap(index: number) {
    if (this.outerDualClientList[index].length > 1) { // Outer dual client list has more than 1 Payrate. So show PayRate list
      this.showDualPayrateList[index] = !this.showDualPayrateList[index];
    } else { // Outer client list only has 1 client.
      this.setCurrentClient.emit(undefined);
      this.setCurrentDualClient.emit(this.outerDualClientList[index][0]);

      this.navigateOnCheckIn(this.outerDualClientList[index][0].c1);
    }
  }

  onDualPayrateTap(outerDualClientIndex: number, dualClientIndex: number) { // Sets dual payrate clients, Only for Checkin
    this.setCurrentClient.emit(undefined);
    this.setCurrentDualClient.emit(this.outerDualClientList[outerDualClientIndex][dualClientIndex]);

    this.navigateOnCheckIn(this.outerDualClientList[outerDualClientIndex][dualClientIndex].c1);
  }

  private navigateOnCheckIn(client: Client) {
    if (client.askCheckInQuestions && client.Questions && client.Questions.length > 0) {
      this.routerHelper.navigate(['/status/additional-questions', { from: 'checkin'}]);
    } else {
      this.routerHelper.navigate(['/status/record-audio']);
    }
  }
}
