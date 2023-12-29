import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { PiechartComponent } from './components/piechart/piechart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '../shared/shared.module';
import { BarchartComponent } from './components/barchart/barchart.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [DashboardLayoutComponent,  PiechartComponent, BarchartComponent],
  imports: [
    SharedModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardRoutingModule,
    NgbModule,NgChartsModule
  ],
})
export class DashboardModule { }
