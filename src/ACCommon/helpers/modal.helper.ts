import { Injectable, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/directives/dialogs';

@Injectable({ providedIn: 'root' })
export class ModalHelper {

    constructor(private modalService: ModalDialogService) { }

    openFullscreenModal(component: any, vcRef: ViewContainerRef, context = {}): Promise<any> {
        const options: ModalDialogOptions = {
            viewContainerRef: vcRef,
            fullscreen: true,
            context: context
        };

        return this.modalService.showModal(component, options);
    }

    openModal(component: any, vcRef: ViewContainerRef, context = {}): Promise<any> {
        const options: ModalDialogOptions = {
            viewContainerRef: vcRef,
            fullscreen: false,
            context: context
        };

        return this.modalService.showModal(component, options);
    }
}
