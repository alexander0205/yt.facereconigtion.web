import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../auth/_services/user.service';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/_services/toast/toast.service';

@Component({
  selector: 'app-reopen-case-modal',
  templateUrl: './reopen-case-modal.component.html',
  styleUrls: ['./reopen-case-modal.component.css']
})
export class ReopenCaseModalComponent {
  reaperturarCasoForm: FormGroup;

  motivosReapertura: any;
  user: any;
  userName: string;
  estadoReapertura: any;
  numeroRegistro: any;

  @Input() recordId: number | undefined;
  recordDetails: any;
  
  constructor(private httpService: HttpClientService, 
              private users: UserService, 
              private toast: ToastService,
              private formBuilder: FormBuilder, public ngbActiveModal: NgbActiveModal,) {}

  async ngOnInit() {
    this.user = this.users.getUserData();
    this.userName = this.user.firstName + ' ' + this.user.firstLastName;

    this.getMotivoReapertura();
    this.getRecordDataToFillForm(this.recordId);

    this.reaperturarCasoForm = this.formBuilder.group({
      nRegistro: new FormControl({value: '', disabled: true}),
      estadoActual: new FormControl({value: '', disabled: true}),
      user: new FormControl({value: this.userName, disabled: true}),
      motivoReapertura: new FormControl(0),
      fecha: new FormControl(new Date()),
    });


    // console.log(this.reaperturarCasoForm.value);
  }

  //Get data from the API to fill the form
  getRecordDataToFillForm(id: number) {
    this.httpService.getRecordToReopenCase(id).subscribe((expediente: any) => {
      this.recordDetails = expediente;
      console.log(this.recordDetails);
      console.log(this.recordDetails.codigo);

      this.reaperturarCasoForm.patchValue({
        nRegistro: this.recordDetails.codigo,
        estadoActual: this.recordDetails.estado?.descripcion || this.recordDetails?.estado
      })
    }, (error) => {
      console.error('Ha ocurrido un problema: ', error);

      this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
    })
  }

  /**
   * Get data for the list of Motivo reapertura
   */
  getMotivoReapertura() {
    this.httpService.getAllMotivoReapertura().subscribe(response => {
      this.motivosReapertura = response;
    });
  }

  //Send the info to API for reopen case
  reopenCase() {
    if (!this.reaperturarCasoForm.valid) {
      alert('Hay Campos vacio o incorrectos en el formulario');
      return;
    } 

    let idExpediente = this.recordDetails.idExpediente;
    let idMotivoReapertura = parseInt(this.reaperturarCasoForm.value.motivoReapertura); 
    
    this.httpService.reOpenCaseService({idExpediente, idMotivoReapertura}).subscribe(response => {
      console.log(response);
    }, (error) => {
      console.error(error);

      this.toast.error(
        'favor inténtelo mas tarde!',
        'Ha ocurrido un error'
      );
    });

    setTimeout(() => this.ngbActiveModal.close(true), 2000);
  }

  closeModal() {
    this.ngbActiveModal.close(true)
  }
}
