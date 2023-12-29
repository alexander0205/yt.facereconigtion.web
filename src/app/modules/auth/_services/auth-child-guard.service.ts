import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { SesionServiceService } from 'src/app/_services/sesion-service.service';
import { AuthService } from './auth.service';
@Injectable()
export class AuthChildGuardService implements CanActivateChild {
  constructor(public auth: AuthService, public router: Router, public sessionService: SesionServiceService) {

    this.sessionService.getUserLoggedIn().subscribe(t => {
      this.session = t
    })
  }
  session: boolean;
  canActivateChild(): boolean {



    if (!this.auth.checkToken() && this.session) {

      this.auth.logOut();
      return false;

    }

    return true;
  }
}