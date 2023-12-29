import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from '../../auth/_services/user.service';
import { orderNotes } from '../../service/serviceOrderForm/order-notes/_models/orderNotes';
import { ButtonModel } from '../_elements/element-ui/table/models/button-model';
import { TableConfigView } from '../_elements/element-ui/table/models/table-config-view';
import { HttpClientService } from '../_services/http-client/http-client.service';
import { ToolsService } from '../tools/tools.service';
import { NotesDataService } from './order-notes-data.service';
import * as _ from 'lodash';
import { NotesComponent } from '../../notes/notes.component';
@Component({
  selector: 'app-notes-history',
  templateUrl: './notes-history.component.html',
  styleUrls: ['./notes-history.component.css']
})
export class NotesHistoryComponent {
  @Input() codigo: string
  @Output() empty = new EventEmitter<boolean>()
  @Input() canEdit: boolean = true;

  amount = 0;
  reLoad: Function;
  history: Subscription
  headers: TableConfigView[];
  records: orderNotes[];
  cols: any[];
  filters: any[];
  loading: boolean = true;
  InitialFormValue: FormGroup;
  subs: Subscription;
  maxDate = { year: moment().year(), month: moment().month() + 1, day: moment().date() }
  constructor(private http: HttpClientService, private route: Router, private user: UserService,
    private fb: FormBuilder, private orderNotesData: NotesDataService, private ngBModal: NgbModal
    , private httpservice: HttpClient, private tool: ToolsService) {

  }

  searchForm: FormGroup;

  ngOnDestroy(): void {
    this.history.unsubscribe()
    this.subs.unsubscribe();
  }
  customButtons: ButtonModel[];

  deleteRecord(record) {
    Swal.fire({
      icon: 'warning',
      title: '¿Esta seguro que desea eliminarlo?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.http.delete<orderNotes[]>(record.idNota, `Nota`).subscribe(
          {
            next: response => {
              this.getRecords()
            },
            error: error => {
            }
          })
      } else if (result.isDenied) {
      }
    });
  }
  ngOnInit(): void {
    this.assignButtons()
    
    if (!this.canEdit) {
      this.customButtons.pop()
    }

    this.getRecords()
    
    this.subs = this.orderNotesData.subject.subscribe(data => {
      this.getRecords()
    });

    this.searchForm = this.fb.group({
      sinceDate: new FormControl(this.tool.dateToObject(moment().subtract(1, 'M').set('date', 1).format().toString())),
      untilDate: new FormControl(this.tool.dateToObject(moment().format().toString())),
      show: new FormControl(false)
    })


    this.filters = ["idNotaText", "fechaRegistroStr", "registradoPorNombre"]
    this.cols = [


      // {
      //   field: 'idNotaText',
      //   view: { table: true, detail: true },
      //   header: 'INFORMACIÓN',
      //   width: 3,
      //   tooltip: 'INFORMACIÓN',
      //   fixedColumn: true,

      // },


      {
        field: 'fechaRegistroStr',
        header: 'FECHA NOTA',
        view: { table: true, detail: true },
        width: 3,
        tooltip: 'FECHA NOTA',
        fixedColumn: true,

      },


      {
        field: 'registradoPorNombre',
        header: 'REGISTRADO POR',
        view: { table: true, detail: true },
        width: 3,
        tooltip: 'REGISTRADO POR',
        fixedColumn: true,

      },


    ]
  }

  getRecords() {
    this.loading = true;
    this.history = this.http.get<orderNotes[]>(`Nota?codigo=${this.codigo}`).subscribe(
      {

        next: response => {

          this.records = response.map(x => ({ ...x, idNotaText: `Registro No.${x?.idNota}` }))
          this.loading = false;
          this.amount = response.length

        },
        error: error => {

          this.empty.emit(true);
          this.records = []
          this.loading = false;
        }
      }
    )

  }

  assignButtons() {
    this.customButtons = [
      {
        class: " btn-notas  css-label-btn-grid px-2 me-2 ",
        function: async (record: any) => {
          const ngmodal: NgbModalRef = this.ngBModal.open(
            NotesComponent, { size: 'xl' });
          ngmodal.componentInstance.orderNotes = _.cloneDeep(record);
          ngmodal.componentInstance.canEdit = false;
        },
        label: `${'Consultar'}`,
        validateShow: (record: any) => {
          return record?.registradoPor !== this.user.getUserData().userCode
        }
      },
      {
        class: " btn-notas  css-label-btn-grid px-2 me-2 ",
        function: async (record: any) => {
          const ngmodal: NgbModalRef = this.ngBModal.open(
            NotesComponent, { size: 'xl' });
          ngmodal.componentInstance.orderNotes = _.cloneDeep(record);
          ngmodal.componentInstance.canEdit = this.canEdit;
        },
        label: `${this.canEdit ? 'Editar' : 'Consultar'}`,
        icon: 'fa fa-pencil',
        validateShow: (record: any) => {
          return record?.registradoPor === this.user.getUserData().userCode
        }
      },
      {
        class: " btn-notas css-label-btn-grid px-2 btn-eliminar",
        function: async (record: any) => {
          this.deleteRecord(record)
        }, label: "Eliminar",
        icon: 'fa fa-trash',
        validateShow: (record: any) => {
          return record?.registradoPor === this.user.getUserData().userCode
        }
      }]
  }

}
