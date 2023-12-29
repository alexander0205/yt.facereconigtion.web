import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { UserService } from '../service/user-service-form/_model/UserService';

@Injectable({
  providedIn: 'root'
})
export class UserServiceResolverGuard  implements Resolve<any>{
  constructor(private http: HttpClientService, private router: Router) {

  }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<UserService> {
    if (route.paramMap.get('id')) {
      let UserService:UserService
      await this.http.get<any>(`UserService/${route.paramMap.get('id')}`).toPromise().then(
        service => {
          UserService = service
        }
      ).catch(p => {
        UserService = null

      })
return UserService;
  }
  else{this.router.navigate['ordenServicio']}
}
}
