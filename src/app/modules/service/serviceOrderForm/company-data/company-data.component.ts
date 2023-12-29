import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateParserFormatter, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { DropDownOptionModel } from 'src/app/modules/shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { companyData } from '../_models/companyData';
import { serviceOrder } from '../_models/serviceOrder';
import * as _ from 'lodash';
import { NgbDateCustomParserFormatter } from 'src/app/modules/shared/_models/dateFormat';
import { ToastService } from 'src/app/modules/shared/_services/toast/toast.service';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { companyEdit } from './companyEdit.service';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { TreeFilesComponent } from 'src/app/modules/shared/_elements/element-ui/tree-files/tree-files.component';
import { AdvanceFilterModel } from '../../service/advance-Filters/advanced-filter/AdvanceFilterModel';
import { MapComponent } from 'src/app/modules/shared/_elements/element-ui/map/Map.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-data',
  templateUrl: './company-data.component.html',
  styleUrls: ['./company-data.component.css'], animations: [
    trigger('rncPopOver', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('800ms ease-out')),
      transition('hide => show', animate('100ms ease-in'))
    ]
    ),
    trigger('rnlPopOver', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('800ms ease-out')),
      transition('hide => show', animate('100ms ease-in'))
    ]
    )  
  ], providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class CompanyDataComponent implements OnInit {
  constructor(private calendar: NgbCalendar, private fb: FormBuilder,
    private HttpService: HttpClientService, private ngbDateParserFormatter: NgbDateParserFormatter,
    private User: UserService, private ngBModal: NgbModal, private toast: ToastService,
    private companyDataS: companyEdit, private tool: ToolsService, private http: HttpClient, private renderer: Renderer2
  ) { }

  @ViewChild('') treeFiles: TreeFilesComponent
  @Input() companyData: companyData;
  @Input() serviceOrder: serviceOrder;
  @Output() valid = new EventEmitter<boolean>();
  @Output() itChange = new EventEmitter<boolean>();
  @Input() canEdit: boolean = true;
  @Input() assignmentEdit: boolean = false;
  @Input() isFilter: boolean = false
  @Input() companyInfo = null;
  @Output() hasValue = new EventEmitter<boolean>();
  
  @Output() empty = new EventEmitter<boolean>()
  reLoad: Function;
  history: Subscription
  records: companyData[];
  loading: boolean = true;
  isRnCSearch:boolean = false;
  geoInfo: any;
  isResign: boolean = false;
  show: boolean = false
  companyDataCopy: FormGroup;
  companyDataForm: FormGroup;
  activityBranchs: DropDownOptionModel[] = []
  identificationTypes: DropDownOptionModel[] = []
  activitieBranchs: DropDownOptionModel[] = []
  currency: number = 0
  hasFiles: boolean = false
  companyFiles: any[] = []
  orderFilter: AdvanceFilterModel = this.tool.getFilterLS('orderFilter')?.form
  orderFromResult: boolean = false;
  @Output() activityBranchRLTIdChanges: EventEmitter<number> = new EventEmitter<number>();
  
  get currentDay() {
    let date = moment().format('YYYY-MM-DD')
    return date
  }
  async ngOnInit() {
    this.companyDataS.subject.subscribe(t => {
      this.removeValidators(this.companyDataForm)
    })
    this.getDropdowns()
    this.createForm()
    this.valid.emit(this.companyDataForm.invalid)

    this.onChangeListen();
    // if (!this.assignmentEdit) {
    //   this.removeValidators(this.companyDataForm)
    // }
    if (!this.isFilter) {
      await this.getDocuments()
    }
  }
onChangeListen(){
  this.companyDataForm.valueChanges.subscribe(
    changes => {
      if (this.companyDataForm.dirty) {
        this.itChange.emit(true)
      }
      this.valid.emit(this.companyDataForm.invalid)
    }
  )
}


  removeValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }
  sectionSelected: boolean = true
  drop: DropDownOptionModel[] = [{ value: 1, text: 'cedula' }, { value: 2, text: 'pasaporte' }]
  options: DropDownOptionModel[] = [{ value: true, text: 'Sí' }, { value: false, text: 'No' }]
  get stateName() {
    return this.show ? "show" : "hide";
  }

  assignSection(event) {

  }
  laborUnionValidators(event) {
    if (event) {
      this.companyDataForm.get('companyLaborUnion').setValidators([Validators.required]);
      this.companyDataForm.get('companyLaborUnion').updateValueAndValidity();
    }
    else {

      this.companyDataForm.get('companyLaborUnion').clearValidators();
      this.companyDataForm.get('companyLaborUnion').updateValueAndValidity();
    }
  }
  freeZoneValidators(event) {
    if (event) {
      this.companyDataForm.get('freeZoneName').setValidators([Validators.required])
      this.companyDataForm.get('freeZoneName').updateValueAndValidity();
    }
    else {
      this.companyDataForm.get('freeZoneName').clearValidators();
      this.companyDataForm.get('freeZoneName').updateValueAndValidity();

    }

  }

  branchOfficeValidators(event) {
    if (event) {
      this.companyDataForm.get('companyBranchOffice').setValidators([Validators.required]);
      this.companyDataForm.get('companyBranchOffice').updateValueAndValidity();

    }
    else {
      this.companyDataForm.get('companyBranchOffice').clearValidators();
      this.companyDataForm.get('companyBranchOffice').updateValueAndValidity();

    }
  }


  notFound() {
    this.patchCompanyValues();
    this.show = true;
    setTimeout(() => { this.show = false }, 1000)
  }

  async createForm() {
    
    if (this.isFilter) {
      this.companyDataForm = this.fb.group({

        rnl: new FormControl(this.orderFilter ? this.orderFilter.RNL : null),
        companyTradeName: new FormControl(this.orderFilter ? this.orderFilter.companyTradeName : null),
        companyArea: new FormControl(this.orderFilter ? this.orderFilter.companyArea : null),
        activityBranchRLTId: new FormControl(this.orderFilter ? this.orderFilter.activityBranchRLTId : null)
      })
      this.hasValue.emit(this.tool.hasFormAnyValue(this.companyDataForm.value))
    }
    else {
      if (!this.companyData) {

        this.companyDataForm = this.fb.group({

          companyDataId: new FormControl(0),
          rnl: new FormControl(this.companyInfo?.specificCompanyRnl || '',),
          rnc: new FormControl(''),
          companyTradeName: new FormControl(this.companyInfo?.companyTradeName || '', Validators.required),
          socialCompanyName: new FormControl(''),
          representativeCompanyName: new FormControl(''),
          branchOffice: new FormControl(false),
          companyBranchOffice: new FormControl(''),
          province: new FormControl(''),
          municipality: new FormControl(''),
          municipalDistrict: new FormControl(''),
          section: new FormControl(false),
          companySection: new FormControl(''),
          neighborhood: new FormControl(''),
          street: new FormControl(''),
          streetNumber: new FormControl(''),
          reference: new FormControl(''),
          telephone: new FormControl(''),
          companyExtension: new FormControl(''),
          fax: new FormControl(''),
          email: new FormControl('', Validators.email),
          freeZone: new FormControl(false),
          freeZoneName: new FormControl(''),
          companyArea: new FormControl(''),
          activityBranchRLTId: new FormControl(null, Validators.required),
          operationsStartDate: new FormControl(null),
          stocksValue: new FormControl(null),
          maleAffectedWorkers: new FormControl(0, Validators.required),
          womenWorkersAffected: new FormControl(0, Validators.required),
          minorsBoys: new FormControl(0, Validators.required),
          minorsGirls: new FormControl(0, Validators.required),
          laborUnion: new FormControl(false),
          companyLaborUnion: new FormControl(''),
          attachedDocuments: new FormControl(''),
          registeredBy: this.User.getUserData().userCode,
          serviceOrderNumber: this.serviceOrder.serviceOrderNumber,
          registrationDate: this.currentDay

        })
        this.valid.emit(true)

      }
      else {
        
        this.companyDataForm = this.fb.group({
          companyDataId: new FormControl(this.companyData.companyDataId),
          rnl: new FormControl(this.companyInfo?.specificCompanyRnl || this.companyData.rnl),
          rnc: new FormControl(this.companyData.rnc),
          companyTradeName: new FormControl(this.companyInfo?.companyTradeName || this.companyData.companyTradeName, Validators.required),
          socialCompanyName: new FormControl(this.companyData.socialCompanyName),
          representativeCompanyName: new FormControl(this.companyData.representativeCompanyName),
          companyBranchOffice: new FormControl(this.companyData.companyBranchOffice),
          branchOffice: new FormControl(this.companyData.branchOffice),
          province: new FormControl(this.companyData.province),
          municipality: new FormControl(this.companyData.municipality),
          municipalDistrict: new FormControl(this.companyData.municipality),
          section: new FormControl(this.companyData.section),
          companySection: new FormControl(this.companyData.companySection),
          neighborhood: new FormControl(this.companyData.neighborhood),
          street: new FormControl(this.companyData.street),
          streetNumber: new FormControl(this.companyData.streetNumber),
          reference: new FormControl(this.companyData.reference),
          telephone: new FormControl(this.companyData.telephone),
          companyExtension: new FormControl(this.companyData.companyExtension),
          fax: new FormControl(this.companyData.fax),
          email: new FormControl(this.companyData.email, Validators.email),
          freeZone: new FormControl(this.companyData.freeZone),
          freeZoneName: new FormControl(this.companyData.freeZoneName),
          companyArea: new FormControl(this.companyData.companyArea),
          activityBranchRLTId: new FormControl(this.companyData.activityBranchRLTId, Validators.required),
          operationsStartDate: new FormControl(this.tool.dateToObject(this.companyData.operationsStartDate)),
          stocksValue: new FormControl(this.companyData.stocksValue),
          maleAffectedWorkers: new FormControl(this.companyData.maleAffectedWorkers, Validators.required),
          womenWorkersAffected: new FormControl(this.companyData.womenWorkersAffected, Validators.required),
          minorsBoys: new FormControl(this.companyData.minorsBoys, Validators.required),
          minorsGirls: new FormControl(this.companyData.minorsGirls, Validators.required),
          laborUnion: new FormControl(this.companyData.laborUnion),
          companyLaborUnion: new FormControl(this.companyData.companyLaborUnion),
          modifyBy: this.User.getUserData().userCode,
          RegisteredBy: this.companyData.registradoPor,
          modificationRegisterDate: new Date(),
          recordStatus: true,
          serviceOrderNumber: this.companyData.serviceOrderNumber,
          registrationDate: this.companyData.fechaRegistro
        })
        this.companyDataCopy = _.clone(this.companyDataForm);
      }
    }
  }
  

  resetDocument() {
    this.companyDataForm.patchValue({
      'identificationDocument': ''
    })
  }
  dateToObject(date: string) {
    if (date) {
      let a: any[] = date.slice(0, 10).split('-').map(x => {
        return Number(x)
      })
      return { year: a[0], month: a[1], day: a[2] };
    }
    return null
  }
  patchCompanyValues(companyData?: companyData) {
    
    this.companyDataForm.patchValue({
      'rnc': companyData ? companyData.rnc : null,
      'rnl': companyData ? companyData.rnl : null,
      'companyTradeName': companyData ? companyData.companyTradeName : null,
      'socialCompanyName': companyData ? companyData.socialCompanyName : null,
      'representativeCompanyName': companyData ? '' : null,
      'branchOffice': companyData ? false : null,
      'province': companyData ? companyData.province : null,
      'municipality': companyData ? companyData.municipality : null,
      'municipalDistrict': companyData ? companyData.municipality : null,
      'section': companyData ? companyData.section : null,
      'companySection': companyData ? companyData.companySection : null,
      'neighborhood': companyData ? companyData.neighborhood : null,
      'street': companyData ? companyData.street : null,
      'streetNumber': companyData ? companyData.streetNumber : null,
      'reference': companyData ? companyData.reference : null,
      'telephone': companyData ? companyData.telephone : null,
      'companyExtension': companyData ? companyData.companyExtension : null,
      'fax': companyData ? companyData.fax : null,
      'email': companyData ? companyData.email : null,
      'freeZone': companyData ? companyData.freeZone : false,
      'freeZoneName': companyData ? companyData.freeZoneName : null,
      'companyArea': companyData ? companyData.companyArea : null,
      'operationsStartDate': companyData ? this.tool.dateToObject(companyData.operationsStartDate) : null,
      'stocksValue': companyData ? companyData.stocksValue : null,
      'laborUnion': companyData ? false : false,
      'maleAffectedWorkers': companyData ? null : null,
      'womenWorkersAffected': companyData ? null : null,
      'minorsBoys': companyData ? null : null,
      'minorsGirls': companyData ? null : null,
      'activityBranchRLTId ': companyData ? companyData.economicActivityId : null
    })
    this.setActivityRLT(companyData.economicActivityId);
    this.companyDataForm.updateValueAndValidity()

  }


  async getDocuments() {
    this.hasFiles = false;

    if (this.companyDataForm.get('rnl').value) {
      let response = await this.HttpService.get<companyData>(`VMCompaniesEstablishment?rnl=${this.companyDataForm.get('rnl').value}`).toPromise()
 
      if (response[0].listDocuments?.length > 0) {
        this.hasFiles = true;
        this.companyFiles = response[0].listDocuments
      }
    }
  }
  async getCompany(value, type) {
    this.hasFiles = false;
    try {

      let response = await this.HttpService.get<companyData>(`VMCompaniesEstablishment?${type}=${value}`).toPromise()
      if (response[0].listDocuments?.length > 0) {
        this.hasFiles = true;
        this.companyFiles = response[0].listDocuments
      }
      this.patchCompanyValues(response[0])
    }
    catch (error) {
      if (error.status == 404) {

        return this.notFound()
      }
      return this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible')
    }


  }


  async getDropdowns() {
    this.HttpService.get<DropDownOptionModel[]>(`TypeOfActivityBranch`).subscribe((response) => { this.activityBranchs = response });
    this.HttpService.get<DropDownOptionModel[]>(`TypeOfIdentification`).subscribe((response) => { this.identificationTypes = response });
    this.HttpService.get<DropDownOptionModel[]>(`TypeOfActivityBranch`).subscribe((response) => { this.activitieBranchs = response });

  }

  async openLocation() {
    const ngmodal: NgbModalRef = this.ngBModal.open(
      MapComponent, {
      size: 'xl', backdrop: 'static',
      keyboard: false
    });

    ngmodal.componentInstance.location = _.cloneDeep(location);
    ngmodal.componentInstance.geoInfo = this.geoInfo
  }

  clean() {
    this.companyDataForm.patchValue({

      rnl: null,
      companyTradeName: null,
      companyArea: null,
      activityBranchRLTId: null
    })
  }

