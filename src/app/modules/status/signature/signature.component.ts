import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../../../ACCommon/states/app.state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Client, ClientContact, SubmitActionRequest } from '../../../../ACCommon/models';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';
import { ModalHelper } from '../../../../ACCommon/helpers';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {

  @Select(AppState.getEditShift) editShift$: Observable<SubmitActionRequest>;
  @Select(AppState.getCurrentClient) client$: Observable<Client>;

  @Emitter(AppState.submitAction)
  public submitAction: Emittable<SubmitActionRequest>;

  public contactList: ClientContact[];
  public signees: Array<string>;
  public fraudStatement = '';
  public selectedContactId = -1;
  public isChecked = false;
  public pathDest = '';
  public signatureName = '';

  constructor(private modalHelper: ModalHelper, private vcRef: ViewContainerRef) {}

  ngOnInit() {
    this.client$.pipe(first()).subscribe(client => {
      const showFraud = client.ShowFraudStatement;
      this.fraudStatement = `For ${client.CustomerState} residents, ${client.FraudStatement}`;
      this.contactList = client.ClientContacts;

      if (this.contactList && this.contactList.length > 0) {
        this.signees = [];

        this.contactList.forEach(contact => {
          this.signees.push(contact.FirstName + ' ' + contact.LastName);
        });
      } else {
        console.log(`Signee List Does Not Exisit`);
        this.signees = [];
        this.signees.push(client.Name);
      }
    });
  }

  sign() {
    this.editShift$.pipe(first()).subscribe(editShift => {
      editShift.visit.SignatureContact = this.selectedContactId;

      this.submitAction.emit(editShift);
    });
  }

  public onchange(index: number) {
    if (this.contactList) {
      this.selectedContactId = this.contactList[index].ContactId;
      console.log('Dropdown selected: ', this.contactList[index].FirstName);
    } else {
      this.selectedContactId = 0;
      console.log('Dropdown selected: No contact list though');
    }
  }

  public openSignatureModal() {
    this.modalHelper.openFullscreenModal(SignaturePadComponent, this.vcRef).then(signatureName => {
      this.signatureName = signatureName;
      this.pathDest = FileStorageService.getFilePath(signatureName);
    });
  }
}
