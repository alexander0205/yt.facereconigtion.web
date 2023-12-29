import { Injectable } from '@angular/core';
type NombreAcordeon = 'flush-collapseOne' | 'EmpresaFormalizada-collapseOne' | 'flush-collapseThree' | 'flush-collapseFour' | 'flush-collapseFive' | 'flush-collapseSix' | 'flush-collapseSevent' | 'flush-collapseEight';

@Injectable({
  providedIn: 'root'
})
export class AccordeonOpenCloseExpedientService {

  constructor() { }

  abrirAcordeon(nombreAcordeon: NombreAcordeon, mostrarIcono: boolean) {
    const acordeon = document.getElementById(nombreAcordeon);
    const icono = document.getElementById(`iconoCheck${nombreAcordeon}`) as HTMLElement;

    if (acordeon && icono?.classList) {
      acordeon.classList.add('show');

      if (mostrarIcono) {
        icono.classList.remove('fa-clock-o');
        icono.classList.add('fa-check-circle-o');
      } else {
        icono.classList.remove('fa-check-circle-o');
        icono.classList.add('fa-clock-o');
      }
    }
  }

   cerrarAcordeon(nombreAcordeon: NombreAcordeon) {
    const acordeon = document.getElementById(nombreAcordeon);
    const icono = document.getElementById(`iconoCheck${nombreAcordeon}`) as HTMLElement;

    if (acordeon && icono?.classList) {
      acordeon.classList.remove('show');
      icono.classList.remove('fa-clock-o');
      icono.classList.add('fa-check-circle-o');
    }
  }
}
