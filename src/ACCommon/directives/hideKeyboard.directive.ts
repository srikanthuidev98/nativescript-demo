import { Directive, HostListener } from '@angular/core';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { ad } from 'tns-core-modules/utils/utils';

/**
 * Add this directive at the root layout of any component to give click to dismiss keyboard property.
 */
@Directive({
  selector: '[appHideKeyboard]'
})
export class HideKeyboardDirective {

  private iqKeyboard: IQKeyboardManager;

  @HostListener('tap') onTap() {
    if (!isIOS) {
      ad.dismissSoftInput();
    }
    // if (isIOS) {
    //   UIApplication.sharedApplication.keyWindow.endEditing(true);
    // } else {
    //   ad.dismissSoftInput();
    // }
  }

  constructor() {
    if (isIOS && !this.iqKeyboard) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.shouldResignOnTouchOutside = true;
    }
  }
}
