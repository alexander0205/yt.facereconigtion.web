import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }


  alert(icon: SweetAlertIcon, title: string, text: string): void {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    })

  }

  record(icon: SweetAlertIcon, title: string, subTitle: string, text: string) {
    return Swal.fire({
      title: title,
      icon: icon,
      html:
        `<b>${subTitle}</b><br/> ` +
        `<a>${text}</a>`,
      buttonsStyling: false,
      customClass: {
        confirmButton: "rounded-pill btn btn-entendido mb-5 "
      }
      ,
      confirmButtonText:
        'Entendido'

    })

  }
  async leave() {
    await Swal.fire({
      title: 'Quieres salir del formulario?',
      text: "Toda tu informacion se perdera",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'

    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        false
      }
    })
  }
}
