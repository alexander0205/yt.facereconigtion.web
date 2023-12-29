import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { ToastService } from 'src/app/modules/shared/_services/toast/toast.service';

@Component({
  selector: 'app-sucursales-modal',
  templateUrl: './sucursales-modal.component.html',
  styleUrls: ['./sucursales-modal.component.css']
})
export class SucursalesModalComponent {
  
  @Input() coincidencias: any;
  @Output() rnlSeleccionado = new EventEmitter<string>();
  @ViewChild('rnl') campoRNLInput: ElementRef;
  
  empresaFormalizadaForm: FormGroup;
  companyFiltered: string = '';

  p: number = 1;

  constructor(private formBuilder: FormBuilder, 
              private toast: ToastService, 
              public activeModal: NgbActiveModal,
              private HttpService: HttpClientService,) {}

  ngOnInit() {
    this.empresaFormalizadaForm = this.formBuilder.group({
      rnl: ['']
    });
  }

  setRnlNumber(index: number) {
    if (index >= 0 && index < this.coincidencias.length) {
      const rnlValue = this.coincidencias[index].rnl;
      
      this.rnlSeleccionado.emit(rnlValue);
    }
  }

  closeModal() { this.activeModal.close('cerrado'); }

  filterByNameOrRNL() {
    if (!this.companyFiltered || this.companyFiltered == '' || this.companyFiltered == null) {
      this.toast.error('', 'Introduzca el numero de RNL, por favor.');
      return this.coincidencias;
    } 

    let rnlName = this.companyFiltered;
    
    let result = this.coincidencias.filter(s => 
      s.nombreComercial.toLowerCase().match(rnlName.toLowerCase()) || 
      s.rnl.match(rnlName));

    this.coincidencias = result;
  }
}
