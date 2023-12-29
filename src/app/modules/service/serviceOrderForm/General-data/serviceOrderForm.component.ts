import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateStruct, NgbDatepicker, NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { DropDownOptionModel } from '../../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { serviceOrder } from '../_models/serviceOrder';
import * as moment from 'moment';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { NgbDateCustomParserFormatter } from 'src/app/modules/shared/_models/dateFormat';
import { user } from 'src/app/modules/auth/_models/User';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';
import { ConnectionService } from 'ngx-connection-service/lib/connection-service.service';
import * as _ from 'lodash';
import { ServiceorderService } from './serviceorder.service';
import { AdvanceFilterModel } from '../../service/advance-Filters/advanced-filter/AdvanceFilterModel';
import { ToastService } from 'src/app/modules/shared/_services/toast/toast.service';

@Component({
  selector: 'serviceOrderForm-Component',
  templateUrl: './serviceOrderForm.component.html',
  styleUrls: ['./serviceOrderForm.component.css'],
  animations: [
    trigger('warning', [
      state('show', style({
        opacity: 1,
        transform: 'scale(2)',
        display: 'inline-block'
      })),
      state('hide', style({
        opacity: 1,
        transform: 'scale(1)',
        display: 'inline-block'
      })),
      transition('show => hide', animate('800ms ease-out')),
      transition('hide => show', animate('100ms ease-in'))
    ])
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class serviceOrderForm implements OnInit {
  @Input() serviceOrderInput: serviceOrder
  @Input() isFilter: boolean = false
  @Input() inspectionProgramId: number;
  @Input() visitResultId: number;
  model: NgbDateStruct;
  date: { year: number, month: number };
  minDate: any;
  minDateOrder: any;
  maxEstimatedDate = { year: moment().year(), month: moment().month() + 3, day: moment().date() }
  otherApplicant = false;
  connectionSubscription: Subscription;
  isDateInvalid: boolean = false;
  value: any;
  constructor(private calendar: NgbCalendar, private fb: FormBuilder,
    private HttpService: HttpClientService, private ngbDateParserFormatter: NgbDateParserFormatter,
    private user: UserService, public tool: ToolsService, public elem: ElementRef, private orderSService: ServiceorderService, private connectionService: ConnectionService,
    private toast: ToastService
  ) {
    this.getDropdowns()
    this.connectionService.updateOptions({
      heartbeatExecutor: options => new Observable<any>(subscriber => {
        if (Math.random() > .2) {
          subscriber.next();
          subscriber.complete();
        } else {
          // throw new Error('Connection error');

        }
      })
    });

    this.connectionSubscription = this.connectionService.monitor().subscribe((currentState) => {
      if (!currentState.hasNetworkConnection) {
        this.getDropdowns()
      }
    })
  }

  companyDataForm: FormGroup;
  serviceOrder: FormGroup;
  orderFilter: AdvanceFilterModel = this.tool.getFilterLS('orderFilter')?.form
  otherObeservations: boolean = false;
  @Output() CreatedserviceOrder = new EventEmitter<serviceOrder>();
  @Output() valid = new EventEmitter<boolean>();
  @Output() hasJustification = new EventEmitter<boolean>();
  @Output() itChange = new EventEmitter<boolean>();
  @Output() hasValue = new EventEmitter<boolean>();
  @Input() canEdit: boolean = true;
  show: boolean = false
  @Output() orderForm = new EventEmitter<FormGroup>();
  get currentDay() {
    let date = moment().format('YYYY-MM-DD')
    return date
  }

  inspectionMotives: DropDownOptionModel[];
  serviceTypes: any[] = [];
  localRepresentatives: DropDownOptionModel[];
  applicantTypes: any[] = [];
  applicantTypesC: any[] = [];
  requestForms: DropDownOptionModel[];
  inspectionPrograms: any[];
  serviceOrderToCreate: serviceOrder;
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  statusServiceOrder: any[];
  Justification = false;
  Justifications: any[];
  maxDate = { year: moment().year(), month: moment().month() + 1, day: moment().date() }
  canSetNewDate: boolean = false
  isDirector: boolean = false
  currentUser: user = this.user.getUserData() as user
  serviceOrderCopy: FormGroup
  checkPermission() {
    let user = this.user.getUserData() as user;
    if (user.roleInfo !== 'Inspector' && user.roleInfo !== 'Digitador') {
      this.canSetNewDate = true
    }
    if (user.roleCode == 'DIR') {
      this.isDirector = true;
    }

  }

  async ngOnInit() {

    if (!this.tool.hasInternetConnection) {
      this.orderSService.hasCreatedOffline.subscribe(_ => {

        this.clean()
      })
    }
    this.checkPermission()

    this.minDate = !this.serviceOrderInput ? { year: moment().year(), month: moment().month() + 1, day: moment().date() } : null
    this.minDateOrder = !this.serviceOrderInput ? { year: moment().add(-14, 'd').toObject().years, month: moment().add(-14, 'd').toObject().months + 1, day: moment().add(-14, 'd').toObject().date } : null


    if (this.serviceOrderInput) {
      this.editForm(this.serviceOrderInput)

    }
    else {
      this.createForm();

    }



    this.serviceOrderToCreate = new serviceOrder();


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Deseleccionar Todos',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      enableCheckAll: true,
      searchPlaceholderText: 'Buscar'

    };

    this.serviceOrder.valueChanges.subscribe(
      changes => {
        if (this.serviceOrder.dirty) {
          this.itChange.emit(true);
        }
        this.orderForm.emit(this.serviceOrder)
        this.valid.emit(this.serviceOrder.invalid)

        if (this.serviceOrder.valid) {
          //this.mapDates()

          this.CreatedserviceOrder.emit(this.serviceOrder.value)
        }
      }
    )

  }


  selectToday() {
    this.model = this.calendar.getToday();
  }


  save() {
    this.reorderArrayOfMotives()
    this.serviceOrderToCreate = this.serviceOrder.value;

  }

  getApllicantTypes() {

    let serviceId = this.serviceOrder.get('serviceTypeId').value;
    this.HttpService.get<DropDownOptionModel[]>(`TypeOfApplicant?typeOfServiceId=${serviceId}`).subscribe((response) => { this.applicantTypes = response });


  }
  changeWithNotice(event) {
    if (this.tool.hasInternetConnection) {
      let code = this.serviceTypes.find(x => x.value == event)?.serviceCode

      this.HttpService.get<DropDownOptionModel[]>(`TypeOfApplicant?ServiceCode=${code}`).subscribe((response) => { this.applicantTypes = response });
      this.serviceOrder.patchValue({
        'applicantTypeId': null,

      })
    } else {
      this.serviceOrder.patchValue({
        'applicantTypeId': null,
      })

      let code = this.serviceTypes.find(el => el.value == event).serviceCode
      if (code == 'ESPUG') {
        code = 'ESPNO'
      }
      let applicants = this.applicantTypesC
      this.applicantTypes = applicants.filter(el => el.serviceCode == code);
    }
    if (!this.isFilter) {
      let { amountDaysNoticeClosing, amountOfDaysEstimatedClosing } = this.serviceTypes.find(x => x.value == this.serviceOrder.get('serviceTypeId').value);
      let registrationDate = this.tool.dateToObject(this.serviceOrder.get('registrationDate').value)
      let estimatedDeadLine = { ...this.serviceOrder.get('orderDate').value, ...{ day: this.serviceOrder.get('orderDate').value?.day + amountDaysNoticeClosing } };

      this.serviceOrder.patchValue({
        'estimatedDeadLine': registrationDate ? this.tool.dateToObject(this.addBusinessDays(moment(`${registrationDate['year']}-${registrationDate['month']}-${registrationDate['day']}`), amountOfDaysEstimatedClosing)) : null,
        'amountDaysNoticeClosing': amountDaysNoticeClosing
      })
    }
    if (this.serviceOrderInput) { this.otherApplicantTypes() }

  }

  reorderArrayOfMotives() {
    let motives: [] = this.serviceOrder.get('inspectionReasonsListed').value;
    let motivesString = motives.map((motivo: DropDownOptionModel) => { return motivo.value }).join(',')
    this.serviceOrder.patchValue({
      'inspectionReasonsListed': motivesString
    })

  }

  createForm() {
    if (this.isFilter) {
      this.serviceOrder = this.fb.group({
        serviceTypeId: new FormControl(this.orderFilter ? this.orderFilter.orderServiceTypeId : null),
        applicantTypeId: new FormControl(this.orderFilter ? this.orderFilter.typeOfApplicantId : null),
        estimatedDeadLine: new FormControl(this.orderFilter ? this.orderFilter.estimatedDeadLineStr : null),
        requestFormId: new FormControl(this.orderFilter ? this.orderFilter.requestFormId : null),
        inspectionReasonsListed: new FormControl(this.orderFilter ? this.orderFilter.inspectionReasonsListed : null),
      })
      this.hasValue.emit(this.tool.hasFormAnyValue(this.serviceOrder.value))
    }
    else {
      this.serviceOrder = this.fb.group({
        serviceOrderId: new FormControl(0),
        orderDate: new FormControl(this.calendar.getToday(), [Validators.required, this.tool.dateValidator]),
        newEstimatedDeadline: new FormControl(null),
        justificationChangeEstimatedDate: new FormControl(null),
        justificationChangeEstimatedDateId: new FormControl(null),
        repLocalProvId: new FormControl(this.currentUser.repLocalProvId, Validators.required),
        serviceTypeId: new FormControl(null, Validators.required),
        applicantTypeId: new FormControl(null, Validators.required),
        justifAnotherTypeApplicant: new FormControl(null),
        requestFormId: new FormControl(null, Validators.required),
        estimatedDeadLine: new FormControl(null, Validators.required),
        amountDaysNoticeClosing: new FormControl(null, Validators.required),
        registrationDate: new FormControl(!this.isFilter ? this.currentDay : null),
        inspectionReasonsListed: new FormControl(!this.isFilter ? [] : null, Validators.required),
        inspectionReasonObservations: new FormControl(''),
        registeredBy: !this.isFilter ? this.user.getUserData().userCode : null,
        recordModificationDate: !this.isFilter ? new FormControl(this.currentDay) : null,
        recordStatus: new FormControl(true),
        statusOrderServiceId: new FormControl(null),
        inspectionProgramId: new FormControl(this.inspectionProgramId),
        visitResultId: new FormControl(this.visitResultId)
      })
      this.serviceOrderCopy = _.clone(this.serviceOrder)

      if (this.isFilter) {

        this.tool.removeValidators(this.serviceOrder)
      }
    }

  }
  ValidateDate(control: AbstractControl) {

    if (control.value.length === 10) {
      return true
    }
  }
  editForm(order: serviceOrder) {


    this.HttpService.get<DropDownOptionModel[]>(`TypeOfApplicant/TypeOfApplicants/${order.serviceTypeId}`).subscribe((response) => {
      this.applicantTypes = response;
      this.otherApplicantTypes();
    });

    this.serviceOrder = this.fb.group({
      serviceOrderId: new FormControl(order.serviceOrderId),
      serviceOrderNumber: new FormControl(order.serviceOrderNumber),
      orderDate: new FormControl(this.tool.dateToObject(order.orderDate)),
      repLocalProvId: new FormControl(order.repLocalProvId, Validators.required),
      newEstimatedDeadline: new FormControl(this.tool.dateToObject(order.newEstimatedDeadline)),
      justificationChangeEstimatedDate: new FormControl(order.justificationChangeEstimatedDate),
      justificationChangeEstimatedDateId: new FormControl(order.justificationChangeEstimatedDateId),
      serviceTypeId: new FormControl(order.serviceTypeId, Validators.required),
      applicantTypeId: new FormControl(order.applicantTypeId, Validators.required),
      justifAnotherTypeApplicant: new FormControl(order.justifAnotherTypeApplicant),
      requestFormId: new FormControl(order.requestFormId, Validators.required),
      estimatedDeadLine: new FormControl(this.tool.dateToObject(order.estimatedDeadLine), Validators.required),
      amountDaysNoticeClosing: new FormControl(order.amountDaysNoticeClosing, [Validators.required, Validators.min(1)]),
      registrationDate: new FormControl(order.fechaRegistro),
      inspectionReasonsListed: new FormControl(this.tool.JsonToObject(order.inspectionReasonsListedJson), Validators.required),
      inspectionReasonObservations: new FormControl(order.inspectionReasonObservations),
      registeredBy: new FormControl(order.registradoPor),
      recordModificationDate: new FormControl(this.currentDay),
      registeredByName: order.registeredByName,
      modifiedBy: this.user.getUserData().userCode,
      recordStatus: new FormControl(order.estatusRegistro),
      statusOrderServiceId: new FormControl(order.statusOrderServiceId),
      inspectionProgramId: new FormControl(order.inspectionProgramId),
      visitResultId: new FormControl(order.visitResultId)
    })
    this.otherJustification()
    this.motivesObservation()
    this.getApllicantTypes()
  }
  otherJustification() {

    if (!this.isFilter) {
      let option = this.serviceOrder.get('justificationChangeEstimatedDateId').value;

      if (this.Justifications?.find(x => x.value == option)?.hasOptionalField == true) {

        this.Justification = true;
        this.serviceOrder.get('justificationChangeEstimatedDate').setValidators([Validators.required])
        this.serviceOrder.get('justificationChangeEstimatedDate').updateValueAndValidity();

      }
      else {
        this.Justification = false;
        this.serviceOrder.get('justificationChangeEstimatedDate').clearValidators()
        this.serviceOrder.get('justificationChangeEstimatedDate').updateValueAndValidity();
      }
    }
  }
  async getDropdowns() {
    if (this.tool.hasInternetConnection) {
      const inspectionP = this.HttpService.get<DropDownOptionModel[]>(`InspectionReason`).toPromise()
      const serviceTypeP = this.HttpService.get<DropDownOptionModel[]>(`TypeOfService`).toPromise()
      const localRepresentivesP = this.HttpService.get<DropDownOptionModel[]>(`LocalRepresentativeProvince`).toPromise()
      const requestFormsP = this.HttpService.get<DropDownOptionModel[]>(`RequestForm`).toPromise()
      const justificationP = this.HttpService.get<DropDownOptionModel[]>(`JustificationChangeEstimatedDate?status=true`).toPromise()
      const statusP = this.HttpService.get<any[]>(`StatusServiceOrder?status=true`).toPromise()
      const applicantTypeP = this.HttpService.get<any[]>(`TypeOfApplicant`).toPromise()
      let [inspection, serviceType, localRepresentatives, requestForms, justifications, statusServiceOrder, applicantType] = await Promise.all([inspectionP,
        serviceTypeP,
        localRepresentivesP,
        requestFormsP,
        justificationP,
        statusP, applicantTypeP])

      this.inspectionMotives = inspection;
      this.serviceTypes = serviceType;
      this.localRepresentatives = localRepresentatives;
      this.requestForms = requestForms;
      this.Justifications = justifications;
      this.statusServiceOrder = statusServiceOrder;
      this.applicantTypes = applicantType
      this.otherJustification()

      if (!localStorage.getItem('OrderDropDowns')) {
        this.saveInLS()
      }
    }
    else {
      this.assignLS(JSON.parse(localStorage.getItem('OrderDropDowns')));



    }
    if (!this.serviceOrderInput && !this.isFilter) {
      this.getInitialStatus()

    }
  }
  getInitialStatus() {

    this.serviceOrder.patchValue({
      statusOrderServiceId: this.statusServiceOrder.find(status => status.alternateField == "RRLTE").value
    })
  }


  mapDates() {
    let orderDate = this.ngbDateParserFormatter.format(this.serviceOrder.controls['orderDate'].value)

    this.serviceOrder.patchValue({
      'orderDate': orderDate
    })
  }


  otherApplicantTypes() {
    let option = this.serviceOrder.get('applicantTypeId').value;

    if (this.applicantTypes?.find(x => x.value == option)?.hasOptionalField == true) {

      this.otherApplicant = true;
      this.serviceOrder.get('justifAnotherTypeApplicant').setValidators([Validators.required])
      this.serviceOrder.get('justifAnotherTypeApplicant').updateValueAndValidity();

    }
    else {
      this.otherApplicant = false;
      this.serviceOrder.get('justifAnotherTypeApplicant').clearValidators()
      this.serviceOrder.get('justifAnotherTypeApplicant').updateValueAndValidity();
    }
  }


  newDeadlineValidator() {
    this.serviceOrder.get('justificationChangeEstimatedDateId').setValidators(Validators.required)

    this.hasJustification.emit(true)
    this.serviceOrder.patchValue({
      'justificationChangeEstimatedDateId': null
    })
    this.serviceOrder.get('justificationChangeEstimatedDateId').updateValueAndValidity();
  }

  motivesObservation() {
    if (!this.isFilter) {
      let option: any[] = this.serviceOrder.get('inspectionReasonsListed').value;
      let test = false;
      option.map(t => {
        if (option.length > 1) {
          test = true;
          this.serviceOrder.get('inspectionReasonObservations').setValidators([Validators.required])
          this.serviceOrder.get('inspectionReasonObservations').updateValueAndValidity();
        }
        else {
          this.serviceOrder.get('inspectionReasonObservations').clearValidators()
          this.serviceOrder.get('inspectionReasonObservations').updateValueAndValidity();
        }

      })

      this.otherObeservations = test;
    }

  }
  addBusinessDays(originalDate, numDaysToAdd): string {
    const Sunday = 0;
    const Saturday = 6;
    let daysRemaining = numDaysToAdd;

    const newDate = originalDate

    while (daysRemaining > 0) {
      newDate.add(1, 'days');
      if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
        daysRemaining--;
      }
    }

    return newDate.format('YYYY-MM-DD');
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.serviceOrder.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

  }
  notFound() {
    this.show = true;
    setTimeout(() => { this.show = false }, 1000)
  }

  ngOnDestroy(): void {
    //  this.connectionSubscription.unsubscribe()
  }

  saveInLS() {
    let dropDowns = {
      inspectionMotives: this.inspectionMotives,
      serviceTypes: this.serviceTypes,
      localRepresentatives: this.localRepresentatives,
      requestForms: this.requestForms,
      Justifications: this.Justifications,
      applicantTypes: this.applicantTypes,
      statusServiceOrder: this.statusServiceOrder
    };
    localStorage.setItem('OrderDropDowns', JSON.stringify(dropDowns))
  }


  assignLS({ inspectionMotives,
    serviceTypes,
    localRepresentatives,
    requestForms,
    Justifications,
    applicantTypes,
    statusServiceOrder
  }) {
    this.inspectionMotives = inspectionMotives
    this.serviceTypes = serviceTypes
    this.localRepresentatives = localRepresentatives
    this.requestForms = requestForms
    this.Justifications = Justifications
    this.applicantTypes = applicantTypes
    this.applicantTypesC = applicantTypes
    this.statusServiceOrder = statusServiceOrder
  }

  clean() {
    this.serviceOrder.patchValue({
      serviceOrderId: !this.isFilter ? 0 : null,
      orderDate: null,
      newEstimatedDeadline: null,
      justificationChangeEstimatedDate: null,
      justificationChangeEstimatedDateId: null,
      repLocalProvId: this.currentUser.repLocalProvId,
      serviceTypeId: null,
      applicantTypeId: null,
      justifAnotherTypeApplicant: null,
      requestFormId: null,
      estimatedDeadLine: null,
      amountDaysNoticeClosing: null,
      registrationDate: this.currentDay,
      inspectionReasonsListed: [],
      inspectionReasonObservations: null,
      registeredBy: this.currentUser.userCode,
      recordModificationDate: this.currentDay,
      recordStatus: true,
      StatusOrderServiceId: null,
      InspectionProgramId: null
    })
    this.getInitialStatus()
  }


  setClass() {

    if (this.serviceOrder.get('inspectionReasonsListed').invalid && this.serviceOrder.get('inspectionReasonsListed').touched) { return 'invalid' }
    else { return '' }
  }

}