import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { ImageSource, fromNativeSource} from 'tns-core-modules/image-source';
import { ModalDialogParams } from 'nativescript-angular/directives/dialogs';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';

// Resgister DrawingPad
registerElement('DrawingPad', () => require('nativescript-drawingpad').DrawingPad);

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements OnInit {

  @ViewChild('DrawingPad', {static: true }) DrawingPad: ElementRef;

  constructor(private mParams: ModalDialogParams) { }

  ngOnInit() { }

  saveSignature() {
    // get reference to the drawing pad
    const pad = this.DrawingPad.nativeElement;
    // then get the drawing (Bitmap on Android) of the drawingpad
    pad.getDrawing().then(drawingImage => {
        const fileName = FileStorageService.createFileName('signature', '.jpeg');

        const img: ImageSource = <ImageSource> fromNativeSource(drawingImage);
        const saved: boolean = img.saveToFile(FileStorageService.getFilePath(fileName), 'jpeg');

        if (saved) {
            console.log('Image saved successfully!');
            this.closeModal(fileName);
        } else {
          console.log('Image was NOT saved');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  clearMyDrawing() {
    const pad = this.DrawingPad.nativeElement;
    pad.clearDrawing();
  }

  closeModal(fileName: string) {
    this.mParams.closeCallback(fileName);
  }
}
