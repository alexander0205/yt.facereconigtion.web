import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToolsService } from '../../shared/tools/tools.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';
import { UserService } from '../../auth/_services/user.service';
import { AuditoriaViewModalComponent } from '../auditoria-view-modal/auditoria-view-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'auditoria-record-history',
  templateUrl: './auditoria-history.component.html',
  styleUrls: ['./auditoria-history.component.css']
})
export class AuditoriaHistoryComponent implements OnInit {
  loading: boolean = true;
  recordData: any[];
  recordDataFiltered: any;
  filters: string[];
  customButtons: { class: string; function: (record: any) => Promise<void>; tooltip: string; icon: string; }[];
  searchForm: FormGroup;
  usuarioDrop: any[] = [];
  entidadDrop: any[] = [];
  cols: ({ field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color: string; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; hasMulti: any; multiFilter: { options: any; text: string; }; color?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; length: number; tooltip: string; fixedColumn: boolean; style: string; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; })[];
  user: any;
  userName: string;

  constructor(private httpService: HttpClientService,
    private fb: FormBuilder,
    private tool: ToolsService,
    private sweet: SweetAlertService,
    public ngbActiveModal: NgbActiveModal,
    private users: UserService,
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.user = this.users.getUserData();
    this.userName = this.user.firstName + ' ' + this.user.firstLastName;
    this.searchForm = this.fb.group({
      sinceDate: new FormControl(this.datePipe.transform(new Date().setMinutes(0), 'yyyy-MM-dd HH:mm')),
      untilDate: new FormControl(this.datePipe.transform(new Date().setHours(new Date().getHours() + 1), 'yyyy-MM-dd HH:mm')),
      Usuario: new FormControl(null),
      Entidad: new FormControl(null),
    });

    this.getUsuario()
    this.getEntidad()
    this.getRecords()
    this.tableConfiguration()
  }

  tableConfiguration() {
    this.customButtons = [
      {
        class: "btn btnOutlinePrimary",
        function: async (record: any) => {
          this.openModal(record)
        },
        tooltip: 'Visualizar',
        icon: 'fa fa-eye fs-2'
      }]
    this.filters = ["id", "usuarioNombre", "tabla", "primaryKeyValue", "tipo", "fechaRegistroString"]
    this.cols = [
      {
        field: 'id',
        header: 'Código',
        view: { table: true, detail: true },

        tooltip: 'Código',
        fixedColumn: true,
      },
      {
        field: 'usuarioNombre',
        header: 'Nombre de usuario',
        view: { table: true, detail: true },

        tooltip: 'Nombre de usuario',
        fixedColumn: true,
      },
      {
        field: 'tabla',
        header: 'Entidad',
        view: { table: true, detail: true },

        tooltip: 'Entidad',
        fixedColumn: true,
      },
      {
        field: 'primaryKeyValue',
        header: 'Id de la entidad',
        view: { table: true, detail: true },

        tooltip: 'Id de la entidad',
        fixedColumn: true,

      },

      {
        field: 'tipo',
        header: 'Tipo de cambio',
        view: { table: true, detail: true },
        tooltip: 'Tipo de cambio',
        fixedColumn: true,

      },

      {
        field: 'fechaRegistroString',
        header: 'Fecha',
        view: { table: true, detail: true },
        tooltip: 'Fecha',
        fixedColumn: true,
      },

    ]
  }

  getUsuarioDescription(value) {
    return `${this.usuarioDrop?.find(x => x.value == value)?.text}`;
  }

  getEntidadDescription(value) {
    return `${this.entidadDrop?.find(x => x.value == value)?.text}`;
  }

  getRecords() {    
    this.loading = true;
    let since = this.searchForm.get('sinceDate').value
    let until = this.searchForm.get('untilDate').value
    const ID_Usuario = this.searchForm.get('Usuario')?.value
    const Entidad = this.searchForm.get('Entidad')?.value ? this.getEntidadDescription(this.searchForm.get('Entidad')?.value) : null
    this.httpService.getAllAuditoria(since, until, ID_Usuario, Entidad).subscribe((response: any) => {
      console.log(`record`, response)
      const _data = response?.sort((a, b) => {
        return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();
      });

      console.log(`record sorted`, _data)
      this.recordData = _data;
      this.recordDataFiltered = _data;
      this.loading = false;
    }, () => {
      this.recordData = []
      this.recordDataFiltered = []

      this.sweet.record('warning', 'No hay datos que cumplan con esta condición', ``, ``);
      this.loading = false;
    })

  }

  getUsuario() {
    this.httpService.get<any[]>('User/UsersDropDown?status=true').subscribe((data) => {
      this.usuarioDrop = this.sortDataDropDown(data);
    });
  }

  
  getEntidad() {
    this.httpService.get<any[]>('Entidad').subscribe((data) => {
      this.entidadDrop = this.sortDataDropDown(data);
    });
  }
  
  sortDataDropDown(data: any)
  {
    return data?.sort((a, b) => {
      const valueA = a.text.toUpperCase(); 
      const valueB = b.text.toUpperCase();

      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0; 
    });
  }

  dateRageFilter() {
    this.getRecords()
  }

  openModal(record: any) {
    const modalRef = this.modalService.open(AuditoriaViewModalComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.record = record;

  }

}


