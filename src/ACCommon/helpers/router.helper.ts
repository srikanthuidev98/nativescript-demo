import { Injectable } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { BackstackEntry } from 'tns-core-modules/ui/frame/frame';
import { ActivatedRoute } from '@angular/router';

/**
 * This RouterHelper is used to navigate around the app.
 *
 * Please only use this RouterHelper when navigating.
 */
@Injectable({ providedIn: 'root' })
export class RouterHelper {
  constructor(private router: RouterExtensions, private activeRoute: ActivatedRoute) {}

  /**
   * Used to replace the current view and not give the user a way to go back.
   *
   * @param commands The actual link to the component you want to go to.
   *
   * EX: ['/status/checkin']
   */
  replace(commands: any[]) {
    this.router.navigate(commands, { clearHistory: true });
  }

  /**
   * Used to replace the current view and will let the user go back.
   *
   * @param commands The actual link to the component you want to go to.
   *
   * EX: ['/status/checkin']
   */
  navigate(commands: any[]) {
    this.router.navigate(commands, { transition: { name: 'slide' }});
  }

  nestedNavigate(commands: any[], activeRoute) {
      this.router.navigate(commands, { relativeTo: activeRoute });
  }

  backToPreviousPage() {
    this.router.backToPreviousPage();
  }

  /**
   * Only use with nestedNavigation
   */
  back() {
    if (this.router.canGoBack()) {
      this.router.back();
    }
  }
}
