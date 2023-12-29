import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface puedeSalir {
  permitirSalirDelRoute: () => Observable<boolean> | Promise<boolean> | boolean
}

@Injectable({
  providedIn: 'root'
})
export class CanExitGuard  {
  canDeactivate(component: puedeSalir) {
    return component.permitirSalirDelRoute ? component.permitirSalirDelRoute() : true


  }

}
