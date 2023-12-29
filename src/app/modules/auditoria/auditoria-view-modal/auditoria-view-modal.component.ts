import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/_services/toast/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-auditoria-view-modal',
  templateUrl: './auditoria-view-modal.component.html',
  styleUrls: ['./auditoria-view-modal.component.css']
})
export class AuditoriaViewModalComponent {
  @Input() record: any;

  auditoriaForm: FormGroup;
  usuarioDrop: any[] = [];
  loading: boolean = true;
  recordOld: any[];
  columns: any[];
  filtersOld: string[];
  colsOld: ({ field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color: string; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; hasMulti: any; multiFilter: { options: any; text: string; }; color?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; length: number; tooltip: string; fixedColumn: boolean; style: string; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; })[];
  recordNew: any[];
  filtersNew: string[];
  colsNew: ({ field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color: string; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; hasMulti: any; multiFilter: { options: any; text: string; }; color?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; length: number; tooltip: string; fixedColumn: boolean; style: string; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; })[];
  
  
  constructor(private httpService: HttpClientService, 
              private toast: ToastService,
              private formBuilder: FormBuilder
              , public ngbActiveModal: NgbActiveModal
              , private datePipe: DatePipe) {}

  async ngOnInit() {
    this.auditoriaForm = this.formBuilder.group({
      usuarioId: new FormControl(null),
      fechaRegistro: new FormControl(null),
      tipo: new FormControl(null),
      tabla: new FormControl(null),
      primaryKeyValue: new FormControl(null),
    });

    this.getUsuario()
    this.load(this.record);
  }

  load(record: any) {
    this.loading = true;
    if (record) {
      const {fechaRegistro, ...dataAuditoria } = this.record
      this.auditoriaForm.patchValue({...dataAuditoria, fechaRegistro: this.datePipe.transform(fechaRegistro, 'yyyy-MM-dd HH:mm:ss')})
      this.columns = JSON.parse(record?.columnas)
      this.recordOld = JSON.parse(record?.valorAntiguo)
      this.recordNew = JSON.parse(record?.valorNuevo)
    }
    this.auditoriaForm.disable();
    this.loading = false;
  }

  getUsuario() {
    this.httpService.get<any[]>('User/UsersDropDown?status=true').subscribe((data) => {
      this.usuarioDrop = data;
    });
  }

  closeModal() {
    this.ngbActiveModal.close(true)
  }
}
