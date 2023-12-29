import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';
import { UserService } from '../../auth/_services/user.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'request-record-history',
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.css']
})
export class RequestHistoryComponent implements OnInit {
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
    private calendarS: NgbCalendar,
    private sweet: SweetAlertService,
    public ngbActiveModal: NgbActiveModal,
    private users: UserService
    , private router: Router
    , private datePipe: DatePipe
  ) { }

  maxDate = { year: this.calendarS.getToday().year, month: this.calendarS.getToday().month, day: this.calendarS.getToday().day }


  async ngOnInit() {
    this.user = this.users.getUserData();
    this.userName = this.user.firstName + ' ' + this.user.firstLastName;
    this.searchForm = this.fb.group({
      sinceDate: new FormControl(this.datePipe.transform(new Date().setMinutes(0), 'yyyy-MM-dd HH:mm')),
      untilDate: new FormControl(this.datePipe.transform(new Date().setHours(new Date().getHours() + 1), 'yyyy-MM-dd HH:mm')),
      Usuario: new FormControl(null),
    });

    this.getUsuario()
    this.getRecords()
    this.tableConfiguration()
  }

  tableConfiguration() {
    this.customButtons = [
      {
        class: "btn btnOutlinePrimary",
        function: async (record: any) => {
          this.router.navigate(['/Auditoria/request/', record.id])
        },
        tooltip: 'Visualizar',
        icon: 'fa fa-eye fs-2'
      }]
    this.filters = ["id", "method", "usuario", "url", "status", "fechaRegistroString"]
    this.cols = [
      {
        field: 'id',
        header: 'Código',
        view: { table: true, detail: true },

        tooltip: 'Código',
        fixedColumn: true,
      },
      {
        field: 'method',
        header: 'Acción',
        view: { table: true, detail: true },

        tooltip: 'Acción',
        fixedColumn: true,
      },
      {
        field: 'usuario',
        header: 'Usuario',
        view: { table: true, detail: true },

        tooltip: 'Usuario',
        fixedColumn: true,
      },
      {
        field: 'url',
        header: 'URL',
        view: { table: true, detail: true },

        tooltip: 'URL',
        fixedColumn: false,
      },
      {
        field: 'status',
        header: 'Respuesta',
        view: { table: true, detail: true },
        tooltip: 'Respuesta',
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

  getRecords() {
    this.loading = true;
    let since = this.searchForm.get('sinceDate').value
    let until = this.searchForm.get('untilDate').value
    const ID_Usuario = this.searchForm.get('Usuario')?.value
    this.httpService.getAllLogRequest(since, until, ID_Usuario).subscribe((response: any) => {
      const _data = response?.sort((a, b) => {
        return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();
      });
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
      this.usuarioDrop = this.sortDataDropDown(data)
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

  showLoading(title: string) {
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


