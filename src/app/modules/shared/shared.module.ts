import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { components } from './components';
import { TruncateTextPipe } from './_pipes/truncate-text.pipe';
import { SweetAlertService } from './_services/sweetAlert/sweet-alert.service';
import { SafePipe } from './_pipes/safeUrl.pipe';
import { } from 'primeng/dropdown';
import { ToolsService } from './tools/tools.service';
import { modules } from './modules';
import { AccordeonOpenCloseExpedientService } from './accordeon/accordeon-open-close-expedient.service';
import { NotesHistoryComponent } from './notes-history/notes-history.component';

@NgModule({
  declarations: [components, TruncateTextPipe, SafePipe, NotesHistoryComponent],
  imports: [
    modules
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe, SweetAlertService, ToolsService,AccordeonOpenCloseExpedientService],
  exports: [components, SafePipe, NotesHistoryComponent]
})
export class SharedModule { }
