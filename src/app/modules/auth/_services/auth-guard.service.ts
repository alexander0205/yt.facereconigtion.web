import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SesionServiceService } from 'src/app/_services/sesion-service.service';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuardService  {
  constructor(public auth: AuthService, public router: Router, public sessionService: SesionServiceService) {
    this.sessionService.getUserLoggedIn().subscribe(t => {
      this.session = t
    })
  }
  session: boolean;
  canActivate(): boolean {

    if (!this.auth.isAuthenticated()) {

      this.router.navigate(['login']);
      return false;

    }

    return true;
  }
}