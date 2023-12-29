import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _toastrService: ToastrService) { }

  success(message: string, title: string = '¡Éxito!'): void {
    this._toastrService.success(message, title);
  }

  warning(message: string, title: string = '¡Advertencia!'): void {
    this._toastrService.warning(message, title);
  }

  info(message: string, title: string = '¡Info!'): void {
    this._toastrService.info(message, title);
  }

  error(message: string, title: string = '¡Ha ocurrido un error inesperado!'): void {
    this._toastrService.error(message, title);
  }
}
