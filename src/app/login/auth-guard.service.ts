import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.service.isLogin) {
      return true;
    } else {
      this.service.redirectTo = state.url;
      this.router.navigate(['login']);
      return false;
    }
  }
  constructor(private service: LoginService, private router: Router) { }
}
