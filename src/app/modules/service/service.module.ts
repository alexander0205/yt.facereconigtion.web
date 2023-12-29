import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ArchwizardModule } from 'angular-archwizard';
import { ServiceComponent } from './service/service.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMaskModule } from 'ngx-mask';



import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/es";
import localeDeExtra from "@angular/common/locales/extra/es";
import { serviceOrderForm } from './serviceOrderForm/General-data/serviceOrderForm.component';
import { serviceRoutingModule } from './service-routing.module';
import { RecordHistoryComponent } from './service/record-history/record-history.component';
import { FormsCreationComponent } from './service/forms-creation/forms-creation.component';
import { CanExitGuard } from './Guards/can-exit.guard';
import { CompanyDataComponent } from './serviceOrderForm/company-data/company-data.component';
import { FileUploadModule } from 'primeng/fileupload';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { TagInputModule } from 'ngx-chips';
import { RoleGuard } from './Guards/role.guard';
import { AuthChildGuardService } from '../auth/_services/auth-child-guard.service';
import { companyEdit } from './serviceOrderForm/company-data/companyEdit.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxPaginationModule } from 'ngx-pagination';
import { SucursalesModalComponent } from './service/forms-creation/sucursales-modal/sucursales-modal.component';
import { WitnessModalComponent } from './service/forms-creation/witness-modal/witness-modal.component';
import { WitnessReferencesModalComponent } from './service/forms-creation/witnessReferences-modal/witnessReferencess-modal.component';


registerLocaleData(localeDe, "es", localeDeExtra);

@NgModule({
    declarations: [serviceOrderForm, ServiceComponent,
        RecordHistoryComponent,
        FormsCreationComponent, CompanyDataComponent,
        SucursalesModalComponent,
        WitnessReferencesModalComponent, WitnessModalComponent
    ],
    imports: [TagInputModule, SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        ArchwizardModule,
        NgMultiSelectDropDownModule,
        NgxMaskModule.forChild(),
        serviceRoutingModule,
        FileUploadModule,
        CurrencyMaskModule, DropdownModule,
        ChipsModule,
        ToggleButtonModule,
        TabViewModule,
        ButtonModule,
        NgxPaginationModule,
        CalendarModule,
        TooltipModule,
        MultiSelectModule,
    ], schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    exports: [serviceOrderForm],
    providers: [{ provide: LOCALE_ID, useValue: "es-Es" }, CanExitGuard,  RoleGuard,  companyEdit, AuthChildGuardService, NgbActiveModal
    ]
})
export class ServiceModule { }
