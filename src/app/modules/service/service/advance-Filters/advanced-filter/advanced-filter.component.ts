import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { user } from 'src/app/modules/auth/_models/User';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { workerData } from 'src/app/modules/service/serviceOrderForm/_models/workerData';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { DropDownOptionModel } from 'src/app/modules/shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { CompanyDataComponent } from '../../../serviceOrderForm/company-data/company-data.component';
import { serviceOrderForm } from '../../../serviceOrderForm/General-data/serviceOrderForm.component';
import { companyData } from '../../../serviceOrderForm/_models/companyData';
import { serviceOrder } from '../../../serviceOrderForm/_models/serviceOrder';
import { ServiceOrderAssignment } from '../../../serviceOrderForm/_models/ServiceOrderAssignment';
import { visitData } from '../../../serviceOrderForm/_models/visitData';
import { AdvanceFilterModel } from './AdvanceFilterModel';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})
export class AdvancedFilterComponent implements OnInit {
  localReps: any;
  constructor(private ngbActiveModal: NgbActiveModal, private tool: ToolsService, private auth: UserService, private http: HttpClientService) { }
  workerData: workerData;
  user: user = this.auth.getUserData();
  @Input() isActive: boolean;
  nearToClose: boolean;
  forms: any
  orderFilter: AdvanceFilterModel = this.tool.getFilterLS('orderFilter')?.form
  RLTId: number = this.orderFilter?.RLT ? this.orderFilter.RLT : null;
  ShowAsingUser: boolean = true;
  currentUser:any;
  

  async ngOnInit() {
    this.currentUser = this.auth.getUserData();
    this.checkRole();
    this.forms = {
      serviceOrder: false,
      assignment: false,
      company: false,
      warning: false,
      infraction: false,
      inspection: false,
      visit: false,
      worker: false,
      RLT: this.RLTId ? true : false
    }
    this.localReps = await this.http.get<DropDownOptionModel[]>(`LocalRepresentativeProvince`).toPromise();

    if (this.orderFilter) {
      this.nearToClose = this.orderFilter ? this.orderFilter.nearToClose : false;
    }
      
  }

  close() {
    this.ngbActiveModal.close()
  }

  clean(service: serviceOrderForm, company: CompanyDataComponent) {

    service.clean()
    company.clean()
    this.RLTId = null;
  }

  buildSearch(service: serviceOrder, assignment: ServiceOrderAssignment, worker: workerData, company: companyData
    , visit: visitData) {
    const order: any = {
      statusServiceOrderId: service.statusOrderServiceId,
      assignedInspectorInfo: null,
      serviceOrderStatusInfo: null,
      orderDateServiceOrder: service.orderDate ? `${service.orderDate['day']}/${service.orderDate['month']}/${service.orderDate['year']}` : null,
      registrationDateServiceOrder: null,
      serviceOrderNumber: null,
      registeredByServiceOrder: null,
      assignedInspectorId: (this.currentUser.roleCode !== 'DIG' && this.currentUser.roleCode !== 'INSP'? null : this.currentUser.userId),
      companyTradeName: company.companyTradeName,
      inspectionProgramName: null,
      cssClosingDateStatus: null,
      inspectionProgramId: null,
      inspectionProgramNumber: null,
      orderServiceTypeId: service.serviceTypeId,
      classificationTypeId: null,
      repLocalProvIdInspProg: '',
      supervisorId: (this.currentUser.roleCode !== 'DIG' && this.currentUser.roleCode !== 'INSP'? assignment.supervisorId : this.currentUser.supervisorUserId) ,
      workerName: worker.workerName,
      workerIdentificationTypeId: worker.identificationTypeId,
      workerIdentification: worker.workerIdentification,
      RNC: null,
      RNL: company.rnl,
      activityBranchRLTId: company.activityBranchRLTId,
      typeOfApplicantId: service.applicantTypeId,
      requestFormId: service.requestFormId,
      estimatedDeadLineStr: service.estimatedDeadLine ? service.estimatedDeadLine : null,
      inspectionReasonsListed: service.inspectionReasonsListed ? this.tool.getListedItems(service.inspectionReasonsListed) : null,
      myCases: this.user.roleInfo == 'DIG' || this.user.roleInfo == 'INSP' ? this.user.userCode : null,
      assignRepLocalId: (this.currentUser.roleCode !== 'DIG' && this.currentUser.roleCode !== 'INSP'? assignment.localRepresentativeId : null),
      groupId: assignment.groupId,
      companyArea: company.companyArea,
      visitDateStr: visit.visitDate ? visit.visitDate : null,
      typeOfScheduleId: visit.typeOfScheduleId,
      actionTakenId: visit.actionTakenId,
      nearToClose: this.nearToClose,
      RLT: this.RLTId || null
    }

    const filter = {
      form: order,
      active: this.isActive
    }
    this.tool.setFilterLS('orderFilter', JSON.stringify(filter))
    this.tool.buildSearch(order, this.ngbActiveModal)

  }
checkRole(){
  if (this.currentUser.roleCode !== 'DIG' && this.currentUser.roleCode !== 'INSP') {
    this.ShowAsingUser = true;
  }
}

}
