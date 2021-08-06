import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AppState } from '../../../../ACCommon/states/app.state';
import { DialogHelper } from '../../../../ACCommon/helpers';
import { ImageHelper } from '../../../../ACCommon/helpers/image.helper';
import { Profile, Caregiver, Client } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';
import { PayRateType } from '../../../../ACCommon/enums';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('scrollview', { static: true }) scrollview: ElementRef;

  @Select(AppState.getClients) clients$: Observable<Client[]>;
  @Select(AppState.getProfileInfo) profileInfo$: Observable<Profile>;
  @Select(AppState.getCaregiver) caregiver$: Observable<Caregiver>;

  @Emitter(AppState.deleteProfilePicture)
  public deleteProfilePicture: Emittable<null>;

  @Emitter(AppState.uploadProfilePicture)
  public uploadProfilePicture: Emittable<null>;

  constructor(private imageHelper: ImageHelper, private dialogHelper: DialogHelper) { }

  public path = '';
  public address: string;
  public initals: string;
  public credentials = '';
  public showFinancialInfo = true;
  public uniqueClients: [Client[]] = [[]];
  public selectedClient = -1;

  ngOnInit() {
    this.clients$.pipe(first()).subscribe(clients => {
      this.uniqueClients.pop();
      for (let i = clients.length - 1; i > -1;) {
        const foundClients = clients.filter(c => c.Id === clients[i].Id).map(fc => {
          fc.extra = '';

          if (fc.RegistryProvider) {
            fc.extra = `$${fc.PayRate} `;
          }

          if (fc.PayRateType === PayRateType.Daily) {
            fc.extra += 'per day';
          } else if (fc.PayRateType === PayRateType.Shift) {
            fc.extra += 'per shift';
          } else {
            fc.extra += 'per hour';
          }

          if (fc.extra.charAt(0) === 'p') {
            fc.extra = fc.extra.charAt(0).toUpperCase() + fc.extra.slice(1);
          }

          if (!fc.PayRateComment) {
            fc.PayRateComment = '(No rate comment)';
          }

          return fc;
        });

        this.uniqueClients.unshift(foundClients);
        i = i - foundClients.length;
      }

      this.showFinancialInfo = clients[0].showFinancialInfo;
    });

    this.profileInfo$.pipe(first()).subscribe(info => {
      if (info) {
        this.initals = info.Name.match(/\b(\w)/g).join('');
        this.credentials = info.Credentials.join(', ');

        this.address = info.Address.replace(',', '\n') + '\n' + info.SecondAddress.replace(', ', '\n');
      }
    });

    if (FileStorageService.checkIfFileExists(FileStorageService.getFilePath('profile-pic.jpeg'))) {
      this.path = FileStorageService.getFilePath('profile-pic.jpeg');
    }
  }

  pictureTap() {
    const showDeleteOption = this.path !== '';

    this.dialogHelper.pictureActionDialog(showDeleteOption).then(result => {
      switch (result) {
        case 'Choose Picture':
          this.choosePicture();
          break;
        case 'Take Picture':
          this.takePicture();
          break;
        case 'Delete Picture':
          this.deletePicture();
          break;
      }
    });
  }

  choosePicture() {
    this.imageHelper.choosePicture().then(() => {
      this.showImage();
    }, error => {
      console.log(error);
    });
  }

  takePicture() {
    this.imageHelper.takePicture().then(() => {
      this.showImage();
    }, error => {
      console.log(error);
    });
  }

  deletePicture() {
    this.deleteProfilePicture.emit(null);
    this.path = '';
  }

  showImage() {
    if (FileStorageService.checkIfFileExists(FileStorageService.getFilePath('profile-pic.jpeg'))) {
      this.path = '';
      setTimeout(() => {
        this.path = FileStorageService.getFilePath('profile-pic.jpeg');
      }, 100);
    }
  }

  clientTap(i: number) {
    if (i === this.selectedClient) {
      this.selectedClient = -1;
    } else {
      this.selectedClient = i;

      setTimeout(() => {
        this.scrollview.nativeElement.scrollToVerticalOffset(this.scrollview.nativeElement.scrollableHeight, true);
      }, 150);
    }
  }
}
