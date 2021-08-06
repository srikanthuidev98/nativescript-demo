import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Select } from '@ngxs/store';
import { AppState } from '../states/app.state';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { RouterHelper } from '../helpers/router.helper';

/**
 * This guard will kick the user back to the login screen if they are no longer logged in.
 */
@Injectable()
export class AuthGuard implements CanActivate {

  @Select(AppState.getIsAuth) isAuth$: Observable<boolean>;

  constructor(private routerHelper: RouterHelper) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isAuth$.pipe(first(), map(isAuth => {
      if (isAuth) {
          return true;
      } else {
          this.routerHelper.replace(['/login']);
          return false;
      }
    }));
  }
}