showRnc(){
  this.isRnCSearch = true;
  this.records = [];
  this.getRnlRecords(this.companyDataForm.get('rnc').value);
  
}
async getRnlRecords(rnlSeach) {
  this.loading = true;
  this.history = await this.HttpService.get<companyData[]>(`VMCompaniesEstablishment?rnc=${rnlSeach}`).subscribe(
    {

      next: response => {
        this.records = response
        this.loading = false;
     
      },
      error: error => {
        this.empty.emit(true);
        this.records = []
        this.loading = false;
        this.show = true;
        setTimeout(() => { 
          this.show = false;
          this.isRnCSearch = false;  
        }, 4000)         
      }
    }
  )

}
onClickBack(){
  this.show = false;
  this.isRnCSearch = false;  
}
onSelect(selectedRnl: any): void {
  this.isRnCSearch = false;
  this.getCompany(selectedRnl, 'rnl')

}
setActivityRLT(_activityBranchRLTId){

  if(_activityBranchRLTId !== null){
    try {
      const $select:any = document.querySelector('[formcontrolname="activityBranchRLTId"]').firstElementChild.firstChild;
      $select.value = _activityBranchRLTId;


      if($select.value !==''){

        $select.classList.remove('selectPlaceHolder'); 
        this.companyDataForm.get('activityBranchRLTId').setValue = _activityBranchRLTId;
        this.companyDataForm.get('activityBranchRLTId').clearValidators();
        this.companyDataForm.get('activityBranchRLTId').updateValueAndValidity();
        this.activityBranchRLTIdChanges.emit(_activityBranchRLTId);
         
        // this.companyDataForm = this.fb.group({
        //   activityBranchRLTId: new FormControl(_activityBranchRLTId)
        // })        
  


      }

    } catch (error) {
      console.log(error);
      
    }
  }

}



}

