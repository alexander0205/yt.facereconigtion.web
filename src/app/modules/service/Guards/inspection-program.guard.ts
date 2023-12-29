import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { inspectionProgram } from '../service/inspection-program/_models/inspectionProgram';

@Injectable({
  providedIn: 'root'
})
export class InspectionProgramGuard implements Resolve<any>{
  constructor(private http: HttpClientService, private router: Router) {

  }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<inspectionProgram> {
    if (route.paramMap.get('id')) {
      let inspectionProgram:inspectionProgram
      await this.http.get<any>(`InspectionProgram/${route.paramMap.get('id')}`).toPromise().then(
        program => {
          inspectionProgram = program
        }
      ).catch(p => {
        inspectionProgram = null

      })
return inspectionProgram;
  }
  else{this.router.navigate['ordenServicio']}
}
}
