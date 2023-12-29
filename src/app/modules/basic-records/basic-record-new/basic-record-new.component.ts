import { Component } from '@angular/core';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { user } from '../../auth/_models/User';
import { UserService } from '../../auth/_services/user.service';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { BehaviorSubject } from 'rxjs';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CloseExpedientModalComponent } from '../close-expedient-modal/close-expedient-modal.component';
import { NotesComponent } from '../../notes/notes.component';
import * as _ from 'lodash';
@Component({
  selector: 'app-basic-record-new',
  templateUrl: './basic-record-new.component.html',
  styleUrls: ['./basic-record-new.component.css']
})


export class BasicRecordNewComponent {
  record: AsistenciaDiariaEmpleadorResponse;
  listAbogados: any[];
  user: any;
  estadoExpediente: string

  estadoAutomatico: string
  idEstadoExpediente: number
  estadoDescripcion: string
  estadoCodigo: string

  recordDetailId: number;
  nationalityDrop: DropDownOptionModel[] = [];
  civilStatusDrop: DropDownOptionModel[] = [];
  identificationDrop: DropDownOptionModel[] = [];
  typeApplicantDrop: DropDownOptionModel[] = [];
  sexDrop: DropDownOptionModel[] = [];
  reasonOfVisitDrop: DropDownOptionModel[] = [];
  rTEDrop: DropDownOptionModel[] = [];
  abogadosDrop: DropDownOptionModel[] = [];
  referidoDrop: DropDownOptionModel[] = [];
  estadosManualExpedienteDrop: DropDownOptionModel[] = [];
  expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);

  constructor(private route: ActivatedRoute, private router: Router, private httpService: HttpClientService,
    private modalService: NgbModal,
    private sweet: SweetAlertService,
    private ngBModal: NgbModal,
    private users: UserService) { }

  ngOnInit(): void {
    this.user = this.users.getUserData() as user;

    this.recordDetailId = this.route.snapshot.params['id'];
    this.getListAbogado();
    this.getNationality()
    this.getCivilStatus()
    this.getTypeOfIdentification()
    this.getSex()
    this.getTypeOfApplicant()
    this.getRepresentanteTrabajadorEmpleador()
    this.getReasonOfVisit()
    this.getReferido()
    this.getAsistenciaJudicial(this.recordDetailId)
    this.loadInformationExpedient();
  }

  getAsistenciaJudicial(recordDetailId: number) {
    this.httpService.getAsistenciaDiariaEmpleadorById(recordDetailId).subscribe(
      response => {
        this.record = response
      },
      error => console.error(error)
    );
  }

  get asistenciaDiariaEsTrabajador() {
    return `${this.record?.asistenciaDiaria?.tipoSolicitante?.descripcion}`.toLowerCase().includes('trabajador')
  }

  get expedientCerrado(): boolean {
    return this.estadoCodigo === 'CERR' || this.estadoCodigo === 'SOLCIE' || this.user.roleCode === 'PLEGA'
  }

  codigo: string
  loadInformationExpedient() {
    this.expedientResult.subscribe(expedientResult => {
      if (expedientResult) {
        this.estadoAutomatico = expedientResult?.estado?.descripcion || ""
        this.idEstadoExpediente = expedientResult?.idEstado
        this.estadoDescripcion = expedientResult?.estado?.descripcion || ""
        this.codigo = expedientResult?.codigo
        this.estadoCodigo = expedientResult?.estado?.codigoReferencia || ""
      }
    });
  }

  get EstadoNombre() {
    return this.estadoDescripcion
  }

  getNationality() {
    this.httpService.get<any[]>('Nationality').subscribe((data) => {
      this.nationalityDrop = data;
    });
  }

  getCivilStatus() {
    this.httpService.get<any[]>(`CivilStatus`).subscribe((data) => {
      this.civilStatusDrop = data;
    });
  }

  getTypeOfIdentification() {
    this.httpService.get<any[]>(`TypeOfIdentification`).subscribe((data) => {
      this.identificationDrop = data;
    });
  }

  getSex() {
    this.httpService.get<any[]>(`Sex`).subscribe((data) => {
      this.sexDrop = data;
    });
  }

  getTypeOfApplicant() {
    this.httpService.get<any[]>(`TypeOfApplicant`).subscribe((data) => {
      this.typeApplicantDrop = data;
    });
  }

  getRepresentanteTrabajadorEmpleador() {
    this.httpService.get<any[]>(`RepresentanteTrabajadorEmpleador`).subscribe(
      (data) => {
        this.rTEDrop = data;
      }
    );
  }

  getReasonOfVisit() {
    this.httpService.get<any[]>(`ReasonOfVisit`).subscribe((data) => {
      this.reasonOfVisitDrop = data;
    });
  }

  getReferido() {
    this.httpService.get<any[]>(`Referido`).subscribe((data) => {
      this.referidoDrop = data;
    });
  }

  getListAbogado() {
    this.httpService.get<any[]>('User/UserByRol?rolId=6').subscribe((data) => {
      this.abogadosDrop = data;
      this.listAbogados = data;
    });
  }

  getEstadosManualesExpediente() {
    this.httpService.get<any[]>('ExpedientManualStatus').subscribe((data) => {
      this.estadosManualExpedienteDrop = data;
    });
  }

  get AbogadoPrincipal() {
    if (this.listAbogados && this.record?.asistenciaDiaria?.idAbogado) {
      const abogado = this.listAbogados.find(x => x.userId === this.record?.asistenciaDiaria?.idAbogado)
      return abogado?.fullNameAll || ""
    }
  }

  get AbogadoAlternoNombre() {
    if (this.listAbogados && this.record?.asistenciaDiaria?.idAbogadoAlterno) {
      const abogado = this.listAbogados.find(x => x.userId === this.record?.asistenciaDiaria?.idAbogadoAlterno)
      return abogado?.fullNameAll || ""
    }
  }
  
  showIconTo(form: "EmpresaFormalizada", show: boolean) {
    let icono = document.getElementById(`iconoCheck${form}`) as HTMLElement;
    console.log(show && icono?.classList)
    if (show && icono?.classList) {
      icono?.classList.remove('fa-clock-o');
      icono?.classList.add('fa-check-circle-o')
    } else if (icono?.classList) {
      icono?.classList.add('fa-clock-o');
      icono?.classList.remove('fa-check-circle-o');
    }
  }

  async guardarTodo() {
    this.showLoadingSpinner(true, 'btnSaveAll');

    const expediente = await this.httpService.getExpedientById(this.expedientResult?.value?.idExpediente);

    if (expediente) {
      const expedienteDemandante = await this.httpService.getExpedienteDemandanteByExpedienteId(this.expedientResult?.value?.idExpediente)

      if (expedienteDemandante && expediente?.fechaAlta) {

        this.showLoadingSpinner(false, 'btnSaveAll');

        return this.sweet.record('success', `Expediente Creado Exitosamente`,
          `Se ha creado su expediente con el <strong>No. ${this.expedientResult?.value?.codigo}.</strong>`,
          `Puede ir a la pantalla de historial para ver modificar los datos.`).then(x => {
            this.router.navigateByUrl('/Expedientes/historial')
          });
      }

      this.showLoadingSpinner(false, 'btnSaveAll');
    }

    this.showLoadingSpinner(false, 'btnSaveAll');

    this.sweet.record('warning', 'Favor verificar que este toda la información completada o intente nuevamente!', ``, ``);
  }

  openModal() {
    const modalRef = this.modalService.open(CloseExpedientModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.record = this.record;
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.expedientResult = this.expedientResult;
    modalRef.componentInstance.estadoExpediente = this.estadoExpediente;
    modalRef.componentInstance.EstadoNombre = this.EstadoNombre;
    modalRef.componentInstance.estadosManualExpedienteDrop = this.estadosManualExpedienteDrop;
    modalRef.componentInstance.expedientCerrado = this.expedientCerrado;

    modalRef.closed.subscribe(() => {});
  }

  onPressAddNote() {
    const ngmodalorderNote: NgbModalRef = this.ngBModal.open(
      NotesComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false, centered: true
    });
    ngmodalorderNote.componentInstance.serviceOrderNumber = _.cloneDeep(this.expedientResult?.value?.codigo);
    ngmodalorderNote.componentInstance.edit.subscribe(t => {});

  }

  async showLoadingSpinner(isLoading: boolean, btnId: string) {
    let btn = document.getElementById(btnId) as HTMLButtonElement;

    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa fa-spin fa-spinner"></i>'
    } else {
      btn.disabled = false;
      btn.innerHTML = 'Guardar';
    }
  }
}
