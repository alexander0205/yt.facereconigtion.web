import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';
import { UserHistoryComponent } from './user-history/user-history.component';
import { SharedModule } from '../shared/shared.module';
import { RoleManagementComponent } from './role-management/role-management.component';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickListModule } from 'primeng/picklist';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';




@NgModule({
  declarations: [
    AdminComponent,
    UserHistoryComponent,
    RoleManagementComponent
  ],
  imports: [
    CommonModule,
    PickListModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
    TabViewModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AdminModule { }
