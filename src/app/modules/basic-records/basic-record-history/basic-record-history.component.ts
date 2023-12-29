import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToolsService } from '../../shared/tools/tools.service';
import { NgbCalendar, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';
import { convertoDateEs } from '../../shared/_models/utils';
import { ToastService } from '../../shared/_services/toast/toast.service';
import { AvanceSearchComponent } from '../../avance-search/avance-search.component';
import { IAdvanceSearchProperties } from '../../avance-search/IAdvanceSearchProperties';
import moment from 'moment';
import { ReopenCaseModalComponent } from '../reopen-case-modal/reopen-case-modal.component';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { UserService } from '../../auth/_services/user.service';
import { BehaviorSubject } from 'rxjs';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basic-record-history',
  templateUrl: './basic-record-history.component.html',
  styleUrls: ['./basic-record-history.component.css']
})
export class BasicRecordHistoryComponent implements OnInit {
  p: number = 1;
  recordData: any[];
  recordDataFiltered: any;

  sortProperty: string = 'id';
  sortOrder = 1;
  reaperturarCasoForm: FormGroup;
  searchForm: FormGroup;
  currentPage = 1;
  itemPerPage = 10;
  localRepresentativeDrop: any[] = [];
  estadosManualExpedienteDrop: DropDownOptionModel[] = [];
  advanceSearchProperties: IAdvanceSearchProperties
  formBuilder: any;
  record: AsistenciaDiariaEmpleadorResponse;

