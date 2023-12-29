import { Component } from '@angular/core';
import { UserService } from '../../auth/_services/user.service';
import { user } from '../../auth/_models/User';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import moment from 'moment';

@Component({
  selector: 'app-basic-record-list',
  templateUrl: './basic-record-list.component.html',
  styleUrls: ['./basic-record-list.component.css']
})
export class BasicRecordListComponent {

  user: any;

  records: any[];
  recordData: any[];
  recordDataFiltered: any[];
  filteredRecords: any[];
  currentPage = 1;
  itemPerPage = 10;
  filterList: any;
  registerType: string;
  localRepresentativeDrop: DropDownOptionModel[] = [];

  sortProperty: string = 'id';
  sortOrder = 1;

  constructor(private users: UserService, private httpService: HttpClientService) { }

  ngOnInit() {
    this.user = this.users.getUserData() as user;
    this.getRlt()
    this.getRecords();
  }

  getRecords() {
    this.httpService.getAllAsistenciaJudicial().subscribe((response: any) => {
      if (response && response.length > 0) {
        this.records = response.filter((record) => record.codigo !== null).sort((a, b) => b.idAsistenciaDiaria - a.idAsistenciaDiaria);
        this.recordData = this.records
        this.recordDataFiltered = this.records        
      }

    });
  }

  getRltDescription(value) {
    return `${this.localRepresentativeDrop?.find(x => x.value == value)?.text}`.replace(/\d+\s*-\s*/, "");
  }
  
  getRlt() {
    this.httpService.get<any[]>('LocalRepresentativeProvince').subscribe(
      (data) => {
        this.localRepresentativeDrop = data;
      }
    );
  }

  filterInput(query: string) {
    this.recordDataFiltered = this.recordData; // Reasignar antes de filtrar
    if (query != '') {
      query = query.toLocaleLowerCase(); // Convertir la consulta a minúsculas una vez en lugar de en cada comprobación
      this.recordDataFiltered = this.recordDataFiltered.filter((data) => {
        // Comprueba si alguno de los campos contiene la consulta
        return `${data.codigo}`.toLocaleLowerCase().includes(query) ||
          (data.nombre && data.nombre.toLocaleLowerCase().includes(query)) ||
          (data.fechaRegistro && `${moment(data.fechaAlta).format("DD/MM/YYYY")}`.toLocaleLowerCase().includes(query)) ||
          (data.tipoEmpleador && data.tipoEmpleador.toLocaleLowerCase().includes(query)) ||
          (data.localRepresentativeProvince && data.localRepresentativeProvince.localRepProvinceInformation && data.localRepresentativeProvince.localRepProvinceInformation.toLocaleLowerCase().includes(query)) ||
          (data.estado && `${data.estado}`.toLocaleLowerCase().includes(query)) ||
          (data.asistenciaDiaria && data?.asistenciaDiaria?.tipoSolicitante && data.asistenciaDiaria?.tipoSolicitante?.descripcion && data.asistenciaDiaria?.tipoSolicitante?.descripcion.toLocaleLowerCase().includes(query));
      });
    }
  }

  get totalPages(): number {
    return Math.ceil((this?.recordData?.length || 0) / this?.itemPerPage);
  }

  get displayedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemPerPage;
    const endIndex = startIndex + this.itemPerPage;
    return this?.recordData?.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
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

}

