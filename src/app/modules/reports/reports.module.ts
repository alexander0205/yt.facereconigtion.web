import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRouterModule } from './reports.routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { components } from './components';



@NgModule({
  declarations: [components],
  imports: [SharedModule,
    CommonModule,
    FormsModule,
    ReportsRouterModule,
    ButtonModule,
    NgbModule,
    CalendarModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class ReportsModule { }
