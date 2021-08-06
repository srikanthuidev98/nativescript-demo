import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { FingerprintService } from '../../../../ACCommon/services/fingerprint.service';

@Component({
  selector: 'app-touch-id-terms',
  templateUrl: './touch-id-terms.component.html',
  styleUrls: ['./touch-id-terms.component.scss']
})
export class TouchIdTermsComponent implements OnInit {

  constructor(private mParams: ModalDialogParams, private fingerprintService: FingerprintService) { }

  ngOnInit() {}

  acceptTap() {
    this.mParams.closeCallback('accept');
  }

  declineTap() {
    this.mParams.closeCallback('decline');
  }
}
