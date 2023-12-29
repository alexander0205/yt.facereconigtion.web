import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from 'src/app/modules/shared/_models/dateFormat';
import * as _ from 'lodash';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/modules/shared/_services/sweetAlert/sweet-alert.service';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { DropDownOptionModel } from 'src/app/modules/shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { convertoDateEs } from 'src/app/modules/shared/_models/utils';
import { ToastService } from 'src/app/modules/shared/_services/toast/toast.service';
import { AvanceSearchComponent } from 'src/app/modules/avance-search/avance-search.component';
import { IAdvanceSearchProperties } from 'src/app/modules/avance-search/IAdvanceSearchProperties';
import moment from 'moment';
import { user } from 'src/app/modules/auth/_models/User';
import { UserService } from '../../../auth/_services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-record-history',
  templateUrl: './record-history.component.html',
  styleUrls: ['./record-history.component.css'], providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class RecordHistoryComponent implements OnInit {
  user: any;
  searchForm: FormGroup;
  recordData: any[];
  recordDataFiltered: any;
  multipleRltResult: any; //Propiedad para mostrar los registros de las multiples RLT del usuario logueado 
  filterList: any;
  currentPage = 1;
  itemPerPage = 10;
  localRepresentativeDrop: DropDownOptionModel[] = [];
  registerType: string;
  advanceSearchProperties: IAdvanceSearchProperties
  p: number = 1;

  sortProperty: string = 'id';
  sortOrder = 1;

  constructor(private httpService: HttpClientService, private route: Router,
    private fb: FormBuilder,
    private tool: ToolsService,
    private toast: ToastService,

    private modalService: NgbModal,
    private sweet: SweetAlertService, private users: UserService) { }

  async ngOnInit() {
    this.user = this.users.getUserData() as user;
    
    this.searchForm = this.fb.group({
      sinceDate: new FormControl(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().substring(0, 10)),
      untilDate: new FormControl(new Date().toISOString().substring(0, 10)),
      registerType: '1',
      show: new FormControl(false),
      almostClose: new FormControl(false),
      textFilter: ['']
    });

    this.getRlt()
    this.executeFilter();

    this.getTableFilteredByRlt();
  }

  onChangeTypeRegister() {
    this.advanceSearchProperties = null;
    this.executeFilter();
  }

  executeFilter() {

    this.currentPage = 1
    let registerType = this.searchForm.get('registerType').value
    this.recordData = []
    this.recordDataFiltered = []
    this.searchForm.patchValue({ textFilter: "" })

    if (registerType === '1') {

      if (this.user.roleCode === 'PLEGA' || this.user.roleCode === 'ABOG') {
        this.getTableFilteredByRlt();
      }

      this.getAsistenciaDiaria();
    } else {
      if (this.user.roleCode === 'PLEGA' || this.user.roleCode === 'ABOG') {
        this.getTableFilteredByRltEmpleador();
      }
      this.getAsistenciaDiariaEmpleadorTrabajador();
    }

  }


  getAsistenciaDiaria() {
    let since = this.searchForm.get('sinceDate').value
    let until = this.searchForm.get('untilDate').value
    let FromDate = this.tool.formatDate(since)
    let ToDate = this.tool.formatDate(until)

    this.httpService.getDailyAttendanceHistory(FromDate, ToDate, false).subscribe((response: any) => {
      const _data = response.sort((a, b) => b.idAsistenciaDiaria - a.idAsistenciaDiaria);
      this.recordData = _data
      this.recordDataFiltered = _data
      
      this.multipleRltResult = response;
    }, () => {
      this.recordData = []
      this.recordDataFiltered = []
      this.sweet.record('warning', 'No hay datos que cumplan con esta condición', ``, ``);
    })
  }

  getRlt() {
    this.httpService.get<any[]>('LocalRepresentativeProvince').subscribe(
      (data) => {
        this.localRepresentativeDrop = data;
      }
    );
  }

  getRltDescription(value) {
    return `${this.localRepresentativeDrop?.find(x => x.value == value)?.text}`.replace(/\d+\s*-\s*/, "");
  }

  getAsistenciaDiariaEmpleadorTrabajador() {
    let since = this.searchForm.get('sinceDate').value
    let until = this.searchForm.get('untilDate').value
    let FromDate = this.tool.formatDate(since)
    let ToDate = this.tool.formatDate(until)
    let registerType = this.searchForm.get('registerType').value
    const filterbyType = registerType === '2' ? 'SAE' : 'SAT'

    this.httpService.getAllAsistenciaJudicial(FromDate, ToDate, this.advanceSearchProperties).subscribe((response: any) => {
      const _response = response.filter(item => `${item.codigo}`.includes(filterbyType))
      const _data = _response.sort((a, b) => b.idAsistenciaDiaria - a.idAsistenciaDiaria);
      this.recordData = _data
      this.recordDataFiltered = _data
    }, () => {
      this.recordData = []
      this.recordDataFiltered = []
      this.sweet.record('warning', 'No hay datos que cumplan con esta condición', ``, ``);
    })
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
    this.showLoading('Descarga en curso...')

    let registerType = this.searchForm.get('registerType').value
    let header
    let data
    let fileName

    if (registerType === '1') {
      fileName = "Asistencia Diaria"
      header = ["NO. REGISTRO", "FECHA REGISTRO", "TIPO SOLICITANTE", "NOMBRE SOLICITANTE", "RLT"]
      data = this.recordDataFiltered.map(ad => [ad.codigo,
      convertoDateEs(ad.fechaAlta),
      ad.tipoSolicitante.descripcion,
      `${ad.nombre} ${ad.apellido}`,
      this.getRltDescription(ad?.idRepLocalProvinciaCatalog)])
    } else {
      header = registerType == 2 ? ["NO. REGISTRO", "FECHA REGISTRO", `TIPO EMPLEADOR`, "RLT", "ESTADO", "NO. CEDULA/RNC"] :
        ["NO. REGISTRO", "FECHA REGISTRO", "RLT", "ESTADO", "NO. CEDULA/RNC"]

      data = this.recordDataFiltered.map(ade => [ade.codigo,
      convertoDateEs(ade?.asistenciaDiaria?.fechaAlta),
      `${ade?.tipoEmpleador == 'FISICA' ? 'Persona Fisica' : 'Empresa Formalizada'}`,
      this.getRltDescription(ade?.asistenciaDiaria?.idRepLocalProvinciaCatalog),
      ade?.estado?.descripcion || ade?.estado,
      ade?.empresa?.rncCedula])
      fileName = `AsistenciaDiaria ${registerType == 2 ? "Empleador" : "Trabajador"}`
    }

    this.tool.exportToExcel(header, data, fileName)
  }

  pressDowloadPdf(serviceOrder: string) {
    this.showLoading('Descarga en curso...')

    if (serviceOrder.includes('SAT')) {
      this.httpService.dowloadPDFTrabajador(serviceOrder).subscribe((blob: any) => {
        this.tool.downloadFile(blob, "pdf", serviceOrder)
      }, error => {
        this.toast.error('favor inténtelo mas tarde!', 'Error al descargar el archivo PDF')
      });
    } else {
      this.httpService.dowloadPDFEmpleador(serviceOrder).subscribe((blob: any) => {
        this.tool.downloadFile(blob, "pdf", serviceOrder)
      }, error => {
        this.toast.error('favor inténtelo mas tarde!', 'Error al descargar el archivo PDF')
      });

    }
  }

  openBusquedaAvanzada() {
    const modalRef = this.modalService.open(AvanceSearchComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.isAsistenciaJudicial = true;
    modalRef.componentInstance.advanceSearchProperties = this.advanceSearchProperties
    modalRef.closed.subscribe((value) => {
      this.advanceSearchProperties = value;
      this.executeFilter()
    });
  }

  filterInput(query: string) {
    this.recordDataFiltered = this.recordData; // Reasignar antes de filtrar
    
    if (query == '') {
      this.multipleRltResult = this.recordData
    }

    if (query != '') {
      query = query.toLocaleLowerCase(); // Convertir la consulta a minúsculas una vez en lugar de en cada comprobación
      if (this.searchForm.get('registerType').value == '1') {
        this.multipleRltResult = this.recordDataFiltered.filter((data) => {
          // Comprueba si alguno de los campos contiene la consulta
          return `${data.codigo}`.toLocaleLowerCase().includes(query) ||
            (data.fechaAlta && `${moment(data.fechaAlta).format("DD/MM/YYYY")}`.toLocaleLowerCase().includes(query)) ||
            (data.nombre && `${data?.nombre} ${data.apellido}`.toLocaleLowerCase().includes(query)) ||
            (data.tipoSolicitante?.descripcion && `${data?.tipoSolicitante?.descripcion}`.toLocaleLowerCase().includes(query)) ||
            (data?.idRepLocalProvinciaCatalog && this.getRltDescription(data?.idRepLocalProvinciaCatalog).toLocaleLowerCase().includes(query)) ||
            (data.fechaAlta && data.fechaAlta && data.fechaAlta.toLocaleLowerCase().includes(query))
        });
      } else {
        this.recordDataFiltered = this.recordDataFiltered.filter((data) => {
          // Comprueba si alguno de los campos contiene la consulta
          const tipoEmpleador = data?.tipoEmpleador == 'FISICA' ? 'Persona Fisica' : 'Empresa Formalizada'
          const rlt = this.getRltDescription(data?.asistenciaDiaria?.idRepLocalProvinciaCatalog)
          return `${data.codigo}`.toLocaleLowerCase().includes(query) ||
            (data?.asistenciaDiaria?.fechaAlta && `${moment(data?.asistenciaDiaria?.fechaAlta).format("DD/MM/YYYY")}`.toLocaleLowerCase().includes(query)) ||
            (tipoEmpleador && `${tipoEmpleador}`.toLocaleLowerCase().includes(query)) ||
            (rlt && `${rlt}`.toLocaleLowerCase().includes(query)) ||
            (data?.estado?.descripcion && `${data?.estado?.descripcion}`.toLocaleLowerCase().includes(query)) ||
            (data?.empresa?.rncCedula && `${data?.empresa?.rncCedula}`.toLocaleLowerCase().includes(query))
        });
      }

    }
  }

  sortTables(property: string) {
    this.sortOrder = property === this.sortProperty ? (this.sortOrder * -1) : 1;
    this.sortProperty = property;

    this.recordDataFiltered = [...this.recordDataFiltered.sort((a: any, b: any) => {
      // sort comparison function
      let result = 0;
      if (a[property] < b[property]) {
        result = -1;
      }
      if (a[property] > b[property]) {
        result = 1;
      }
      return result * this.sortOrder;
    })];
  }

  sortIcon(property: string) {
    if (property === this.sortProperty) {
      return this.sortOrder === 1 ? '↑' : '↓';
    }
    return '';
  }

  //Filter tables by own rlt
  getTableFilteredByRlt() {
    let since = this.searchForm.get('sinceDate').value
    let until = this.searchForm.get('untilDate').value
    let FromDate = this.tool.formatDate(since)
    let ToDate = this.tool.formatDate(until)

    let idRepLocalProvinciaCatalog = this.user.repLocalProvId
    let userId = this.user.userId;

    this.httpService.getDailyAttendanceHistory(FromDate, ToDate, false, idRepLocalProvinciaCatalog)
      .subscribe((response: any) => {
        const _data = response.sort((a, b) => b.idAsistenciaDiaria - a.idAsistenciaDiaria);

        this.recordData = _data.filter(x => x.idUsuario == this.user.userId || x.idAbogado == response.idAbogado);
        this.recordDataFiltered = _data

        if (response && response.usuario) {
          console.log('response.usuario: ', response.usuario.userId);
        }

      });
  }

  getTableFilteredByRltEmpleador() {
    let since = this.searchForm.get('sinceDate').value
    let until = this.searchForm.get('untilDate').value
    let FromDate = this.tool.formatDate(since)
    let ToDate = this.tool.formatDate(until)
    let registerType = this.searchForm.get('registerType').value
    const filterbyType = registerType === '2' ? 'SAE' : 'SAT'

    let idRepLocalProvinciaCatalog = this.user.repLocalProvId

    this.httpService.getAllAsistenciaJudicialByRlt(FromDate, ToDate, null, idRepLocalProvinciaCatalog)
      .subscribe((response: any) => {

        const _response = response.filter(item => `${item.codigo}`.includes(filterbyType))
        const _data = _response.sort((a, b) => b.idAsistenciaDiaria - a.idAsistenciaDiaria);

        this.recordData = _data.filter(x => x.idUsuario == this.user.userId || x.idAbogado == response.idAbogado);
        this.recordDataFiltered = _data

        console.log(_data);
      }
      );
  }
  // Adding spinner in searching/saving in data
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

