import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuditoriaHistoryComponent } from './auditoria-history/auditoria-history.component';
import { AuditoriaRoutingModule } from './auditoria-routing.module';
import { AuditoriaComponent } from './auditoria.component';
import { RequestHistoryComponent } from './request-history/request-history.component';
import { RequestViewComponent } from './request-view/request-view.component';
import { FormRequestComponent } from './form-request/form-request.component';
import { FormResponseComponent } from './form-response/form-response.component';
import { AuditoriaViewModalComponent } from './auditoria-view-modal/auditoria-view-modal.component';
import { CodeDisplayComponent } from 'src/app/components/code-display/code-display.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AuditoriaComponent,
    AuditoriaHistoryComponent,
    AuditoriaViewModalComponent,
    RequestHistoryComponent,
    RequestViewComponent,
    FormRequestComponent,
    FormResponseComponent,
    CodeDisplayComponent,
  ],
  imports: [
    CommonModule,
    AuditoriaRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DropdownModule,
    NgbModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    ClipboardModule,
  ]
})
export class AuditoriaModule { }
