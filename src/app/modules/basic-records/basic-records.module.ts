import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicRecordsRoutingModule } from './basic-records-routing.module';
import { BasicRecordListComponent } from './basic-record-list/basic-record-list.component';
import { BasicRecordComponent } from './basic-record/basic-record.component';
import { BasicRecordHistoryComponent } from './basic-record-history/basic-record-history.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FormFundamentoDemandaComponent } from './form-fundamento-demanda/form-fundamento-demanda.component';
import { CloseExpedientModalComponent } from './close-expedient-modal/close-expedient-modal.component';
import { FormExpedientNotaComponent } from './form-expedient-nota/form-expedient-nota.component';
import { FormExpedientEstadosComponent } from './form-expedient-estados/form-expedient-estados.component';
import { FormExpedientInformacionGeneralComponent } from './form-expedient-informacion-general/form-expedient-informacion-general.component';
import { FormExpedientHeaderComponent } from './form-expedient-header/form-expedient-header.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormArchivosPruebaComponent } from './form-archivos-prueba/form-archivos-prueba.component';
import { ReopenCaseModalComponent } from './reopen-case-modal/reopen-case-modal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    BasicRecordListComponent,
    BasicRecordComponent,
    BasicRecordHistoryComponent,
    FormFundamentoDemandaComponent,
    CloseExpedientModalComponent,
    FormExpedientNotaComponent,
    FormExpedientEstadosComponent,
    FormExpedientInformacionGeneralComponent,
    FormExpedientHeaderComponent,
    FormArchivosPruebaComponent,
    ReopenCaseModalComponent,

  ],
  imports: [
    CommonModule,
    BasicRecordsRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    NgbModule,
    NgxPaginationModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class BasicRecordsModule { }
