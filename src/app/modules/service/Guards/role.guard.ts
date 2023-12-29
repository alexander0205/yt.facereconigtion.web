import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { user } from "../../auth/_models/User";
import { UserService } from "../../auth/_services/user.service";

@Injectable({ providedIn: 'root' })

export class RoleGuard implements CanActivate {
    constructor(private user: UserService, private ARoute: Router) { }
    currentUser: user = this.user.getUserData();

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this.currentUser) {
            if (this.currentUser.checkAuthorization(this.ARoute.url, 'K') || this.currentUser.checkAuthorization(this.ARoute.url, 'H') || this.currentUser.checkAuthorization(this.ARoute.url, 'C')) {
                return true
            }
            return false
        } else {
            return false
        }
    }
}