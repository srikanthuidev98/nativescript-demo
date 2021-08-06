import { Injectable } from '@angular/core';

import {LoadingIndicator, OptionsCommon} from '@nstudio/nativescript-loading-indicator';
import { isIOS } from 'tns-core-modules/ui/page/page';

/**
 * Helper service to provide a loading indicator for Web, Android, iOS.
 *
 * If using for a API call, please use this helper in the State files.
 */
@Injectable({ providedIn: 'root' })
export class LoadingHelper {
    public loader = new LoadingIndicator();

    constructor() { }

    /**
     * Show loading indicator.
     *
     * *MOBILE*
     * If you want additional message details, please pass a string parameter
     */
    showIndicator(message: string = 'Loading...') {
      let options: OptionsCommon;

      if (isIOS) {
        options = {
          message: message,
          dimBackground: true,
          color: '#593c81',
          userInteractionEnabled: false,
          backgroundColor: '#ffffff'
        };
      } else {
        options = {
          message: message,
          margin: 30,
          dimBackground: true,
          color: '#593c81',
          userInteractionEnabled: false
        };
      }

      this.loader.show(options);
    }

    /**
     * Hide loading indicator.
     *
     * This will hide ANY loading indicator that may be showing.
     */
    hideIndicator() {
        this.loader.hide();
    }
}
