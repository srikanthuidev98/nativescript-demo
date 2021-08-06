import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/common';
import { ImageSource } from 'tns-core-modules/image-source';
import { PinchGestureEventData, PanGestureEventData, GestureEventData } from 'tns-core-modules/ui/gestures';
import { View, layout } from 'tns-core-modules/ui/page';
import { FileStorageService } from '../../../../ACCommon/storage/file-storage';

@Component({
  selector: 'ns-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {

  @ViewChild('image', { static: true }) _imageRef: ElementRef;

  public source: ImageSource;
  public imageName: string;
  public image: View;

  public states = ['unknown', 'start', 'change', 'end'];
  public density: number;
  public prevDeltaX: number;
  public prevDeltaY: number;
  public startScale = 1;

  constructor(private mParams: ModalDialogParams) { }

  ngOnInit() {
    this.image = this._imageRef.nativeElement;

    if (this.mParams.context) {
      this.source = this.mParams.context.source;
      this.imageName = this.mParams.context.filename;
    } else {
      console.log('Please add the visit to the context.');
    }

    this.density = layout.getDisplayDensity();
    this.image.translateX = 0;
    this.image.translateY = 0;
    this.image.scaleX = 1;
    this.image.scaleY = 1;
  }

  saveTap() {
    FileStorageService.saveImageToGallery(this.source, this.imageName);
  }

  closeTap() {
    this.mParams.closeCallback();
  }

  onPan(args: PanGestureEventData) {
    // console.log("PAN[" + this.states[args.state] + "] deltaX: " + Math.round(args.deltaX) + " deltaY: " + Math.round(args.deltaY));
    // console.log("PAN state: " + this.states[args.state] + " ; PAN args.state: " + args.state);

    if (args.state === 1) {
        this.prevDeltaX = 0;
        this.prevDeltaY = 0;
    } else if (args.state === 2) {
        this.image.translateX += args.deltaX - this.prevDeltaX;
        this.image.translateY += args.deltaY - this.prevDeltaY;

        this.prevDeltaX = args.deltaX;
        this.prevDeltaY = args.deltaY;
    }

    // this.updateStatus();
}

  onPinch(args: PinchGestureEventData) {
    // console.log("PINCH[" + this.states[args.state] + "] scale: " + args.scale + " focusX: "
    // + args.getFocusX() + " focusY: " + args.getFocusY());

    if (args.state === 1) {
        const newOriginX = args.getFocusX() - this.image.translateX;
        const newOriginY = args.getFocusY() - this.image.translateY;

        const oldOriginX = this.image.originX * this.image.getMeasuredWidth();
        const oldOriginY = this.image.originY * this.image.getMeasuredHeight();

        this.image.translateX += (oldOriginX - newOriginX) * (1 - this.image.scaleX);
        this.image.translateY += (oldOriginY - newOriginY) * (1 - this.image.scaleY);

        this.image.originX = newOriginX / this.image.getMeasuredWidth();
        this.image.originY = newOriginY / this.image.getMeasuredHeight();

        this.startScale = this.image.scaleX;
    } else if (args.scale && args.scale !== 1) {
        let newScale = this.startScale * args.scale;
        newScale = Math.min(8, newScale);
        newScale = Math.max(0.125, newScale);

        this.image.scaleX = newScale;
        this.image.scaleY = newScale;
    }
}

  onDoubleTap(args: GestureEventData) {

    this.image.animate({
        translate: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        curve: 'easeOut',
        duration: 300
    }).then(() => {});
  }
}
