import { Directive } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

/**
 * Only used for Mobile. This is a way to hide the action bar for Android on the login page.
 */
@Directive({
  selector: '[appHideActionBar]'
})
export class HideActionBarDirective {
  constructor(private page: Page) {
    this.page.actionBarHidden = true;
  }
}