  user: any;
  userName: string;
  expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);
  idEstadoExpediente: number
  estadoDescripcion: string
  estadoExpediente: string
  nombreTipoEmpleador: string

  constructor(private httpService: HttpClientService,
    private fb: FormBuilder,
    private tool: ToolsService,
    private calendarS: NgbCalendar,
    private sweet: SweetAlertService,
    private toast: ToastService,
    private modalService: NgbModal,
    public ngbActiveModal: NgbActiveModal,
    private users: UserService,
  ) { }

  maxDate = { year: this.calendarS.getToday().year, month: this.calendarS.getToday().month, day: this.calendarS.getToday().day }

  registro: any;

  async ngOnInit() {
    this.user = this.users.getUserData();

    this.userName = this.user.firstName + ' ' + this.user.firstLastName;
    
    this.searchForm = this.fb.group({
      sinceDate: new FormControl(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().substring(0, 10)),
      untilDate: new FormControl(new Date().toISOString().substring(0, 10)),
      LocalRep: new FormControl(null),
      show: new FormControl(false),
      almostClose: new FormControl(false),
      textFilter: ['']
    });
    
    this.getRlt()
    this.getRecords();

    this.reaperturarCasoForm = this.fb.group({
      nRegistro: [''],
      estadoActual: [this.recordDataFiltered],
      user: [this.userName],
      motivoReapertura: [0, Validators.required],
      fecha: [new Date()],
    });

    this.setNombreTipoEmpleador();
  }

  loadInformationExpedient() {
    this.expedientResult.subscribe(expedientResult => {
      if (expedientResult) {
        this.idEstadoExpediente = expedientResult?.idEstado
        this.estadoDescripcion = expedientResult?.estado?.descripcion || ""
      }
    });
  }

  getRltDescription(value) {
    return `${this.localRepresentativeDrop?.find(x => x.value == value)?.text}`.replace(/\d+\s*-\s*/, "");
  }

  getRecords() {
    this.currentPage = 1
    this.searchForm.patchValue({ textFilter: "" })
    let since = this.searchForm.get('sinceDate').value
    let until = this.searchForm.get('untilDate').value
    let FromDate = this.tool.formatDate(since)
    let ToDate = this.tool.formatDate(until)
    const ID_AsistenciaDiariaRLT = this.searchForm.get('LocalRep').value

    this.httpService.getAllExpedient(FromDate, ToDate, ID_AsistenciaDiariaRLT, this.advanceSearchProperties).subscribe((response: any) => {
      const _data = response.sort((a, b) => {
        return b.idExpediente - a.idExpediente;
      });

      console.log(_data);

      this.recordData = _data;
      this.recordDataFiltered = _data;
      console.log(this.recordDataFiltered);
    }, () => {
      this.recordData = []
      this.recordDataFiltered = []

      this.sweet.record('warning', 'No hay datos que cumplan con esta condición', ``, ``);
    })
  }

  getEstadosManualesExpediente() {
    this.httpService.get<any[]>('ExpedientManualStatus').subscribe((data) => {
      this.estadosManualExpedienteDrop = data;
    });
  }
  
  getRlt() {
    this.httpService.get<any[]>('LocalRepresentativeProvince').subscribe((data) => {
      this.localRepresentativeDrop = data;
    });
  }

  EstadoNombre(idEstadoExpediente) {
    return idEstadoExpediente > 0 ? this.estadosManualExpedienteDrop.find(x => x.value === idEstadoExpediente)?.text : "Pendiente"
  }

  dateRageFilter() {
    this.getRecords()
  }

  get totalPages(): number {
    return Math.ceil((this?.recordData?.length || 0) / this?.itemPerPage);
  }

  get displayedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemPerPage;
    const endIndex = startIndex + this.itemPerPage;

    return this.recordData?.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  exportToExcel() {
    const fileName = "Expediente"
    const header = ["NO. EXPEDIENTE", "FECHA REGISTRO", "TIPO EMPLEADOR", "RLT", "TIPO SOLICITANTE", "ESTADO"]
    const data = this.recordDataFiltered.map(ad => [ad.codigo,
    convertoDateEs(ad),
    ad.asistenciaDiariaEmpleador.tipoEmpleador === 'FISICA' ? 'Persona Fisica' : 'Empresa Formalizada',
    this.getRltDescription(ad?.asistenciaDiariaEmpleador?.asistenciaDiaria?.idRepLocalProvinciaCatalog),
    ad?.asistenciaDiariaEmpleador?.asistenciaDiaria?.tipoSolicitante?.descripcion,
    ad?.estado?.descripcion

    ])
    this.tool.exportToExcel(header, data, fileName)
  }

  pressDowloadPdf(serviceOrder: string) {
    this.showLoading('Descarga en curso...')

    this.httpService.dowloadPDFExpediente(serviceOrder).subscribe((blob: any) => {
      this.tool.downloadFile(blob, "pdf", serviceOrder)
    }, error => {
      this.toast.error('favor inténtelo mas tarde!', 'Error al descargar el archivo PDF')
    });
  }

  openBusquedaAvanzada() {
    const modalRef = this.modalService.open(AvanceSearchComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.isAsistenciaJudicial = false;
    modalRef.componentInstance.advanceSearchProperties = this.advanceSearchProperties
    modalRef.closed.subscribe((value) => {
      this.advanceSearchProperties = value;
      this.getRecords()
    });
  }

  filterInput(query: string) {

    this.recordDataFiltered = this.recordData; // Reasignar antes de filtrar
    if (query != '') {
      query = query.toLocaleLowerCase(); // Convertir la consulta a minúsculas una vez en lugar de en cada comprobación
      console.log(this.recordDataFiltered)
      this.recordDataFiltered = this.recordDataFiltered.filter((data) => {
        // Comprueba si alguno de los campos contiene la consulta
        const tipoEmpleador = data.asistenciaDiariaEmpleador.tipoEmpleador == 'FISICA' ? 'Persona Fisica' : 'Empresa Formalizada'
        const rlt = this.getRltDescription(data?.idRepLocalProvinciaCatalog)
        return `${data.codigo}`.toLocaleLowerCase().includes(query) ||
          (data?.fechaAlta && `${moment(data?.fechaAlta).format("DD/MM/YYYY")}`.toLocaleLowerCase().includes(query)) ||
          (tipoEmpleador && `${tipoEmpleador}`.toLocaleLowerCase().includes(query)) ||
          (rlt && `${rlt}`.toLocaleLowerCase().includes(query)) ||
          (data?.estado?.descripcion && `${data?.estado?.descripcion}`.toLocaleLowerCase().includes(query)) ||
          (data?.asistenciaDiariaEmpleador?.asistenciaDiaria?.tipoSolicitante?.descripcion && `${data?.asistenciaDiariaEmpleador?.asistenciaDiaria?.tipoSolicitante?.descripcion}`.toLocaleLowerCase().includes(query))
      });


    }
  }
  
  // Dort data by Date
  sortByDate(property: string) {
    this.recordDataFiltered.sort((a, b) => {
      const dateA = Date.parse(a[property]);
      const dateB = Date.parse(b[property]);
      
      if (this.ascendingOrder) {
        return dateB - dateA; // Orden descendente (más reciente arriba)
      } else {
        return dateA - dateB; // Orden ascendente (más antiguo arriba)
      }
    });
    
    this.ascendingOrder = !this.ascendingOrder;
  }

  // Sort data by Numero de Registro
  ascendingOrder = true;
  sortByCodeNumber(property: string) {
    this.recordDataFiltered.sort((a,b) => {
      if (this.ascendingOrder) {
        return a[property].localeCompare(b[property]);
      } else {
        return b[property].localeCompare(a[property]);
      }
    });

    this.ascendingOrder = !this.ascendingOrder;
  }

  sortIcon(property: string) {
    if (property === this.sortProperty) {
      return this.sortOrder === 1 ? '↑' : '↓';
    }
    return '';
  }

  openModal(recordId: number) {
    const modalRef = this.modalService.open(ReopenCaseModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.recordId = recordId;

    modalRef.closed.subscribe(() => {
      location.reload();
    });
  }

  setNombreTipoEmpleador() {
    let referenceCode = this.recordDataFiltered.asistenciaDiariaEmpleador.asistenciaDiaria.tipoSolicitante.codigoReferencia;
    var employerType = this.recordDataFiltered.asistenciaDiariaEmpleador.tipoEmpleador;

    if (referenceCode === "TRABAJADOR") {
      this.nombreTipoEmpleador = "Datos Laborales"
    } else if (employerType === "FISICA") {
      this.nombreTipoEmpleador = "Persona Fisica"
    } else {
      this.nombreTipoEmpleador = "Empresa Formalizada"
    }
  }

  showLoading(title:string) {
    Swal.fire({
      title: title,
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading();
      }
    })
  }
}


