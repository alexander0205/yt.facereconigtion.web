import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { DropDownOptionModel } from 'src/app/modules/shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { user } from 'src/app/modules/auth/_models/User';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';

import { Modal, Collapse } from 'bootstrap';
import { FileListEntity } from 'src/app/modules/shared/_services/http-client/types/file-list-entity';
import { DailyAttendanceEmployerDocument } from 'src/app/modules/shared/_services/http-client/types/DailyAttendanceEmployerDocument';
import { AsistenciaDiariaResponse } from 'src/app/modules/shared/_services/http-client/types/AsistenciaDiariaResponse';
import { AsistenciaDiariaEmpleadorResponse } from 'src/app/modules/shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { CompanyResponse } from 'src/app/modules/shared/_services/http-client/types/CompanyResponse';
import { SweetAlertService } from 'src/app/modules/shared/_services/sweetAlert/sweet-alert.service';
import { ToastService } from 'src/app/modules/shared/_services/toast/toast.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotesComponent } from 'src/app/modules/notes/notes.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SucursalesModalComponent } from './sucursales-modal/sucursales-modal.component';
import Swal from 'sweetalert2';
import { ConsultaOrdenSicitResponse } from 'src/app/modules/shared/_services/http-client/types/ConsultaOrdenSicitResponse';
import { WitnessReferencesModalComponent } from './witnessReferences-modal/witnessReferencess-modal.component';
import { WitnessModalComponent } from './witness-modal/witness-modal.component';
type AccordionType =
  | 'EmpresaFormalizada'
  | 'Referencia'
  | 'SocioEconomica'
  | 'FundamentoDefenza'
  | 'Testigos'
  | 'Documentos'
  | 'Correspondencia'
  | 'Observaciones'
  | 'AsignarAbogado'
  | 'ElementosDelContratoDeTrabajo'
  | 'CausasTerminacion'
  | 'ElementosDelSalario'
  | 'asistenciaJudicialFirmada'
  | 'InformacionGeneral'
  | 'OrdenesSicit'
  ;

@Component({
  selector: 'app-forms-creation',
  templateUrl: './forms-creation.component.html',
  styleUrls: ['./forms-creation.component.css'],
})
export class FormsCreationComponent implements OnInit {
  asistenciaId: string;

  selected: boolean = false;
  user: any;
  today: string;
  errorMessageForDocumentNumber: string;
  validateExistAsistenciaJudicial = false;

  citizens: any;
  citizen: any;

  economicActivities: any;
  asistenciaIdConsulta: any;

  // Referencias personales
  provinceReference: any;
  municipalityReference: any;
  municilapDistrictReference: any;


  //#region  Declare DropDownOptionModel
  nationalityDrop: any;
  localRepresentativeDrop: DropDownOptionModel[] = [];
  abogadosDrop: any;
  identificationDrop: any;
  reasonOfVisitDrop: any;
  typeApplicantDrop: any;
  referidoDrop: DropDownOptionModel[] = [];
  civilStatusDrop: DropDownOptionModel[] = [];
  sexDrop: DropDownOptionModel[] = [];
  rTEDrop: DropDownOptionModel[] = [];
  typeOfCorrespondenceDrop: DropDownOptionModel[] = [];
  typeOfDocumentDrop: any;
  processPhaseDrop: DropDownOptionModel[] = [];
  proxyCourtDrop: DropDownOptionModel[] = [];
  typeWorkDayDrop: DropDownOptionModel[] = [];
  workDayDrop: DropDownOptionModel[] = [];
  causeOfContractSuspensionDrop: DropDownOptionModel[] = [];
  paymentPeriodDrop: DropDownOptionModel[] = [];
  motivoAsignacionAbogadoDrop: DropDownOptionModel[] = [];
  localrepresentative: any;
  motivoDeLaDemandaDrop: DropDownOptionModel[] = [];
  //#endregion

  //#region  Declare FormGroup
  asistenciaDiariaForm: FormGroup;
  empresaFormalizadaForm: FormGroup;
  situacionEconomicaForm: FormGroup;
  asignarAbogadoForm: FormGroup;
  testigosForm: FormGroup;
  asistenciaJudicialHeaderForm: FormGroup;
  referenciaPersonalesForm: FormGroup;
  fundamentoDefensaForm: FormGroup;
  empleadorDocumentoForm: FormGroup;
  empleadorCorrespondenciaForm: FormGroup;
  empleadorObservacionForm: FormGroup;
  contratoTrabajoForm: FormGroup;
  causasSuspencionContratoForm: FormGroup;
  salarioForm: FormGroup;
  asistenciaJudicialPdf: FormGroup;
  asistenciaJudicialFirmadaForm: FormGroup;
  informacionGeneralForm: FormGroup;
  ordenesSicitForm: FormGroup;


  //#endregion
  asistenciaJudicial: AsistenciaDiariaEmpleadorResponse
  //#region  Declare Files
  fundamentoDefensaFiles: any = [];
  fundamentoDefensaFilesItem: File[] = [];
  asistenciJudicialPdfFIle: File[] = [];
  empleadorDocumentoFilesItem = [];
  empleadorCorrespondenciaFilesItem: File[] = [];
  TipoSolicitante: any;
  formularioEmpresaFormalizadaEmpleador: any;
  formularioReferenciaPersonalesUnoEmpleador: any;
  //#endregion

  companyData: any;
  mailNumber: string;
  showNoResultsMessage: boolean = false;
  resultMailNumber: any;
  resultMailNumberSiscord: any;

  //Is for show acordeon asistencia judicial firmada
  isConsulting: boolean = false;

  //tabla de Refencias personales en Empleador/Trabajador
  referenciasPersonales: any;
  referenciaTestigos: any;

  newSelectDisabled: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private HttpService: HttpClientService,
    private users: UserService,
    private tool: ToolsService,
    private formBuilder: FormBuilder,
    private sweet: SweetAlertService,
    private toast: ToastService,
    private ngBModal: NgbModal,
  ) { }

  dropdownSettings: any = {};
  rltdropdownSettings: any = {};
  rltedropdownSettings: any = {};

  nacionalityDropdownSettings: any = {};
  nacionalityPersonaDropdownSettings: any = {};
  economicActivityDropdownSettings: any = {};
  documentoAnexoDropdownSettings: any = {};

  lawyerDropdownSettings: any = {};
  alternativeLawyerDropdownSettings: any = {};
  selectedLawyerOneItem: any;

  provinciaDropdownSettings: any = {};
  municipioDropdownSettings: any = {};
  distritoDropdownSettings: any = {};

  selectedItem: any = [];

  selectedItemPrincipalLayer: any = [];
  selectedItemAlternateLayer: any = [];

  closeDropdownSelection = true;

  idSignedFile: any;

  nacionalidadPersonaFisicaDrop: any;

  async ngOnInit() {
    this.user = this.users.getUserData() as user;
    this.getReasonOfVisit();

    //Ng-multiple-select Plugin
    this.dropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'userId',
      textField: 'fullName',
    };

    this.rltdropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };

    this.rltedropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };

    this.lawyerDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'userId',
      textField: 'fullName',
    };

    this.alternativeLawyerDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'userId',
      textField: 'fullName',
    };

    this.nacionalityDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };

    this.nacionalityPersonaDropdownSettings = {
      singleSelection: false,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'item_id',
      textField: 'text',
    };

    this.economicActivityDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'id',
      textField: 'nombre',
    };

    this.documentoAnexoDropdownSettings = {
      singleSelection: false,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };

    this.provinciaDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'id',
      textField: 'descripcion',
    };

    this.municipioDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'id',
      textField: 'descripcion',
    };

    this.distritoDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'id',
      textField: 'descripcion',
    };

    this.checkRolesToSaveOrEdit();

    this.asistenciaId = this.route.snapshot.params['idAsistenciaDiaria'];
    
    this.getProvinces();
    this.getMunicipios();
    this.getDistritosMunicipales();

    this.getMotivoDeLaDemanda();

    //#region Delclare formBuilder
    this.formBuilderCreate();
    //#region

    this.checkloggedUserRlt();

    this.getListAbogado();
    this.getAlternateLayer();
    this.getSex();
    this.getCauseOfContractSuspension();
    this.getCivilStatus();
    this.getNationality();
    this.getNationalityPersonaFisica();
    this.getRlt();
    this.getTypeWorkDay();
    this.getWorkDay();
    this.getPaymentPeriod();
    this.getTypeOfIdentification();
    this.getTypeOfApplicant();
    this.getReferido();
    this.getRepresentanteTrabajadorEmpleador();
    this.getTypeOfCorrespondence();
    this.getTypeOfDocument();
    this.getProcessPhase();
    this.getProxyCourt();
    this.calendar();
    this.getMotivoDeLaDemanda()
    this.calendarFechaAcordeon()
    this.getMotivoAsignacionUsario()

    this.onChangeTipoSolicitante();

    this.getEconomicActivities();

    if (this.asistenciaId) {
      this.loadData(this.asistenciaId);

      var acordionAsistenciaJudicialFirmada = document.getElementById('AsistenciaJudicial');

      acordionAsistenciaJudicialFirmada.style.display = "none"
    }


    this.asistenciaJudicialHeaderForm
      .get('tieneApoderadoSuDemanda')
      .valueChanges.subscribe((value) => {
        this.onClickTieneAporadoEnSuDemanda();
      });

    this.asistenciaJudicialHeaderForm
      .get('tipoEmpleador')
      .valueChanges.subscribe((value) => {
        this.employerTypeForm(value);
      });

    this.asistenciaJudicialHeaderForm
      .get('tipoEmpleador')
      .valueChanges.subscribe((value) => {
        if (value === 'FORMALIZADA') {
          if (value === 'tipoEmpleador') {
            this.empresaFormalizadaForm
              .get('rncCedula')
              .setValidators([
                Validators.required,
                Validators.pattern('^[0-9]+(-[0-9]+)*$'),
              ]);
          } else {
            this.empresaFormalizadaForm
              .get('rncCedula').setValidators([Validators.pattern('^[0-9]+(-[0-9]+)*$')]);
          }
        } else {
          this.empresaFormalizadaForm.get('rncCedula').setValidators(null);
        }

        this.empresaFormalizadaForm.get('rncCedula').updateValueAndValidity();
        this.onChangeTipoSolicitante()
      });

    if (!this.asistenciaId) {
      this.route.queryParams.subscribe(params => {
        params?.nombre ? this.asistenciaDiariaForm.patchValue({ nombre: params?.nombre }) : '';
        params?.apellido ? this.asistenciaDiariaForm.patchValue({ apellido: params?.apellido }) : '';
        params?.idSexo ? this.asistenciaDiariaForm.patchValue({ idSexo: params?.idSexo }) : '';
        params?.edad ? this.asistenciaDiariaForm.patchValue({ edad: params?.edad }) : '';
        params?.idRepLocalProvinciaCatalog ? this.asistenciaDiariaForm.patchValue({ idRepLocalProvinciaCatalog: params?.idRepLocalProvinciaCatalog }) : '';
        params?.idTipoIdentificacion ? this.asistenciaDiariaForm.patchValue({ idTipoIdentificacion: params?.idTipoIdentificacion }) : '';
        if (params?.idNacionalidad) {
          this.asistenciaDiariaForm.patchValue({ idNacionalidad: params?.idNacionalidad })
          this.HttpService.get<any[]>(`Nationality/${params?.idNacionalidad}`).subscribe((data) => {
            this.asistenciaDiariaForm.patchValue({ idNacionalidadDropDown: [data] })
          });
        }
        params?.idTipoSolicitante ? this.asistenciaDiariaForm.patchValue({ idTipoSolicitante: params?.idTipoSolicitante }) : '';
        params?.telefono ? this.asistenciaDiariaForm.patchValue({ telefono: params?.telefono }) : '';
        params?.correoElectronico ? this.asistenciaDiariaForm.patchValue({ correoElectronico: params?.correoElectronico }) : '';
        params?.telefonoOtraParte ? this.asistenciaDiariaForm.patchValue({ telefonoOtraParte: params?.telefonoOtraParte }) : '';
        params?.idMotivoVisita ? this.asistenciaDiariaForm.patchValue({ idMotivoVisita: params?.idMotivoVisita }) : '';
        params?.idEstadoCivil ? this.asistenciaDiariaForm.patchValue({ idEstadoCivil: params?.idEstadoCivil }) : '';
        params?.idAbogado ? this.asistenciaDiariaForm.patchValue({ idAbogado: params?.idAbogado }) : '';
        params?.idAbogadoAlterno ? this.asistenciaDiariaForm.patchValue({ idAbogadoAlterno: params?.idAbogadoAlterno }) : '';
        params?.observaciones ? this.asistenciaDiariaForm.patchValue({ observaciones: params?.observaciones }) : '';
        params?.idRepresentante ? this.asistenciaDiariaForm.patchValue({ idSexo: params?.idRepresentante }) : '';
        params?.idReferido ? this.asistenciaDiariaForm.patchValue({ idReferido: params?.idReferido }) : '';
        params?.nombreUsuario ? this.asistenciaDiariaForm.patchValue({ nombreUsuario: params?.nombreUsuario }) : '';
        params?.identificacion ? this.asistenciaDiariaForm.patchValue({ identificacion: params?.identificacion }) : '';

      });
    }

    if (this.user.roleCode == 'COOR') {
      this.checkRoleToAssingLawyer();
    }
  }

  checkRoleToAssingLawyer() {
    var lawyerField = this.asignarAbogadoForm.get('idAbogadoDropDown').value;

    if (lawyerField) {
      this.asignarAbogadoForm.disable();
    }
  }

  onItemSelect(item: any) {
    this.filterPrincipalLayer();
    const abogadoSeleted: any = this.abogadosDrop?.find((x: any) => x.userId == item.userId)
    this.asistenciaDiariaForm.patchValue({ idAbogado: item.userId })
    this.asignarAbogadoForm.patchValue({ idAbogado: item.userId, idAbogadoDropDown: [abogadoSeleted] })
  }

  onItemAlternoSelect(item: any) {
    this.filterAlternateLayer();
    const abogadoSeleted: any = this.abogadoAlternoDrop?.find((x: any) => x.userId == item.userId)
    this.asistenciaDiariaForm.patchValue({ idAbogadoAlterno: item.userId })
    this.asignarAbogadoForm.patchValue({ idAbogadoAlterno: item.userId, idAbogadoAlternoDropDown: [abogadoSeleted] })
  }

  onItemDeSelect(item: any) {
    this.asistenciaDiariaForm.patchValue({ idAbogado: null })
    this.asignarAbogadoForm.patchValue({ idAbogado: null, idAbogadoDropDown: null })
  }
  onItemAlternoDeSelect(item: any) {
    this.asistenciaDiariaForm.patchValue({ idAbogadoAlterno: null })
    this.asignarAbogadoForm.patchValue({ idAbogadoAlterno: null, idAbogadoAlternoDropDown: null })
  }

  //Asistencia Diaria - Representacion Local
  onRltSelect(item: any) {
    this.asistenciaDiariaForm.patchValue({ idRepLocalProvinciaCatalog: item.value })
    this.informacionGeneralForm.patchValue({ idRepLocalProvinciaCatalog: item.value, idRepLocalProvinciaCatalogDropDown: [item] })
  }

  onDeRLTSelect(item: any) {
    this.asistenciaDiariaForm.patchValue({ idRepLocalProvinciaCatalog: null })
    this.informacionGeneralForm.patchValue({ idRepLocalProvinciaCatalog: null, idRepLocalProvinciaCatalogDropDown: [] })
  }

  //Asignacion y reasignacion de abogados listas
  onlawyerOneSelect(item: any) { this.asignarAbogadoForm.patchValue({ idAbogado: item.userId }); }
  onlawyerTwoSelect(item: any) { this.asignarAbogadoForm.patchValue({ idAbogadoAlterno: item.userId }) }
  onlawyerThreeSelect(item: any) { this.asignarAbogadoForm.patchValue({ idAbogadoAlternoOne: item.userId }) }

  onlawyerOneDeSelect(item: any) { this.asistenciaDiariaForm.patchValue({ idAbogado: null }) }
  onlawyerTwoDeSelect(item: any) { this.asistenciaDiariaForm.patchValue({ idAbogado: null }); }

  // Asistencia diaria - Nacionalidad
  onNacionalitySelect(item: any) { this.asistenciaDiariaForm.patchValue({ idNacionalidad: item.value }); }

  onNacionalityPersonaSelect(item: any) { console.log(item); }

  //Empleador/Trabajador - Actividad Economica
  onEconomicActivitySelect(item: any) { this.empresaFormalizadaForm.patchValue({ idTipoActividadComercial: item.id }) }

  //Informacion General
  onRlteSelect(item: any) { this.informacionGeneralForm.patchValue({ idRepLocalProvinciaCatalog: item.value }) }

  //Documento Anexo
  onDocumentoAnexoSelect(item: any) {
    // this.onTipoDocumentoChange(event) 

    const selectedDocument = this.typeOfDocumentDrop.find(
      (doc) => doc.value === item.value
    );

    this.documentos.push(
      this.formBuilder.group({
        idTipoDocumento: [selectedDocument.value],
        nombre: [selectedDocument.text],
      })
    );
  }

  /* 
    Divisiones Territoriales

    Provincia, Municipio y Distrito Municipal
  */

  onProvinciaSelect(item: any) { this.provinceReference = item;  }

  onMunicipioSelect(item: any) { this.municipalityReference = item;  }

  onDistritoSelect(item: any) { this.municilapDistrictReference = item; }

  toggleCloseDropdownSelection() {
    this.closeDropdownSelection = !this.closeDropdownSelection;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { closeDropDownOnSelection: this.closeDropdownSelection });
  }


  private formBuilderCreate() {
    this.asistenciaDiariaForm = this.formBuilder.group({
      idAsistenciaDiaria: [0],
      idUsuario: [this.user.userId],
      fechaAlta: [new Date().toISOString().substring(0, 10)],
      idRepLocalProvinciaCatalog: ['', Validators.required],
      idTipoIdentificacion: ['', Validators.required],
      identificacion: ['', Validators.required],
      nombre: [],
      apellido: [],
      idSexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.maxLength(2)]],
      idNacionalidad: ['', Validators.required],
      idTipoSolicitante: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.maxLength(12),
        ],
      ],
      correoElectronico: [
        '',
        [Validators.email, Validators.pattern('.+@.+.[a-zA-Z]{2,3}')],
      ],
      telefonoOtraParte: [
        '',
        [Validators.pattern(/^[0-9]+$/), Validators.minLength(10)],
      ],
      idMotivoVisita: ['', Validators.required],
      idEstadoCivil: ['', Validators.required],
      idAbogado: [''],
      idAbogadoAlterno: [''],
      observaciones: [''],
      idRepresentante: [''],
      idReferido: [''],
      nombreUsuario: [this.user.getFullName()],
      codigo: [''],
      idAbogadoDropDown: [[]],
      idAbogadoAlternoDropDown: [[]],
      idNacionalidadDropDown: [[]],
      idRepLocalProvinciaCatalogDropDown: [[]],
    }, { validator: this.abogadosIguales });

    this.informacionGeneralForm = this.formBuilder.group({
      fechaRegistro: [
        new Date().toISOString().substring(0, 10)
      ],
      idRepLocalProvinciaCatalog: [''],
      idRepLocalProvinciaCatalogDropDown: [],
    })

    this.empresaFormalizadaForm = this.formBuilder.group({
      idEmpresa: [''],
      idAsistenciaDiariaEmpleador: [''],
      rncCedula: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(-[0-9]+)*$')],
      ],
      rnl: [''],
      nombreComercial: [''],
      razonSocial: [''],
      nombre: [''],
      apellido: [''],
      provincia: ['', Validators.required],
      municipio: ['', Validators.required],
      distritoMunicipal: ['', Validators.required],
      sector: [''],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      edificio: [''],
      direccionReferencia: [''],
      apartamentoCasa: [''],
      idTipoActividadComercial: ['', Validators.required],
      idTipoActividadComercialDropDown: [[], Validators.required],
      dedicacion: ['', Validators.required],
      representanteLegalEmpleador: [''],
      idTipoIdentificacion: [''],
      identificacion: [''],
      telefono: ['', Validators.required],
      correoElectronico: ['', Validators.pattern('.+@.+.[a-zA-Z]{2,3}')],
      idNacionalidad: [''],
      idNacionalidadDropDown: [[]],
      idEstadoCivil: [''],
    });

    this.referenciaPersonalesForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      provincia: [],
      provinciaDropDown: [[]],
      municipio: [''],
      municipioDropDown: [[]],
      distritoMunicipal: [''],
      distritoMunicipalDropDown: [[]],
      sector: [''],
      calle: [''],
      edificio: [''],
      apartamentoCasa: [''],
      correoElectronico: [''],
      telefono: [''],
      numero: [''],
    });

    this.situacionEconomicaForm = this.formBuilder.group({
      idEmpresaSituacionEconomica: [''],
      cantidadSocio: [''],
      cantidadSucursal: [''],
      valorExistenciaInstalacion: [''],
      promerioMensual: [''],
      salario: [''],
    });

    this.fundamentoDefensaForm = this.formBuilder.group({
      idAsistenciaDiariaEmpleadorNotificacion: [''],
      idAsistenciaDiariaEmpleador: [''],
      idTribunalApoderado: [''],
      idFaseProceso: [''],
      idMotivoDemanda: [''],
      tieneNotificacionActoDeAlguacil: [true, Validators.requiredTrue],
      nombreDemandante: [''],
      descripcionDocumentoNotificado: [''],
    });

    this.empleadorDocumentoForm = this.formBuilder.group({
      documentos: this.formBuilder.array([]),
    });

    this.empleadorCorrespondenciaForm = this.formBuilder.group({
      CodigoCorrespondencia: [''],
      idTipoCorrespondencia: [''],
    });

    this.testigosForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      provincia: [''],
      provinciaDropDown: [[]],
      municipio: [''],
      municipioDropDown: [[]],
      distritoMunicipal: [''],
      distritoMunicipalDropDown: [[]],
      sector: [''],
      calle: [''],
      edificio: [''],
      apartamentoCasa: [''],
      correoElectronico: [''],
      telefono: [''],
      numero: [''],
      observaciones: [''],
    });

    this.empleadorObservacionForm = this.formBuilder.group({
      observacion: ['', Validators.required],
    });

    this.asignarAbogadoForm = this.formBuilder.group({
      idMotivoAsignacionUsuario: ['', Validators.required],
      idAbogado: [''],
      idAbogadoDropDown: [[]],
      idAbogadoAlterno: [''],
      idAbogadoAlternoDropDown: [[]],
      idAbogadoAlternoOne: [''],
      idAbogadoAlternoOneDropDown: [[]],
      fechaAsignacion: [
        { value: new Date().toISOString().substring(0, 10), disabled: true },
      ],
      fechaRegistro: [
        { value: new Date().toISOString().split('T')[0], disabled: true },
      ],
    }, { validator: this.abogadosIgualesEnAsignarYReasignar });

    this.asistenciaJudicialHeaderForm = this.formBuilder.group({
      tipoEmpleador: [''],
      tieneApoderadoSuDemanda: [''],
      idAsistenciaDiariaEmpleador: ['']
    });

    this.contratoTrabajoForm = this.formBuilder.group({
      idAsistenciaDiariaEmpleadorContratoLaboral: [''],
      idTipoJornada: [null, Validators.required],
      idJornadaLaboral: [null, Validators.required],
      ocupacion: '',
      lugarTrabajo: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
      departamento: [''],
      supervisorInmediato: [''],
    });

    this.causasSuspencionContratoForm = this.formBuilder.group({
      idMotivoDemanda: [null, Validators.required],
      fecha: [''],
    });

    this.salarioForm = this.formBuilder.group({
      idAsistenciaDiariaEmpleadorSalario: [null],
      idPeriodoPago: [null, Validators.required],
      monto: [null, Validators.required],
      horasExtraordinarias: [null, Validators.required],
      diasFeriados: [null, Validators.required],
      denscansoSemanal: [null, Validators.required],
      vacaciones: [null, Validators.required],
      salarioNavidad: [null, Validators.required],
      participacionBeneficios: [null, Validators.required],
      incentivos: [null, Validators.required],
      otros: [''],
    });

    this.asistenciaJudicialFirmadaForm = this.formBuilder.group({
      idArchivoDocumentoFirmado: [''],
      comentarioDocumentoFirmado: ['']
    });
    this.formBuilderOrdenesSicit()

  }

  formBuilderOrdenesSicit() {
    this.ordenesSicitForm = this.formBuilder.group({
      idAsistenciaDiariaEmpleador: [''],
      idAsistenciaJudicialOrdenServicioSicit: [''],
      empRnc: [''],
      empRnl: [''],
      ordenServicioNumero: ['', Validators.required],
      fechaOrden: [''],
      estadoOrdenServicioInfo: ['']
    });
  }

  abogadosIguales(control: AbstractControl): { [key: string]: boolean } | null {
    const [abogadoPrincipal] = control.get('idAbogadoDropDown').value;
    const [abogadoAlterno] = control.get('idAbogadoAlternoDropDown').value;
    if (abogadoPrincipal || abogadoAlterno) {
      if (abogadoPrincipal?.userId === abogadoAlterno?.userId) {
        return { 'abogadosIguales': true };
      }
    }
    return null;
  }

  abogadosIgualesEnAsignarYReasignar(control: AbstractControl): { [key: string]: boolean } | null {
    const abogadoPrincipalControl = control?.get('idAbogadoDropDown');
    const abogadoAlternoControl = control?.get('idAbogadoAlternoDropDown');
    const abogadoAlternoOneControl = control?.get('idAbogadoAlternoOneDropDown');

    if (abogadoPrincipalControl && abogadoAlternoControl && abogadoAlternoOneControl) {
      const abogadoPrincipal = abogadoPrincipalControl.value?.length > 0 ? abogadoPrincipalControl.value[0] : null;
      const abogadoAlterno = abogadoAlternoControl.value?.length > 0 ? abogadoAlternoControl.value[0] : null;
      const abogadoAlternoOne = abogadoAlternoOneControl.value?.length > 0 ? abogadoAlternoOneControl.value[0] : null;
      if (abogadoPrincipal || abogadoAlterno || abogadoAlternoOne) {
        if (
          (abogadoPrincipal && abogadoAlterno && abogadoPrincipal?.userId === abogadoAlterno?.userId) ||
          (abogadoPrincipal && abogadoAlternoOne && abogadoPrincipal?.userId === abogadoAlternoOne?.userId) ||
          (abogadoAlterno && abogadoAlternoOne && abogadoAlterno?.userId === abogadoAlternoOne?.userId)
        ) {
          return { 'abogadosIgualesEnAsignarYReasignar': true };
        }
      }
    }

    return null;
  }


  getMotivoDeLaDemanda() {
    this.HttpService.get<any[]>('ReasonOfDemand').subscribe((data) => {
      this.motivoDeLaDemandaDrop = data;
    });
  }

  async loadData(_id: string) {
    const asistenciaDiariaData = await this.loadAsistenciaDiaria(_id);

    if (asistenciaDiariaData) {
      await this.loadingAsistenciaDiariaEmpleador(
        asistenciaDiariaData.idAsistenciaDiaria, asistenciaDiariaData
      );
    }
  }

  async loadAsistenciaDiaria(_id: string | number) {
    const _data: AsistenciaDiariaResponse =
      await this.HttpService.getById<AsistenciaDiariaResponse>('AsistenciaDiaria', _id).toPromise().catch((x) => null);

    if (_data) {

      //Representacion local y Fecha de creacion del registro en acordeon informacion general
      this.informacionGeneralForm.patchValue({ idRepLocalProvinciaCatalog: _data?.idRepLocalProvinciaCatalog || '' })
      this.informacionGeneralForm.patchValue({ fechaRegistro: new Date(_data?.fechaRegistro || Date.now()).toISOString().substring(0, 10) })

      this.asistenciaDiariaForm.setValue({
        idAsistenciaDiaria: _data.idAsistenciaDiaria,
        nombreUsuario: `${_data.usuario.firstName.toLocaleLowerCase()} ${_data.usuario.firstLastName.toLocaleLowerCase()}`,
        idUsuario: _data.usuario?.userId || '',
        fechaAlta: new Date(_data.fechaAlta || Date.now())
          .toISOString()
          .substring(0, 10),
        idRepLocalProvinciaCatalog: _data?.idRepLocalProvinciaCatalog || '',
        idRepLocalProvinciaCatalogDropDown: [],
        idTipoIdentificacion: _data?.tipoIdentificacion.id || '',
        identificacion: _data?.identificacion || '',
        nombre: _data?.nombre || '',
        apellido: _data?.apellido || '',
        idSexo: _data.sexo?.id || '',
        edad: _data.edad || '',
        idNacionalidad: _data?.idNacionalidad || '',
        idNacionalidadDropDown: [],
        idTipoSolicitante: _data?.idTipoSolicitante || '',
        telefono: _data.telefono || '',
        correoElectronico: _data.correoElectronico || '',
        telefonoOtraParte: _data.telefonoOtraParte || '',
        idMotivoVisita: _data?.idMotivoVisita || '',
        idEstadoCivil: _data?.idEstadoCivil || '',
        idAbogado: _data.idAbogado || '',
        idAbogadoAlterno: _data?.idAbogadoAlterno || '',
        observaciones: _data.observaciones || '',
        idRepresentante: _data?.idRepresentante || '',
        idReferido: _data?.idReferido || '',
        codigo: _data.codigo,
        idAbogadoDropDown: [],
        idAbogadoAlternoDropDown: []
      });

      console.log('_data', _data);
      this.numeroDocumento = _data.identificacion

      let selectMotivo = document.getElementById('idMotivoVisita') as HTMLSelectElement;

      let selectMotivoValue = selectMotivo.value

      if (parseInt(selectMotivoValue) == 272) {
        selectMotivo.disabled = true
      } else {
        selectMotivo.disabled = false
      }

      if (_data.idMotivoVisita) {
        this.isMotivoConsulta(_data.idMotivoVisita);
      }

      if (_data.idNacionalidad) {
        const nacionalidadSeleted: any = this.nationalityDrop?.find((x: any) => x.value == _data.nacionalidad.id)
        this.asistenciaDiariaForm.patchValue({ idNacionalidadDropDown: [nacionalidadSeleted] });
      }

      if (_data.idRepLocalProvinciaCatalog) {
        const replocalSelected: any = this.localRepresentativeDrop?.find((x: any) => x.value == _data.localRepresentativeProvince.provinceCode)
        this.asistenciaDiariaForm.patchValue({ idRepLocalProvinciaCatalogDropDown: [replocalSelected] })

        const replocalESelected: any = this.localRepresentativeDrop?.find((x: any) => x.value == _data.localRepresentativeProvince.provinceCode)
        this.informacionGeneralForm.patchValue({ idRepLocalProvinciaCatalogDropDown: [replocalESelected] })
      }

      const abogadoSeleted: any = this.abogadosDrop?.find((x: any) => x.userId == _data.idAbogado)
      this.asistenciaDiariaForm.patchValue({ idAbogadoDropDown: [abogadoSeleted] })

      const abogadoAlternoSelected: any = this.abogadosDrop?.find((x: any) => x.userId == _data.idAbogadoAlterno);
      this.asistenciaDiariaForm.patchValue({ idAbogadoAlternoDropDown: [abogadoAlternoSelected] });

      setTimeout(() => {
        this.asistenciaDiariaForm.patchValue({ idMotivoVisita: _data?.idMotivoVisita || '' })
      }, 500)

      if (_data.idTipoSolicitante) {
        const tipoSolicitanteVar = this.typeApplicantDrop.find(ts => ts.value == _data.idTipoSolicitante);

        // if (parseInt(_data.idTipoSolicitante) == 88) {
        if (tipoSolicitanteVar.serviceCode == 'EMPLEADOR' || tipoSolicitanteVar.serviceCode == 'REMPLEADOR') {
          this.TipoSolicitante = 'Empleador'
          document.getElementById('tipoEmpleador').classList.add('showDiv')
          document.getElementById('tipoEmpleador').classList.remove('hiddeDiv')
        } else {
          this.TipoSolicitante = 'Trabajador'
          document.getElementById('tipoEmpleador').classList.remove('showDiv')
          document.getElementById('tipoEmpleador').classList.add('hiddeDiv')
        }
      } 
    }

    this.motivoVisita();

    //Disable all Asistencia Diaria Inputs(Controls)
    this.asistenciaDiariaForm.disable();
    this.newSelectDisabled = true;

    return _data;
  }

  async loadingAsistenciaDiariaEmpleador(idAsistenciaDiaria: string | number, asistenciaDiariaData: AsistenciaDiariaResponse) {
    const data = await this.HttpService.getListDailyAttendanceEmployer({
      idAsistenciaDiaria,
    });

    if (data) {
      this.asistenciaJudicial = data[0]
      const _data = data[0];

      this.informacionGeneralForm.patchValue({
        fechaRegistro: new Date(_data?.fechaRegistro || Date.now()).toISOString().substring(0, 10)
      })

      const idEmpresa = _data?.empresa?.idEmpresa;
      const idAsistenciaDiariaEmpleador = _data.idAsistenciaDiariaEmpleador;

      this.asistenciaJudicialHeaderForm.setValue({
        tieneApoderadoSuDemanda: _data.tieneApoderadoSuDemanda || '',
        tipoEmpleador: _data.tipoEmpleador || '',
        idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador || '',
      });

      if (_data?.idArchivoDocumentoFirmado || _data?.comentarioDocumentoFirmado) {
        this.showIconTo('asistenciaJudicialFirmada', true);
      }

      this.asistenciaJudicialFirmadaForm.setValue({
        comentarioDocumentoFirmado: _data?.comentarioDocumentoFirmado || '',
        idArchivoDocumentoFirmado: ''
      })

      if (_data?.idArchivoDocumentoFirmado) {
        this.HttpService.getFileById(_data?.idArchivoDocumentoFirmado).then((xArchivo: any) => {
          this.selectedFileAsistenciaJudicialFirmada = { name: xArchivo?.nombreArchivo } as any

          this.idSignedFile = { id: xArchivo?.idArchivo, name: xArchivo?.nombreArchivo };
        });
      }

      let motivoVisitaDrop = document.getElementById('idMotivoVisita') as HTMLSelectElement;
      motivoVisitaDrop.disabled = true;

      await this.loadEmpresa(idEmpresa, idAsistenciaDiariaEmpleador);
      await this.loadElementosDelContrato(idAsistenciaDiariaEmpleador);
      await this.LoadCausasTerminacionContrato(idAsistenciaDiariaEmpleador)
      await this.loadOrdenSicit(idAsistenciaDiariaEmpleador)
      await this.loadReferencias(idAsistenciaDiariaEmpleador);
      await this.loadTestigos(idAsistenciaDiariaEmpleador);
      await this.loadDocumentos(idAsistenciaDiariaEmpleador);
      await this.loadFundamentoDefensa(idEmpresa);
      await this.loadFundamentoDefensaForm(idAsistenciaDiariaEmpleador);
      await this.loadCorrespondencia(idAsistenciaDiariaEmpleador);
      await this.loadSalario(idAsistenciaDiariaEmpleador);
      this.loadInformacionesGenerales(_data);
      this.loadObservaciones(_data);
      this.loadAssignarAbogado(_data, asistenciaDiariaData);
      this.irAlFinal();

      //This property is for show Asistencia Judicial Firmada Accordeon
      this.isConsulting = true;

      this.informacionGeneralForm.patchValue({
        fechaRegistro: new Date(_data.fechaRegistro || Date.now())
          .toISOString().substring(0, 10)
      });

      if (idAsistenciaDiariaEmpleador) {
        var acordionAsistenciaJudicialFirmada = document.getElementById('AsistenciaJudicial');

        acordionAsistenciaJudicialFirmada.style.display = "block"

      }
    }

  }

  private loadInformacionesGenerales(data: AsistenciaDiariaEmpleadorResponse) {
    if (data.fechaRegistro) {
      this.informacionGeneralForm.setValue({
        fechaRegistro: data.fechaRegistro,
        idRepLocalProvinciaCatalog: data.idRepLocalProvinciaCatalog,
        idRepLocalProvinciaCatalogDropDown: []
      });
      this.showIconTo('InformacionGeneral', true);
    }

    if (data.idRepLocalProvinciaCatalog) {
      const rlt: any = this.localRepresentativeDrop?.find(rltValues => rltValues.value == data.idRepLocalProvinciaCatalog);
      this.informacionGeneralForm.patchValue({ idRepLocalProvinciaCatalogDropDown: [rlt] })
    }
  }

  private loadObservaciones(data: AsistenciaDiariaEmpleadorResponse) {
    if (data.observacion) {
      this.empleadorObservacionForm.setValue({ observacion: data.observacion });
      this.showIconTo('Observaciones', true);
    }
  }

  private loadAssignarAbogado(data: AsistenciaDiariaEmpleadorResponse, asistenciaDiariaData: AsistenciaDiariaResponse) {
    if (data?.usuario?.userId) {
      this.asignarAbogadoForm.setValue({
        fechaAsignacion: new Date(data.fechaAsignacion || Date.now())
          .toISOString()
          .substring(0, 10),
        fechaRegistro: new Date(data.fechaRegistro || Date.now())
          .toISOString()
          .substring(0, 10),
        idAbogado: asistenciaDiariaData?.idAbogado || '',
        idAbogadoAlterno: asistenciaDiariaData?.idAbogadoAlterno || '',
        idAbogadoAlternoOne: asistenciaDiariaData?.idAbogadoAlterno1 || '',
        idMotivoAsignacionUsuario: asistenciaDiariaData?.idMotivoAsignacionUsuario || '',
        idAbogadoDropDown: [],
        idAbogadoAlternoDropDown: [],
        idAbogadoAlternoOneDropDown: []
      });
      this.showIconTo('AsignarAbogado', true);
    }

    // Abogado
    const abogado = this.abogadosDrop.find(a => a.userId == data.asistenciaDiaria.idAbogado);
    this.asignarAbogadoForm.patchValue({ idAbogadoDropDown: [abogado] })
    
    // Abogado Alterno
    const abogadoA = this.abogadoAlternoDrop.find(aa => aa.userId == data.asistenciaDiaria.idAbogadoAlterno);
    this.asignarAbogadoForm.patchValue({ idAbogadoAlternoDropDown: [abogadoA] });
  }

  private async loadEmpresa(idEmpresa: number, idAsistenciaDiariaEmpleador: number) {
    const empresa: CompanyResponse =
      await this.HttpService.getById<CompanyResponse>('Company', idEmpresa)
        .toPromise()
        .catch((x) => null);

    if (empresa) {
      this.empresaFormalizadaForm.setValue({
        idEmpresa: empresa?.idEmpresa,
        idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador || '',
        rncCedula: empresa.rncCedula || '',
        rnl: empresa.rnl || '',
        nombreComercial: empresa.nombreComercial || '',
        razonSocial: empresa.razonSocial || '',
        nombre: empresa.nombre || '',
        apellido: empresa.apellido || '',
        provincia: empresa.provincia || '',
        municipio: empresa.municipio || '',
        distritoMunicipal: empresa.distritoMunicipal || '',
        sector: empresa.sector || '',
        calle: empresa.calle || '',
        numero: empresa.numero || '',
        edificio: empresa.edificio || '',
        direccionReferencia: empresa.direccionReferencia || '',
        apartamentoCasa: empresa.apartamentoCasa || '',
        idTipoActividadComercial: empresa?.tipoActividadComercial?.id || '',
        idTipoActividadComercialDropDown: [],
        dedicacion: empresa.dedicacion || '',
        representanteLegalEmpleador: empresa.representanteLegalEmpleador || '',
        idTipoIdentificacion: empresa?.tipoIdentificacion?.codigoReferencia || '',
        identificacion: empresa.identificacion || '',
        telefono: empresa.telefono || '',
        correoElectronico: empresa.correoElectronico || '',
        idEstadoCivil: empresa?.idEstadoCivil || '',
        idNacionalidad: empresa?.idNacionalidad || '',
        idNacionalidadDropDown: []
      });
      
      if (empresa.tipoActividadComercial) {
        const idAEOption = this.economicActivities?.find(ae => ae.id == empresa.tipoActividadComercial.id);
        this.empresaFormalizadaForm.patchValue({ idTipoActividadComercialDropDown: [idAEOption] })
      }

      if (empresa.tipoIdentificacion) {
        const documentType = this.identificationDrop?.find(dt => dt.value == empresa.idTipoIdentificacion);
        this.empresaFormalizadaForm.patchValue({ idTipoIdentificacion: documentType.value })
      }

      this.showIconTo('EmpresaFormalizada', this.empresaFormalizadaForm.valid);
    }
  }

  private async loadElementosDelContrato(idAsistenciaDiariaEmpleador: number) {
    const data =
      await this.HttpService.getListDailyAttendanceEmployerWorkContractEmployerById(
        idAsistenciaDiariaEmpleador
      );
    if (data) {
      const _data = data[0];
      this.contratoTrabajoForm.setValue({
        idAsistenciaDiariaEmpleadorContratoLaboral:
          _data?.idAsistenciaDiariaEmpleadorContratoLaboral,
        idTipoJornada: _data?.tipoJornada?.id,
        idJornadaLaboral: _data?.jornadaLaboral?.id,
        ocupacion: _data?.ocupacion,
        lugarTrabajo: _data?.lugarTrabajo,
        fechaInicio: new Date(_data?.fechaInicio || Date.now())
          .toISOString()
          .substring(0, 10),
        fechaFin: new Date(_data?.fechaFin || Date.now())
          .toISOString()
          .substring(0, 10),
        departamento: _data?.departamento,
        supervisorInmediato: _data?.supervisorInmediato,
      });
      this.showIconTo('ElementosDelContratoDeTrabajo', true);

    }
  }

  async LoadCausasTerminacionContrato(idAsistenciaDiariaEmpleador) {
    const result = await this.HttpService.getCausasDeLaterminacionDeContrato(idAsistenciaDiariaEmpleador)
    if (result && result[0]) {
      const data = result[0]
      this.causasSuspencionContratoForm.setValue({
        idMotivoDemanda: data?.motivoDemanda?.id || '',
        fecha: new Date(data?.fecha || Date.now())
          .toISOString()
          .substring(0, 10)
      });
      this.showIconTo('CausasTerminacion', true);
    }
  }

  private async loadOrdenSicit(idAsistenciaDiariaEmpleador: number) {
    const data = await this.HttpService.getAsistenciaJudicialOrdenServicioSicit(idAsistenciaDiariaEmpleador)
    
    if (data) {
      const _data = data[0];
      const { asistenciaDiariaEmpleador, activo, fechaOrden, ...restData } = _data;
      this.ordenesSicitForm.setValue({...restData, fechaOrden: fechaOrden ? new Date(fechaOrden).toISOString().substring(0, 10) : ''});
      this.showIconTo('OrdenesSicit', true);
    }
  }

  private async loadSalario(idAsistenciaDiariaEmpleador: number) {
    const data =
      await this.HttpService.getListDailyAttendanceEmployerSalaryEmployerById(
        idAsistenciaDiariaEmpleador
      );
    if (data) {
      const _data = data[0];
      this.salarioForm.setValue({
        idAsistenciaDiariaEmpleadorSalario:
          _data?.idAsistenciaDiariaEmpleadorSalario,
        idPeriodoPago: _data?.periodoPago?.id || '',
        monto: _data?.monto,
        // equivalenteEnDOP: _data?.equivalenteEnDOP,
        horasExtraordinarias: _data?.horasExtraordinarias,
        diasFeriados: _data?.diasFeriados,
        denscansoSemanal: _data?.denscansoSemanal,
        vacaciones: _data?.vacaciones,
        salarioNavidad: _data?.salarioNavidad,
        participacionBeneficios: _data?.participacionBeneficios,
        incentivos: _data?.incentivos,
        otros: _data?.otros,
      });
      this.showIconTo('ElementosDelSalario', true);
    }
  }
  private async loadFundamentoDefensa(idEmpresa: number) {
    const situacionEconomica = await this.HttpService.getWithQuery<{
      idEmpresa: number;
    }>('CompanyEconomicSituation', { idEmpresa: idEmpresa })
      .toPromise()
      .catch((x) => null);
    if (situacionEconomica) {
      const _situacionEconomica = situacionEconomica[0];
      this.situacionEconomicaForm.setValue({
        idEmpresaSituacionEconomica:
          _situacionEconomica.idEmpresaSituacionEconomica || '',
        cantidadSocio: _situacionEconomica.cantidadSocio || '',
        cantidadSucursal: _situacionEconomica.cantidadSucursal || '',
        valorExistenciaInstalacion:
          _situacionEconomica.valorExistenciaInstalacion || '',
        promerioMensual: _situacionEconomica.promerioMensual || '',
        salario: _situacionEconomica.salario || '',
      });
      this.showIconTo('SocioEconomica', true);
    }
  }

  //#region  Load Dropdowns
  // Get All Local Representative Province
  getRlt() {
    this.HttpService.get<any[]>('LocalRepresentativeProvince').subscribe((data) => {
      let userRLTParaDropDown = this.user?.multipleRlt?.map(this.cambiarUserRLTARLTDropDown)
      this.localRepresentativeDrop = [
        ...new Map([...userRLTParaDropDown, ...data].map(objeto => [(this.compararPorValue(objeto)), objeto])).values()
      ];
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  compararPorValue(objeto) {
    return objeto.value;
  }

  cambiarUserRLTARLTDropDown(userRLT) {
    return {
      value: userRLT?.localRepresentativeProvince?.localRepresentativeProvinceId,
      text: `${userRLT?.localRepresentativeProvince?.provinceCode} - ${userRLT?.localRepresentativeProvince?.localRepProvinceInformation}`,
      code: userRLT?.localRepresentativeProvince?.provinceCode
    };
  }

  getListAbogado() {
    this.HttpService.getListLayers().subscribe((data) => {
      this.abogadosDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  // Get All Nationalities
  getNationality() {
    this.HttpService.getNationalities().subscribe((data) => {
      this.nationalityDrop = data;
    });
  }

  getNationalityPersonaFisica() {
    this.HttpService.getNationalities().subscribe((data: any) => {
      this.nacionalidadPersonaFisicaDrop = data;
    });
  }


  // Get All Local Representatives
  getLocalRepresentativeUser(id: number) {
    this.HttpService.getLayerByRepresentativeLocal(id).subscribe((data) => {
      this.localrepresentative = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  // Get All Type of Identifications
  getTypeOfIdentification() {
    this.HttpService.get<any[]>(`TypeOfIdentification`).subscribe((data: any) => {
      this.identificationDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  getTypeWorkDay() {
    this.HttpService.get<any[]>(`Workday`).subscribe((data) => {
      this.typeWorkDayDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  getWorkDay() {
    this.HttpService.get<any[]>(`TypeOfWorkday`).subscribe((data) => {
      this.workDayDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  getPaymentPeriod() {
    this.HttpService.get<any[]>(`PaymentPeriod`).subscribe((data) => {
      this.paymentPeriodDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  getMotivoAsignacionUsario() {
    this.HttpService.get<any[]>(`MotivoAsignacionUsuario`).subscribe((data) => {
      this.motivoAsignacionAbogadoDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  // Get Referido
  getReferido() {
    this.HttpService.get<any[]>(`Referido`).subscribe((data) => {
      this.referidoDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  // Get All Reason of visit
  getReasonOfVisit() {
    this.HttpService.get<any[]>(`ReasonOfVisit`).subscribe((data) => {
      this.reasonOfVisitDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  // Get All Type of applicant
  getTypeOfApplicant() {
    this.HttpService.get<any[]>(`TypeOfApplicant`).subscribe((data) => {
      this.typeApplicantDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  // Get CivilStatus
  getCivilStatus() {
    this.HttpService.get<any[]>(`CivilStatus`).subscribe((data) => {
      this.civilStatusDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  // Get Sex
  getSex() {
    this.HttpService.get<any[]>(`Sex`).subscribe((data) => {
      this.sexDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  getCauseOfContractSuspension() {
    this.HttpService.get<any[]>(`CauseOfContractSuspension`).subscribe(
      (data) => {
        this.causeOfContractSuspensionDrop = data;
      }, (error) => {
        console.error('Ha ocurrido un error: ', error)
      }
    );
  }
  // Get RepresentanteTrabajadorEmpleador
  getRepresentanteTrabajadorEmpleador() {
    this.HttpService.get<any[]>(`RepresentanteTrabajadorEmpleador`).subscribe(
      (data) => {
        this.rTEDrop = data;
      }, (error) => {
        console.error('Ha ocurrido un error: ', error)
      }
    );
  }
  // Get Tipo de correspondecia
  getTypeOfCorrespondence() {
    this.HttpService.get<any[]>(`TypeOfCorrespondence`).subscribe((data) => {
      this.typeOfCorrespondenceDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  // Get Tipo de documento
  getTypeOfDocument() {
    this.HttpService.get<any[]>(`TypeOfDocument`).subscribe((data) => {
      this.typeOfDocumentDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  // Get Fase del proceso
  getProcessPhase() {
    this.HttpService.get<any[]>(`ProcessPhase`).subscribe((data) => {
      this.processPhaseDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }
  // Get Tribunal apoderado
  getProxyCourt() {
    this.HttpService.get<any[]>('JudicialInstance').subscribe((data) => {
      this.proxyCourtDrop = data;
    }, (error) => {
      console.error('Ha ocurrido un error: ', error)
    });
  }

  //#endregion
  // VALIDANDO CAMPO NUMERO DE TELEFONO
  async checkPhoneNumber(_number: number) {
    let inputNumber = (<HTMLInputElement>(
      document.getElementById('solicitantePhoneRequest')
    )).value;

    _number = parseInt(inputNumber);

    if (inputNumber.length > 12) {
      inputNumber = inputNumber.substring(0, 12);

      alert('El numero de telefono es mayor de 10 caracteres');

      return false;
    }
  }

  // VALIDAR LONGUITUD CAMPO EDAD
  maxCheck(event: any) {
    const { value, maxlength } = event.target;

    if (value.length > maxlength) {
      event.target.value = value.slice(0, maxlength);
    }
  }

  // MOSTRAR CAMPO ESPECIFIQUE

  acordeonTrabajador() {
    let checkEmpleador = document.getElementById('checkAbogado') as HTMLInputElement;
    let selectTipoEmpleador = document.getElementById('tipoEmpleador') as HTMLElement;
    let selectTypeApplicant = document.getElementById('typeApplicant') as HTMLSelectElement;

    let acordionEmpresa = document.getElementById('empleador') as HTMLElement;

    let selected = selectTypeApplicant.selectedIndex;
    let option = selectTypeApplicant.options[selected];


    if (parseInt(option.value) == 90 && checkEmpleador.checked) {
      acordionEmpresa.style.display = 'block';
      selectTipoEmpleador.style.display = 'none';

      acordionEmpresa.style.display = 'block';
    }
  }

  async actualizarDatosAsistenciaJudicial() {
    const idAsistenciaDiaria = this.asistenciaId || this.asistenciaDiariaForm.value.idAsistenciaDiaria
    const data = await this.HttpService.getListDailyAttendanceEmployer({
      idAsistenciaDiaria,
    });

    if (data) {
      this.asistenciaJudicial = data[0]
    }
  }

  // VALIDACIÓN DE LA FECHA
  calendar() {
    let inputCal = document.getElementById('inputDate') as HTMLInputElement;
    inputCal.min = new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().slice(0, 10);
    inputCal.max = new Date().toISOString().split('T')[0];
  }

  showIconTo(form: AccordionType, show: boolean) {
    let icono = document.getElementById(`iconoCheck${form}`) as HTMLElement;

    if (show && icono?.classList) {
      icono?.classList.remove('fa-clock-o');
      icono?.classList.add('fa-check-circle-o');
    } else if (icono?.classList) {
      icono?.classList.add('fa-clock-o');
      icono?.classList.remove('fa-check-circle-o');
    }
  }

  showAccordingTo(form: AccordionType, show: boolean) {
    let panelCollapse = document.getElementById(
      `${form}-collapseOne`
    ) as HTMLElement;
    let botonCollapse = document.getElementById(
      `acordion${form}`
    ) as HTMLElement;
    if (show) {
      panelCollapse?.classList.add('show');
      botonCollapse?.classList.remove('collapsed');
    } else {
      panelCollapse?.classList.remove('show');
      botonCollapse?.classList.add('collapsed');
    }
  }
  // VALIDAR FORM EMPRESA FORMALIZADA
  validateempresaF() {
    const rnlField = this.empresaFormalizadaForm.get('rnl');
    rnlField.clearValidators();
    rnlField.updateValueAndValidity();

    if (this.empresaFormalizadaForm.valid) {
      const value = Object.assign({}, this.empresaFormalizadaForm.value);
      delete value.idAsistenciaDiariaEmpleador;

      this.HttpService.postEmpresaFormalizadaForm(value).subscribe(
        (response: any) => {
          this.showLoadingSpinner(true, 'btn-empresaFormalizada');

          const idEmpresa = response?.idEmpresa || this.empresaFormalizadaForm.value?.idEmpresa;
          this.empresaFormalizadaForm.patchValue({ idEmpresa });
          this.formularioEmpresaFormalizadaEmpleador = response;

          const idData = {
            idUsuario: this.user.userId,
            idEmpresa: idEmpresa,
            tipoEmpleador: this.asistenciaJudicialHeaderForm.value.tipoEmpleador,
            IdAsistenciaDiaria: this.asistenciaDiariaForm.value.idAsistenciaDiaria,
            tieneApoderadoSuDemanda: true,
            idAsistenciaDiariaEmpleador: this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador,
            idRepLocalProvinciaCatalog: this.asistenciaDiariaForm.value.idRepLocalProvinciaCatalog,
          };

          this.HttpService.postDailyAttendanceEmployer(idData).subscribe(
            async (response: any) => {
              const idAsistenciaDiariaEmpleador =
                response?.idAsistenciaDiariaEmpleador ||
                this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

              this.asistenciaJudicialHeaderForm.patchValue({ idAsistenciaDiariaEmpleador });
              await this.actualizarDatosAsistenciaJudicial()
              this.showIconTo('EmpresaFormalizada', true);
              this.showAccordingTo('EmpresaFormalizada', false);

              if (this?.TipoSolicitante === 'Empleador') {
                this.showAccordingTo('Referencia', true);
                this.showLoadingSpinner(false, 'btn-empresaFormalizada');
              } else {
                this.showAccordingTo('ElementosDelContratoDeTrabajo', true);
              }
            });
            this.showLoadingSpinner(false, 'btn-empresaFormalizada');
        }, (error) => {
          console.error('Ha ocurrido un error: ', error);
        });
        
      this.showLoadingSpinner(false, 'btn-empresaFormalizada');
    } else {
      this.showLoadingSpinner(false, 'btn-empresaFormalizada');

      this.empresaFormalizadaForm.markAllAsTouched();

      this.toast.error('', 'Hay campos vacios en el formulario, favor revisar.');

      this.showIconTo('EmpresaFormalizada', false);
    }
    this.showLoadingSpinner(false, 'btn-empresaFormalizada');
  }

  // VALIDAR FORM REFERENCIAS PERSONALES
  //#region referenciaPersonalesForm
  private async loadReferencias(idAsistenciaDiariaEmpleador: number) {
    const listReferencePersonalByEmployer = await this.HttpService.getListReferenciaPersonalByEmployerId(idAsistenciaDiariaEmpleador);

    if (listReferencePersonalByEmployer) {
      for (let ref of listReferencePersonalByEmployer) {
        this.formBuilder.group({
          ...ref.referencia,
          idAsistenciaDiariaEmpleadorReferenciaPersonal:
            ref.idAsistenciaDiariaEmpleadorReferenciaPersonal,
        })
      }

      this.showIconTo('Referencia', true);
    }

    this.HttpService.getPersonalReference(idAsistenciaDiariaEmpleador).subscribe((response: any) => {
      this.referenciasPersonales = response;
      
      const personalRef = this.referenciasPersonales.referencia;
    });
  }

  async deleteReferencePersonalByEmployer(idAsistenciaDiariaEmpleador: number) {
    const listReferencePersonalByEmployer =
      await this.HttpService.getListReferenciaPersonalByEmployerId(
        idAsistenciaDiariaEmpleador
      );

    if (listReferencePersonalByEmployer) {
      const personalReferenceList =
        this.referenciaPersonalesForm.value.personalReferenceList;

      const listAsistenciaDiariaEmpleadorReferenciaPersonal =
        listReferencePersonalByEmployer
          .filter(
            (x) =>
              !personalReferenceList.some(
                (ref) =>
                  ref.idAsistenciaDiariaEmpleadorReferenciaPersonal ===
                  x.idAsistenciaDiariaEmpleadorReferenciaPersonal
              )
          )
          .map((x) =>
            this.HttpService.delete(
              x.idAsistenciaDiariaEmpleadorReferenciaPersonal,
              'DailyAttendanceEmployerReferencePersonal'
            ).toPromise()
          );

      const listReference = listReferencePersonalByEmployer
        .filter(
          (x) =>
            !personalReferenceList.some(
              (ref) =>
                ref.idAsistenciaDiariaEmpleadorReferenciaPersonal ===
                x.idAsistenciaDiariaEmpleadorReferenciaPersonal
            )
        )
        .map((x) =>
          this.HttpService.delete(
            x.referencia.idReferencia,
            'Reference'
          ).toPromise()
        );

      await Promise.all(listAsistenciaDiariaEmpleadorReferenciaPersonal);
      await Promise.all(listReference);
    }
  }

  async savePersonalReferences(idAsistenciaDiariaEmpleador: number) {
    const referenciaForm = this.referenciaPersonalesForm.value;
    
    if (this.referenciaPersonalesForm.controls.nombre.value == '' && this.referenciaPersonalesForm.controls.apellido.value == '') {
      this.toast.error('No puede guardar un formulario vacio', 'El formulario esta vacio');
      this.referenciaPersonalesForm.reset()
      
      return;
    }

    const response: any = await this.HttpService.postReferenceForm(referenciaForm).toPromise();

    this.HttpService.postEmployerReferenceForm({
      idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador,
      idReferencia: response?.idReferencia || referenciaForm.idReferencia,
      idAsistenciaDiariaEmpleadorReferenciaPersonal:
        response?.idAsistenciaDiariaEmpleadorReferenciaPersonal ||
        referenciaForm?.idAsistenciaDiariaEmpleadorReferenciaPersonal,
    }).subscribe(
      () => this.loadReferencias(idAsistenciaDiariaEmpleador),
      (error) => console.log(error)
    );

    this.referenciaPersonalesForm.reset()
  }

  async saveReferencia() {
    const idAsistenciaDiariaEmpleador = this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

    if (this.referenciaPersonalesForm.controls.nombre.value == '' && this.referenciaPersonalesForm.controls.apellido.value == '') {
      this.toast.error('No puede guardar un formulario vacio', 'El formulario esta vacio');
      this.referenciaPersonalesForm.reset();

      return;
    }

    if (this.referenciaPersonalesForm.valid) {
      await this.savePersonalReferences(idAsistenciaDiariaEmpleador);

      this.referenciaPersonalesForm.reset()

      this.showIconTo('Referencia', true);
      this.showAccordingTo('Referencia', false);

      if (this.TipoSolicitante === 'Empleador') {
        this.showAccordingTo('SocioEconomica', true);
      } else {
        this.showAccordingTo('ElementosDelSalario', true);
      }
    } else {
      return;
    }
  }

  //#endregion

  //#region testigosForm
  private async loadTestigos(idAsistenciaDiariaEmpleador: number) {
    const listWitnessByEmployer = await this.HttpService.getListTestigosByEmployerId(idAsistenciaDiariaEmpleador);

    if (listWitnessByEmployer) {
      for (let ref of listWitnessByEmployer) {
        this.formBuilder.group({
          ...ref.referencia,
          idAsistenciaDiariaEmpleadorReferenciaTestigo: ref.idAsistenciaDiariaEmpleadorReferenciaTestigo
        })
      }

      this.showIconTo('Testigos', true);
    }

    this.HttpService.getWitness(idAsistenciaDiariaEmpleador).subscribe((response: any) => {
      this.referenciaTestigos = response;
    });
  }

  async deleteTestigosByEmployer(idAsistenciaDiariaEmpleador: number) {
    const listReferencePersonalByEmployer =
      await this.HttpService.getListTestigosByEmployerId(
        idAsistenciaDiariaEmpleador
      );
    if (listReferencePersonalByEmployer) {
      const witnessList = this.testigosForm.value.witnessList;
      const listAsistenciaDiariaEmpleadorReferenciaPersonal =
        listReferencePersonalByEmployer
          .filter(
            (x) =>
              !witnessList.some(
                (w) =>
                  w.idAsistenciaDiariaEmpleadorReferenciaTestigo ===
                  x.idAsistenciaDiariaEmpleadorReferenciaTestigo
              )
          )
          .map((x) =>
            this.HttpService.delete(
              x.idAsistenciaDiariaEmpleadorReferenciaTestigo,
              'DailyAttendanceEmployerReferenceWitness'
            ).toPromise()
          );

      const listReference = listReferencePersonalByEmployer
        .filter(
          (x) =>
            !witnessList.some(
              (w) =>
                w.idAsistenciaDiariaEmpleadorReferenciaTestigo ===
                x.idAsistenciaDiariaEmpleadorReferenciaTestigo
            )
        )
        .map((x) =>
          this.HttpService.delete(
            x.referencia.idReferencia,
            'Reference'
          ).toPromise()
        );

      await Promise.all(listAsistenciaDiariaEmpleadorReferenciaPersonal);
      await Promise.all(listReference);
    }
  }

  async postReferenceAndWitnessWitnessForm(element, idAsistenciaDiariaEmpleador: number) {
    const formuarioTestigo = this.testigosForm.value;

    if (this.testigosForm.controls.nombre.value == '' && this.testigosForm.controls.apellido.value == '') {
      this.toast.error('No puede guardar un formulario vacio', 'El formulario esta vacio');
      this.referenciaPersonalesForm.reset()
      
      return;
    }

    console.log(formuarioTestigo);

    const response: any = await this.HttpService.postReferenceForm(formuarioTestigo).toPromise();
    
    if (this.testigosForm.invalid) {
      return;
    }

    this.HttpService.postEmployerReferenceWitnessForm({
      idAsistenciaDiariaEmpleadorReferenciaTestigo: element.idAsistenciaDiariaEmpleadorReferenciaTestigo,
      idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador,
      idReferencia: response?.idReferencia || element.idReferencia,
    }).subscribe(
      (response) => this.loadTestigos(idAsistenciaDiariaEmpleador),
      (error) => console.log(error)
    );

    this.testigosForm.reset()
  }

  async saveTestigos() {
    const idAsistenciaDiariaEmpleador = this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

    if (this.testigosForm.controls.nombre.value == '' && this.testigosForm.controls.apellido.value == '') {
      this.toast.error('No puede guardar un formulario vacio', 'El formulario esta vacio');
      this.referenciaPersonalesForm.reset()

      return;
    }

    if (this.testigosForm.valid) {
      this.showLoadingSpinner(true, "btn-testigos");

      this.postReferenceAndWitnessWitnessForm(this.testigosForm.value, idAsistenciaDiariaEmpleador);
      
      this.showIconTo('Testigos', true);
      this.showAccordingTo('Testigos', false);
      this.showAccordingTo('Documentos', true);
      this.showLoadingSpinner(false, "btn-testigos");
    } else {
      this.testigosForm.markAllAsTouched();
      this.showIconTo('SocioEconomica', false);

      return;
    }
  }

  async deleteDailyAttendanceNotificationFiles(x) {
    const listDailyAttendanceEmployerNotificationFile =
      await this.HttpService.getWithQuery(
        `DailyAttendanceEmployerNotificationFile`,
        {
          idAsistenciaDiariaEmpleadorNotificacion:
            x.idAsistenciaDiariaEmpleadorNotificacion,
        }
      )
        .toPromise()
        .catch((_x) => null);
    if (listDailyAttendanceEmployerNotificationFile) {
      const deletePromises = listDailyAttendanceEmployerNotificationFile.map(
        (xNF) => {
          // Check if the current file is not in the fundamentoDefensaFilesItem array
          if (
            this.fundamentoDefensaFilesItem &&
            !(this.fundamentoDefensaFilesItem as any).some(
              (item) => item.idArchivo === xNF?.archivo?.idArchivo
            )
          ) {
            const deleteFilePromise = xNF?.archivo?.idArchivo
              ? this.HttpService.deleteFile(xNF?.archivo?.idArchivo).toPromise()
              : Promise.resolve();
            const deleteNotifFilePromise =
              xNF?.idAsistenciaDiariaEmpleadorNotificacionArchivo
                ? this.HttpService.delete(
                  xNF?.idAsistenciaDiariaEmpleadorNotificacionArchivo,
                  'DailyAttendanceEmployerNotificationFile'
                ).toPromise()
                : Promise.resolve();
            return Promise.all([deleteFilePromise, deleteNotifFilePromise]);
          } else {
            return Promise.resolve();
          }
        }
      );
      await Promise.all(deletePromises);
    }
  }

  async uploadFilesAndPostDailyAttendanceEmployerNotification(
    idAsistenciaDiariaEmpleador
  ) {
    let listadoFile: any = await this.uploadFileList(
      this.fundamentoDefensaFilesItem
    );
    const formObject = this.fundamentoDefensaForm.value;
    this.HttpService.postDailyAttendanceEmployerNotification({
      ...formObject,
      idAsistenciaDiariaEmpleador,
    }).subscribe(
      (response: any) => {
        this.handlePostDailyAttendanceEmployerNotificationSuccess(
          response,
          listadoFile
        );
      },
      (error) => console.log(error)
    );
  }

  handlePostDailyAttendanceEmployerNotificationSuccess(response, listadoFile) {
    const idAsistenciaDiariaEmpleadorNotificacion =
      response?.idAsistenciaDiariaEmpleadorNotificacion ||
      this.fundamentoDefensaForm.value?.idAsistenciaDiariaEmpleadorNotificacion;
    this.fundamentoDefensaForm.patchValue({
      idAsistenciaDiariaEmpleadorNotificacion,
    });

    if (listadoFile) {
      listadoFile.ids.forEach((element) => {
        element.idArchivo,
          this.HttpService.postDailyAttendanceEmployerNotificationFile({
            idArchivo: element.idArchivo,
            idAsistenciaDiariaEmpleadorNotificacion,
          }).toPromise();
      });
    }
    this.showIconTo('FundamentoDefenza', true);
    this.showAccordingTo('FundamentoDefenza', false);
    this.showAccordingTo('Testigos', true);
  }

  async saveFundamentoDefensaForm() {
    if (this.fundamentoDefensaForm.valid) {
      this.showLoadingSpinner(true, 'btn-fundamentoDefensa');

      const idAsistenciaDiariaEmpleador =
        this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;
      const dailyAttendanceEmployerNotifications =
        await this.HttpService.getDailyAttendanceEmployerNotifications(
          idAsistenciaDiariaEmpleador
        );

      if (dailyAttendanceEmployerNotifications) {
        const slinge = dailyAttendanceEmployerNotifications[0];
        await this.deleteDailyAttendanceNotificationFiles(slinge);
      }
      await this.uploadFilesAndPostDailyAttendanceEmployerNotification(
        idAsistenciaDiariaEmpleador
      );

      this.showLoadingSpinner(false, 'btn-fundamentoDefensa');
    } else {
      console.log(this.fundamentoDefensaForm.errors);
    }

    this.showLoadingSpinner(false, 'btn-fundamentoDefensa');
  }

  private async loadFundamentoDefensaForm(idAsistenciaDiariaEmpleador: number) {
    const fundamentoDefensa = await this.HttpService.getWithQuery<{
      idAsistenciaDiariaEmpleador: number;
    }>('DailyAttendanceEmployerNotification', {
      idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador,
    }).toPromise().catch((x) => null);

    if (fundamentoDefensa) {
      const _fundamentoDefensa = fundamentoDefensa[0];

      try {
        this.fundamentoDefensaForm.setValue({
          idAsistenciaDiariaEmpleadorNotificacion:
            _fundamentoDefensa?.idAsistenciaDiariaEmpleadorNotificacion || '',
          idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador || '',
          idTribunalApoderado: _fundamentoDefensa?.tribunalApoderado?.id || '',
          idFaseProceso: _fundamentoDefensa?.faseProceso?.id || '',
          idMotivoDemanda: _fundamentoDefensa?.motivoDemanda?.id || '',
          tieneNotificacionActoDeAlguacil:
            _fundamentoDefensa?.tieneNotificacionActoDeAlguacil || '',
          nombreDemandante: _fundamentoDefensa?.nombreDemandante || '',
          descripcionDocumentoNotificado:
            _fundamentoDefensa?.descripcionDocumentoNotificado || '',
        });
        this.showIconTo('FundamentoDefenza', true);
        this.mostrarAdjuntar(
          _fundamentoDefensa?.tieneNotificacionActoDeAlguacil || ''
        );

        const listNotificationFile = await this.HttpService.getWithQuery(
          `DailyAttendanceEmployerNotificationFile`,
          {
            idAsistenciaDiariaEmpleadorNotificacion:
              _fundamentoDefensa?.idAsistenciaDiariaEmpleadorNotificacion,
          }
        )
          .toPromise()
          .catch((_x) => null);
        const fundamentoDefensaFilesItem: any = this.fundamentoDefensaFilesItem;
        if (listNotificationFile) {
          for (let ref of listNotificationFile) {
            if (ref.archivo) {
              fundamentoDefensaFilesItem.push({
                name: ref.archivo?.nombreArchivo,
                idArchivo: ref.archivo?.idArchivo,
              });
            }
          }
          this.showIconTo('Referencia', true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  //#endregion

  //  VALIDAR ASIGNACION ABOGADO
  async validarAsignarAbogado() {
    const idAsistenciaDiariaEmpleador = this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

    if (this.asignarAbogadoForm.valid && this.asignarAbogadoForm.hasError('abogadosIgualesEnAsignarYReasignar') == false) {
      const fechaAsignacion = this.asignarAbogadoForm.get('fechaAsignacion').value;
      const fechaRegistro = this.asignarAbogadoForm.get('fechaRegistro').value;
      const idMotivoAsignacionUsuario = this.asignarAbogadoForm.get('idMotivoAsignacionUsuario').value;

      const idAbogado = this.asignarAbogadoForm.get('idAbogado').value;
      const idAbogadoAlterno = this.asignarAbogadoForm.get('idAbogadoAlterno').value;
      const idAbogadoAlterno1 = this.asignarAbogadoForm.get('idAbogadoAlternoOne').value;

      const idAsistenciaDiaria = this.asistenciaDiariaForm.get('idAsistenciaDiaria').value;
      
      this.showLoadingSpinner(true, 'btn-asignacioAbogado');

      try {
        await this.HttpService.postDailyAttendanceEmployer(
          {
            idAsistenciaDiariaEmpleador,
            fechaAsignacion,
            fechaRegistro
          }).toPromise()

        await this.HttpService.postDailyAttendanceForm(
          {
            idAsistenciaDiaria,
            idAbogado,
            idAbogadoAlterno,
            idAbogadoAlterno1,
            idMotivoAsignacionUsuario
          }).toPromise()

        this.showIconTo('AsignarAbogado', true);
        this.showAccordingTo('AsignarAbogado', false);

      } catch (error) {
        this.toast.error(
          'favor inténtelo mas tarde!',
          'La aplicación no esta disponible'
        );
      }

      this.showLoadingSpinner(false, 'btn-asignacioAbogado');
    } else {
      this.asignarAbogadoForm.markAllAsTouched();
      this.showIconTo('AsignarAbogado', false);
    }
  }

  // VALIDAR FORM NO EMPRESA FORMALIZADA
  clearForm() {
    if (this.asistenciaJudicialHeaderForm?.value?.idAsistenciaDiariaEmpleador) {
      return;
    }

    this.asistenciaDiariaForm.reset();
    this.router.navigate(['/Casos/historial']);
  }

  openClose() {
    let addServiceBtn = document.getElementById(
      'servicioJudicialCollapse'
    ) as HTMLElement;
    const bsCollapse = () => new Collapse(addServiceBtn, { toggle: false });
  }

  showModal() {
    const myModal = document.getElementById(
      'avisoCambioTipoPer'
    ) as HTMLElement;
    const modal = new Modal(myModal);

    modal.show();
  }

  // MOSTRAR DATOS ADJUNTOS
  mostrarAdjuntar(value) {
    let adjuntarForm = document.getElementById('adjuntaDatos') as HTMLElement;

    if (value === true) {
      adjuntarForm.style.display = 'block';
      (
        document.getElementById('fundamentoDefensaForm') as HTMLFormElement
      ).elements['siMostrar'].checked = true;
      (
        document.getElementById('fundamentoDefensaForm') as HTMLFormElement
      ).elements['noMostrar'].checked = false;
    } else if (value === false) {
      adjuntarForm.style.display = 'none';
      (
        document.getElementById('fundamentoDefensaForm') as HTMLFormElement
      ).elements['noMostrar'].checked = true;
      (
        document.getElementById('fundamentoDefensaForm') as HTMLFormElement
      ).elements['siMostrar'].checked = false;
    }
    setTimeout(() => {
      this.fundamentoDefensaForm.patchValue({
        tieneNotificacionActoDeAlguacil: value,
      });
    }, 1000);
  }

  agregarServicio() {
    //Validate if user dosent have a document type
    this.validateDocumentType();

    this.asistenciaDiariaForm.enable();

    this.newSelectDisabled = false;

    this.validateExistAsistenciaJudicial = !this.validateExistAsistenciaJudicial;
    
    const collapseElement = document.getElementById('servicioJudicialCollapse');
    const hasClass = collapseElement.classList.contains('show');
    
    if (hasClass) {
      collapseElement.classList.remove('show');
      
      this.asistenciaDiariaForm.disable();

      this.newSelectDisabled = true;
    } else {
      if (this.asistenciaDiariaForm.valid) {
        if (this.FilledNewDropDowns()) {
          this.guardarAsistenciaDiaria(false);
          
          collapseElement.classList.add('show');
          
          setTimeout(this.gotToBottom, 300);
        }
      } else {
        this.asistenciaDiariaForm.markAllAsTouched();
      }
    }
  }

  FilledNewDropDowns(): boolean {
    return (
      this.asistenciaDiariaForm.get('idNacionalidadDropDown').value != null &&
      this.asistenciaDiariaForm.get('idRepLocalProvinciaCatalogDropDown').value != null
    );
  }

  async guardarOrdenesSicitForm() {
    const Spinner = (mostrar: boolean) => this.showLoadingSpinner(mostrar, "btn-ordenesSicit");
    
    Spinner(true)
    
    const idAsistenciaDiariaEmpleador = this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;
    
    if (this.ordenesSicitForm.valid && idAsistenciaDiariaEmpleador > 0) {   
      this.ordenesSicitForm.patchValue({idAsistenciaDiariaEmpleador})
      this.HttpService.postAsistenciaJudicialOrdenServicioSicit({...this.ordenesSicitForm.value}).subscribe(
          (response: any) => {
            this.ordenesSicitForm.patchValue({idAsistenciaJudicialOrdenServicioSicit: response?.idAsistenciaJudicialOrdenServicioSicit})
            this.showIconTo('OrdenesSicit', true);
            this.showAccordingTo('OrdenesSicit', false);
            Spinner(false)
          },
          (error) => 
          {
            console.log(error)  
            Spinner(false)          
          }
        );
    } else {
      Spinner(false)
    }
    
  }

  async validateEmpleadorObservacion() {
    const idAsistenciaDiariaEmpleador =
      this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;
    
      if (this.empleadorObservacionForm.valid) {
      this.HttpService.postDailyAttendanceEmployer(
        {
          idAsistenciaDiariaEmpleador,
          observacion: this.empleadorObservacionForm.value.observacion,
        }).subscribe(
          (response: any) => {
            this.showIconTo('Observaciones', true);
            this.showAccordingTo('Observaciones', false);
            this.showAccordingTo('AsignarAbogado', true);
          },
          (error) => console.log(error)
        );
    } else {
      console.log(this.empleadorObservacionForm.errors);
    }
  }
  //#region empleadorDocumentoForm
  onFileSelectEmpleadorDocumento(event, index) {
    let files = event.target.files;
    let fileList: File[] = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i]);
    }
    this.empleadorDocumentoFilesItem[index] = fileList;
  }

  deleteFileEmpleadorDocumento(index, fileIndex) {
    this.empleadorDocumentoFilesItem[index].splice(fileIndex, 1);
  }

  async loadDocumentos(idAsistenciaDiariaEmpleador: number) {
    // Obtén los documentos existentes del servidor
    const existingDocuments =
      await this.HttpService.getListEmployerDocumentsByEmployerId(
        idAsistenciaDiariaEmpleador
      );

    // Vacía el FormArray
    const documentosFormArray = this.empleadorDocumentoForm.get(
      'documentos'
    ) as FormArray;

    while (documentosFormArray.length !== 0) {
      documentosFormArray.removeAt(0);
    }

    this.empleadorDocumentoFilesItem = [];
    // Rellena el FormArray con los documentos existentes
    if (existingDocuments) {
      existingDocuments.forEach(async (doc: any) => {
        const listDocument =
          await this.HttpService.getListEmployerDocumentsFileByEmployerId(
            doc?.idAsistenciaDiariaEmpleadorDocumento
          );

        const listFiles = listDocument
          ? listDocument.map((x) => ({
            idArchivo: x.archivo.idArchivo,
            name: x.archivo?.nombreArchivo,
            idAsistenciaDiariaEmpleadorDocumentoArchivo:
              x.idAsistenciaDiariaEmpleadorDocumentoArchivo,
          }))
          : [];

        const group = this.formBuilder.group({
          idAsistenciaDiariaEmpleadorDocumento: [
            doc.idAsistenciaDiariaEmpleadorDocumento,
          ],
          idTipoDocumento: [doc.tipoDocumento.id],
          nombre: [doc.tipoDocumento.descripcion],
        });

        this.empleadorDocumentoFilesItem.push(listFiles);
        documentosFormArray.push(group);
      });
      this.showIconTo('Documentos', true);
    }
  }

  get documentos() {
    return this.empleadorDocumentoForm.get('documentos') as FormArray;
  }

  onTipoDocumentoChange(event) {
    const selectedDocument = this.typeOfDocumentDrop.find(
      (doc) => doc.value === +event.target.value
    );

    this.documentos.push(
      this.formBuilder.group({
        idTipoDocumento: [selectedDocument.value],
        nombre: [selectedDocument.text],
        // empleadorDocumentoFile: [''],
      })
    );
  }

  isMultiple(documentName: string): boolean {
    const multipleDocs = ['Volantes de cheques', 'Fotocopias de cheques', 'Sobres de pago'];
    return multipleDocs.some(doc => doc.toLowerCase() === documentName.toLowerCase());
  }

  deleteDocumento(index: number) {
    this.documentos.removeAt(index);
  }

  async deleteExistingDocumentsAndFiles(idAsistenciaDiariaEmpleador: number) {
    const existingDocuments =
      await this.HttpService.getListEmployerDocumentsByEmployerId(
        idAsistenciaDiariaEmpleador
      );
    if (existingDocuments && existingDocuments.length > 0) {
      for (const [index, doc] of existingDocuments.entries()) {
        const _doc: DailyAttendanceEmployerDocument = doc;
        const attachedFiles =
          await this.HttpService.getListEmployerDocumentsFileByEmployerId(
            _doc.idAsistenciaDiariaEmpleadorDocumento
          );
        const empleadorDocumentoFilesItem =
          this.empleadorDocumentoFilesItem[index];
        if (attachedFiles && empleadorDocumentoFilesItem) {
          for (const file of attachedFiles) {
            const isFileInList = empleadorDocumentoFilesItem.some(
              (item) =>
                item.idAsistenciaDiariaEmpleadorDocumentoArchivo ==
                file?.idAsistenciaDiariaEmpleadorDocumentoArchivo
            );
            // Si no se encuentra el archivo en la lista, se elimina
            if (!isFileInList) {
              await this.HttpService.delete(file.archivo.idArchivo, 'File')
                .toPromise()
                .catch((x) => console.error(x))
                .then((_x) => console.log('Delete File'));

              await this.HttpService.delete(
                file.idAsistenciaDiariaEmpleadorDocumentoArchivo,
                'DailyAttendanceEmployerDocumentFile'
              )
                .toPromise()
                .catch((x) => console.error(x))
                .then((_x) =>
                  console.log('Delete DailyAttendanceEmployerDocumentFile')
                );
            }
          }
        }

        // Check if this document exists in the form data
        const documentos = this.empleadorDocumentoForm.value.documentos;

        const isDocInFormData = documentos.some(
          (item: any) =>
            item.idAsistenciaDiariaEmpleadorDocumento ==
            _doc.idAsistenciaDiariaEmpleadorDocumento
        );
        // Si no se encuentra el documento en los datos del formulario, se elimina
        if (!isDocInFormData) {
          await this.HttpService.delete(
            _doc.idAsistenciaDiariaEmpleadorDocumento,
            'DailyAttendanceEmployerDocument'
          )
            .toPromise()
            .then((_x) =>
              console.log('DailyAttendanceEmployerDocument', 'delete')
            )
            .catch((x) => console.error(x));
        }
      }
    }
  }

  async uploadNewDocumentsAndFiles(
    idAsistenciaDiariaEmpleador: number,
    documentos: any,
    empleadorDocumentoFilesItem: any[]
  ) {
    if (documentos && documentos.length > 0) {
      const postDocuments: any = await documentos.map(async (data, index) => {
        const idAsistenciaDiariaEmpleadorDocumento =
          data?.idAsistenciaDiariaEmpleadorDocumento;

        const response: any = await this.HttpService.postEmployerDocument({
          idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador,
          idTipoDocumento: data.idTipoDocumento,
          idAsistenciaDiariaEmpleadorDocumento,
        }).toPromise();

        const _idAsistenciaDiariaEmpleadorDocumento =
          response?.idAsistenciaDiariaEmpleadorDocumento ||
          idAsistenciaDiariaEmpleadorDocumento;
        const files = empleadorDocumentoFilesItem[index];
        let fileIds = [];
        if (files && files.length > 0) {
          const listFiles = await this.uploadFileList(files);
          fileIds = listFiles
            ? listFiles.ids.map((file) => file.idArchivo)
            : files.map((file) => file.idArchivo);
        }

        const postFileDocuments = fileIds.map((idArchivo, index) => {
          const p = files[index];
          return this.HttpService.postEmployerDocumentFile({
            idArchivo,
            idAsistenciaDiariaEmpleadorDocumento:
              _idAsistenciaDiariaEmpleadorDocumento,
            idAsistenciaDiariaEmpleadorDocumentoArchivo:
              p?.idAsistenciaDiariaEmpleadorDocumentoArchivo,
          }).toPromise();
        });

        const fileDocumentsResult = await Promise.all(postFileDocuments);
        return { document: response, fileDocuments: fileDocumentsResult };
      });
      await Promise.all(postDocuments);
    }
  }

  async saveDocumentos() {
    const idAsistenciaDiariaEmpleador =
      this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;
    const documentos = this.empleadorDocumentoForm.value.documentos;
    await this.deleteExistingDocumentsAndFiles(idAsistenciaDiariaEmpleador);
    await this.uploadNewDocumentsAndFiles(
      idAsistenciaDiariaEmpleador,
      documentos,
      this.empleadorDocumentoFilesItem
    );
    this.showIconTo('Documentos', true);
    this.showAccordingTo('Documentos', false);
    this.showAccordingTo('Correspondencia', true);
    this.loadDocumentos(idAsistenciaDiariaEmpleador);
  }

  //#endregion

  validarSituacionEconomica() {
    const idEmpresa = this.empresaFormalizadaForm.value.idEmpresa;

    this.situacionEconomicaForm.addControl(
      'idEmpresa',
      new FormControl(idEmpresa, Validators.required)
    );

    if (this.situacionEconomicaForm.valid) {
      this.showLoadingSpinner(true, 'btn-situacion-economica');

      this.HttpService.postCompanyEconomicSocial(
        this.situacionEconomicaForm.value
      ).subscribe(
        (response: any) => {
          const idEmpresaSituacionEconomica =
            response?.idEmpresaSituacionEconomica ||
            this.situacionEconomicaForm.value?.idEmpresaSituacionEconomica;
          this.situacionEconomicaForm.patchValue({
            idEmpresaSituacionEconomica,
          });
          this.showIconTo('SocioEconomica', true);
          this.showAccordingTo('SocioEconomica', false);
          this.showAccordingTo('FundamentoDefenza', true);
          this.showLoadingSpinner(false, 'btn-situacion-economica');

        },
        (error) => {
          console.log(error)
          this.showLoadingSpinner(false, 'btn-situacion-economica');
        }
      );
    } else {
      this.empresaFormalizadaForm.markAllAsTouched();
      this.showIconTo('SocioEconomica', false);
    }

  }

  onFileSelect(event): void {
    Array.from(event.target.files).forEach((file: File) => {
      this.fundamentoDefensaFilesItem.push(file);
    });
  }

  deleteFile(index: number) {
    this.fundamentoDefensaFilesItem.splice(index, 1);
  }
  //#region  empleadorCorrespondenciaForm
  selectedCorrespondence: string = '';

  async loadCorrespondencia(idAsistenciaDiariaEmpleador: number) {
    const data: AsistenciaDiariaEmpleadorResponse =
      await this.HttpService.getListDailyAttendanceEmployerById(
        idAsistenciaDiariaEmpleador
      );
    if (data) {
      if (data?.tipoCorrespondencia?.id) {
        this.empleadorCorrespondenciaForm.setValue({
          idTipoCorrespondencia: data?.tipoCorrespondencia?.id,
          CodigoCorrespondencia: ''
        });
        this.onCorrespondenceSelected();
        const listDailyAttendanceEmployerFile =
          await this.HttpService.getListDailyAttendanceEmployerFileByEmployerId(
            idAsistenciaDiariaEmpleador
          );
        const empleadorCorrespondenciaFilesItem: any = [];

        if (listDailyAttendanceEmployerFile) {
          for (let ref of listDailyAttendanceEmployerFile) {
            if (ref.archivo) {
              empleadorCorrespondenciaFilesItem.push({
                idAsistenciaDiariaEmpleadorArchivo:
                  ref.idAsistenciaDiariaEmpleadorArchivo,
                name: ref.archivo?.nombreArchivo,
                idArchivo: ref.archivo?.idArchivo,
              });
            }
          }
          this.empleadorCorrespondenciaFilesItem =
            empleadorCorrespondenciaFilesItem;
        }
        this.showIconTo('Correspondencia', true);
      }
    }
  }
  onCorrespondenceSelected(): void {
    const selectedValue = this.empleadorCorrespondenciaForm.get(
      'idTipoCorrespondencia'
    )?.value;
    const selectedCorrespondence = this.typeOfCorrespondenceDrop.find(
      (tc) => tc.value == selectedValue
    );
    this.selectedCorrespondence = selectedCorrespondence
      ? `${selectedCorrespondence.text} ${this.empleadorCorrespondenciaForm?.value?.CodigoCorrespondencia}`
      : '';
  }

  onFileSelectEmpleadorCorrespondencia(event): void {
    Array.from(event.target.files).forEach((file: File) => {
      this.empleadorCorrespondenciaFilesItem.push(file);
    });
    this.empleadorCorrespondenciaFilesItem?.forEach((file: File) => {
      this.resultMailNumberSiscord = this.resultMailNumberSiscord?.filter(fileSiscord => fileSiscord.name === 'No Encontrado' || fileSiscord.name !== file.name);
    })
  }
  deleteFileEmpleadorCorrespondencia(index: number) {
    this.empleadorCorrespondenciaFilesItem?.splice(index, 1);

  }

  async deleteExistFilesCorrespondencia(
    idAsistenciaDiariaEmpleador: string | number
  ) {
    const listDailyAttendanceEmployerFile =
      await this.HttpService.getListDailyAttendanceEmployerFileByEmployerId(
        idAsistenciaDiariaEmpleador
      );
    if (listDailyAttendanceEmployerFile) {
      const deletePromises = listDailyAttendanceEmployerFile.map((xNF) => {
        // Check if the current file is not in the fundamentoDefensaFilesItem array
        if (
          this.empleadorCorrespondenciaFilesItem &&
          !(this.empleadorCorrespondenciaFilesItem as any).some(
            (item) => item.idArchivo === xNF?.archivo?.idArchivo
          )
        ) {
          const deleteFilePromise = xNF?.archivo?.idArchivo
            ? this.HttpService.deleteFile(xNF?.archivo?.idArchivo).toPromise()
            : Promise.resolve();
          const deleteDailyAttendanceEmployerFile =
            xNF.idAsistenciaDiariaEmpleadorArchivo
              ? this.HttpService.delete(
                xNF?.idAsistenciaDiariaEmpleadorArchivo,
                'DailyAttendanceEmployerFile'
              ).toPromise()
              : Promise.resolve();
          return Promise.all([
            deleteFilePromise,
            deleteDailyAttendanceEmployerFile,
          ]);
        } else {
          return Promise.resolve(); // Return resolved promise for the files we don't want to delete
        }
      });
      await Promise.all(deletePromises);
    }
  }

  async uploadFilesAndPostDailyAttendanceEmployerFile(idAsistenciaDiariaEmpleador) {
    let listadoFile: any = await this.uploadFileList(
      this.empleadorCorrespondenciaFilesItem
    );

    if (listadoFile) {
      listadoFile.ids.forEach((element) => {
        this.HttpService.postDailyAttendanceEmployeFile({
          idArchivo: element.idArchivo,
          idAsistenciaDiariaEmpleador,
        }).toPromise();
      });
    }
  }

  async validateEmpleadorCorrespondencia() {
    const idAsistenciaDiariaEmpleador =
      this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

    if (this.empleadorCorrespondenciaForm.valid) {
      this.showLoadingSpinner(true, "btn-correspondencia");

      await this.deleteExistFilesCorrespondencia(idAsistenciaDiariaEmpleador);

      this.HttpService.postDailyAttendanceEmployer({
        idAsistenciaDiariaEmpleador,
        idTipoCorrespondencia:
          this.empleadorCorrespondenciaForm.value.idTipoCorrespondencia,
        codigoCorrespondencia:
          this.empleadorCorrespondenciaForm.value.CodigoCorrespondencia,
        // CodigoCorrespondencia: 
      }).subscribe(
        () => {
          this.uploadFilesAndPostDailyAttendanceEmployerFile(
            idAsistenciaDiariaEmpleador
          );
          this.loadCorrespondencia(idAsistenciaDiariaEmpleador);

          this.showIconTo('Correspondencia', true);
          this.showAccordingTo('Correspondencia', false);
          this.showAccordingTo('Observaciones', true);
          this.showLoadingSpinner(false, "btn-correspondencia");

        },
        (error) => {
          console.log(error)
          this.showLoadingSpinner(false, "btn-correspondencia");
        }
      );
    } else {
      console.log(this.empleadorCorrespondenciaForm.errors);
      this.showIconTo('Correspondencia', false);
    }
  }
  selectedFileAsistenciaJudicialFirmada: File = null;
  onFileSelectAsistenciaJudicialFirmada(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFileAsistenciaJudicialFirmada = event.target.files[0];
      this.asistenciaJudicialFirmadaForm.get('idArchivoDocumentoFirmado').setValue(this.selectedFileAsistenciaJudicialFirmada);
    }
  }
  deleteFileAsistenciaJudicialFirmada(): void {
    this.selectedFileAsistenciaJudicialFirmada = null;
    this.asistenciaJudicialFirmadaForm.get('idArchivoDocumentoFirmado').reset();
  }
  async validateAsistenciaJudicialFirmada() {

    const idAsistenciaDiariaEmpleador = this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

    if (this.asistenciaJudicialFirmadaForm.valid) {

      let data = {}
      const comentarioDocumentoFirmado: any = this.asistenciaJudicialFirmadaForm.value?.comentarioDocumentoFirmado || ''
      if (this.asistenciaJudicialFirmadaForm.get('idArchivoDocumentoFirmado').value) {
        const idArchivo: any = await this.uploadFileAndGetId(this.asistenciaJudicialFirmadaForm.get('idArchivoDocumentoFirmado').value)
        data = {
          idArchivoDocumentoFirmado: idArchivo,
          comentarioDocumentoFirmado,
          idAsistenciaDiariaEmpleador
        }
      } else if (!this.selectedFileAsistenciaJudicialFirmada) {
        data = {
          idArchivoDocumentoFirmado: null,
          comentarioDocumentoFirmado,
          idAsistenciaDiariaEmpleador
        }
      } else {
        data = {

          comentarioDocumentoFirmado,
          idAsistenciaDiariaEmpleador
        }
      }

      this.HttpService.postDailyAttendanceEmployer(data)
        .subscribe((blob: any) => {
          this.showIconTo('asistenciaJudicialFirmada', true);
          this.showAccordingTo('asistenciaJudicialFirmada', false);
        }, error => {
          this.toast.error('favor inténtelo mas tarde!', 'Error al descargar el archivo PDF')
        });
    } else {
      this.asistenciaJudicialFirmadaForm.markAllAsTouched();
    }
  }
  uploadFileAndGetId(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.HttpService.postFile(formData).toPromise().then((response) => {
      return response.idArchivo
    })
  }

  //#endregion
  validateContratoTrabajo() {
    if (this.contratoTrabajoForm.valid) {
      const data = this.contratoTrabajoForm.value;
      data.idAsistenciaDiariaEmpleador =
        this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;
      this.HttpService.postDailyAttendanceEmployerWorkContract(data).subscribe(
        (response: any) => {
          const idAsistenciaDiariaEmpleadorContratoLaboral =
            response?.idAsistenciaDiariaEmpleadorContratoLaboral ||
            this.asistenciaJudicialHeaderForm.value
              .idAsistenciaDiariaEmpleadorContratoLaboral;
          this.contratoTrabajoForm.patchValue({
            idAsistenciaDiariaEmpleadorContratoLaboral,
          });
          this.showIconTo('ElementosDelContratoDeTrabajo', true);
          this.showAccordingTo('ElementosDelContratoDeTrabajo', false);
          this.showAccordingTo('Referencia', true);
        }
      );
    } else {
      console.log(
        this.contratoTrabajoForm.value,
        this.contratoTrabajoForm.errors
      );
    }
  }

  validateCausaFinContrato() {
    if (this.causasSuspencionContratoForm.valid) {

      const data = this.causasSuspencionContratoForm.value;
      data.idAsistenciaDiariaEmpleador = this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;
      this.HttpService.postCausasDeLaterminacionDelContrato(data).subscribe((response: any) => {
        if (response) {
          // this.causasSuspencionContratoForm.patchValue({ idAsistenciaJudicialCausaTerminacionContrato: response?.idAsistenciaJudicialCausaTerminacionContrato })
        }
        this.showIconTo('CausasTerminacion', true);
        this.showAccordingTo('CausasTerminacion', false);
        this.showAccordingTo('Testigos', true);
      });
    } else {
      console.log(
        this.causasSuspencionContratoForm.value,
        this.causasSuspencionContratoForm.errors
      );
    }
  }

  validateSalario() {
    if (this.salarioForm.valid) {
      const data = this.salarioForm.value;

      data.idAsistenciaDiariaEmpleador =
        this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

      this.HttpService.postDailyAttendanceEmployerSalary(data).subscribe(
        (response: any) => {
          const idAsistenciaDiariaEmpleadorSalario =
            response?.idAsistenciaDiariaEmpleadorSalario ||
            this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleadorSalario;

          this.salarioForm.patchValue({ idAsistenciaDiariaEmpleadorSalario });
          this.showIconTo('ElementosDelSalario', true);
          this.showAccordingTo('ElementosDelSalario', false);
          this.showAccordingTo('CausasTerminacion', true);
        }
      );
    } else {
      this.salarioForm.markAllAsTouched();

      console.log(this.salarioForm.value, this.salarioForm.errors);
    }
  }

  /*Utils*/
  private uploadFileList(event: File[]): Promise<FileListEntity | null> {
    if (event && event.length > 0) {
      const formData = new FormData();
      let length = 0;

      for (let i = 0; i < event.length; i++) {
        const _iEvent: any = event[i];

        if (!_iEvent?.idArchivo) {
          length++;
          formData.append('files', event[i], event[i].name);
        }
      }

      if (length === 0) {
        return null;
      }

      return this.HttpService.postFiles(formData)
        .toPromise()
        .then(
          (response: FileListEntity) => {
            console.log('Uploaded file: ', response);
            return response;
          },
          (error) => {
            console.error(error);
            return null;
          }
        );
    }
    return null;
  }

  gotToBottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  onChangeTipoSolicitante() {
    let especifiqueDrop = document.getElementById('especifique') as HTMLSelectElement;

    const tipeSelected = this.getTypeApplicationCode()

    if (tipeSelected === 'RTRABAJADO') {
      especifiqueDrop.style.display = 'block';
    } else {
      especifiqueDrop.style.display = 'none';
    }

    if (tipeSelected === 'EMPLEADOR' || tipeSelected === 'REMPLEADOR') {
      this.TipoSolicitante = 'Empleador'
    } else {
      this.TipoSolicitante = 'Trabajador'
    }

    if (document.getElementById('tipoEmpleador')) {
      if (tipeSelected === 'TRABAJADOR' || tipeSelected === 'RTRABAJADO') {
        document.getElementById('tipoEmpleador').classList.remove('showDiv')
        document.getElementById('tipoEmpleador').classList.add('hiddeDiv')
      } else {
        document.getElementById('tipoEmpleador').classList.add('showDiv')
        document.getElementById('tipoEmpleador').classList.remove('hiddeDiv')
      }
    }

    this.setTextValueEmpresaTitleForm()
  }

  empresaTitleForm: string

  setTextValueEmpresaTitleForm() {
    const tipeSelected = this.getTypeApplicationCode()
    const value = this.asistenciaJudicialHeaderForm.get('tipoEmpleador').value
    
    if (tipeSelected === 'EMPLEADOR' || tipeSelected === 'REMPLEADOR') {
      this.empresaTitleForm = value === 'FORMALIZADA' ? 'EMPRESA FORMALIZADA' : 'PERSONA FISICA'
      document.getElementById('asterico-sector').style.display = 'none';

      this.empresaFormalizadaForm.get('rncCedula').setValidators([Validators.required]);
      if (value === 'FORMALIZADA') {
        this.empresaFormalizadaForm.get('nombre').setValidators(null);
        this.empresaFormalizadaForm.get('nombre').updateValueAndValidity();
        this.empresaFormalizadaForm.get('apellido').setValidators(null);
        this.empresaFormalizadaForm.get('apellido').updateValueAndValidity();
        this.empresaFormalizadaForm.get('representanteLegalEmpleador').setValidators([Validators.required]);
        this.empresaFormalizadaForm.get('representanteLegalEmpleador').updateValueAndValidity();
      } else {
        this.empresaFormalizadaForm.get('nombre').setValidators([Validators.required]);
        this.empresaFormalizadaForm.get('nombre').updateValueAndValidity();
        this.empresaFormalizadaForm.get('apellido').setValidators([Validators.required]);
        this.empresaFormalizadaForm.get('apellido').updateValueAndValidity();
        this.empresaFormalizadaForm.get('representanteLegalEmpleador').setValidators(null);
        this.empresaFormalizadaForm.get('representanteLegalEmpleador').updateValueAndValidity();
      }
    } else {
      this.asistenciaJudicialHeaderForm.get('tipoEmpleador').patchValue('FORMALIZADA')
      this.empresaTitleForm = 'DATOS LABORALES';

      if (document.getElementById('asterico-cedula') && document.getElementById('asterico-cedula')?.style.display) {
        document.getElementById('asterico-cedula').style.display = 'none';
      }

      document.getElementById('asterico-cedula') ? document.getElementById('asterico-cedula').style.color = '#FFF' : 'red';

      if (this.empresaTitleForm === 'DATOS LABORALES') {
        this.empresaFormalizadaForm.get('rncCedula').setValidators(null);
        this.empresaFormalizadaForm.get('rncCedula').updateValueAndValidity();
      }
    }
  }

  async employerTypeForm(tipoEmpleador: string) {
    let acordionEmpresa = document.getElementById('empresa') as HTMLElement;
    let acordionPersonaFisica = document.getElementById('personaFisica') as HTMLElement;

    let checkEmpleador = document.getElementById('checkAbogado') as HTMLInputElement;

    if ((tipoEmpleador == 'FORMALIZADA' || tipoEmpleador == 'FISICA') && checkEmpleador.checked) {
      if (acordionEmpresa && acordionEmpresa.style) acordionEmpresa.style.display = 'block';

      if (acordionPersonaFisica && acordionPersonaFisica.style) acordionPersonaFisica.style.display = 'none';
    } else {
      acordionEmpresa.style.display = 'none';

      if (acordionPersonaFisica && acordionPersonaFisica.style) acordionPersonaFisica.style.display = 'none';
    }

    this.setTextValueEmpresaTitleForm()
  }

  //MOSTRAR SELECT TIPO EMPLEADOR
  onClickTieneAporadoEnSuDemanda() {
    let checkEmpleador = document.getElementById(
      'checkAbogado'
    ) as HTMLInputElement;
    let selectTipoEmpleador = document.getElementById(
      'tipoEmpleador'
    )
    let acordionEmpresa = document.getElementById('empresa') as HTMLElement;
    if (checkEmpleador.checked) {
      selectTipoEmpleador.style.display = 'block';
    } else {
      selectTipoEmpleador.style.display = 'none';
      acordionEmpresa.style.display = 'none';
    }
    const value = this.asistenciaJudicialHeaderForm.get('tipoEmpleador')?.value
    if (value) {
      this.employerTypeForm(value)
    }
    // 
  }

  getTypeApplicationCode(): 'EMPLEADOR' | 'TRABAJADOR' | 'REMPLEADOR' | 'RTRABAJADO' | '' {
    const value = this.asistenciaDiariaForm.get('idTipoSolicitante')?.value
    if (value) {
      const valueIsEmpleador: any = this.typeApplicantDrop.find(x => `${x.value}` === `${value}`)
      return valueIsEmpleador?.serviceCode
    }
    return "";
  }
  getTypeApplicateIsEmpleador(_value: string) {
    const value = this.asistenciaDiariaForm.get('idTipoSolicitante')?.value
    if (value) {
      const valueIsEmpleador: any = this.typeApplicantDrop.find(x => x.value === value)
      const serviceCode = valueIsEmpleador?.serviceCode
      if (serviceCode && (serviceCode === 'EMPLEADOR' || serviceCode === 'REMPLEADOR')
      ) {
        return true;
      }
      this.asistenciaDiariaForm.patchValue({ tipoEmpleador: "FORMALIZADA" })
      return false
    }
    return false;
  }
  cambiarNombreDelFormulario(textValue: string) {
    this.getTextTipoEmpresa(textValue)
    
    if (document.getElementById('tipoEmpleador')) {
      const collapseElement = document.getElementById('tipoEmpleador');
      
      if (textValue.toLowerCase().includes('trabajador')) {
        collapseElement.classList.remove('showDiv')
        collapseElement.classList.add('hiddeDiv')
      } else {
        collapseElement.classList.add('showDiv')
        collapseElement.classList.remove('hiddeDiv')
      }

    }
  }
  getTextTipoEmpresa(value: string) {
    const _value = value || this.asistenciaDiariaForm.get('idTipoSolicitante')?.value
    
    if (_value) {
      if (this.getTypeApplicateIsEmpleador(value)) {
        this.TipoSolicitante = this.asistenciaJudicialHeaderForm.value.tipoEmpleador == "FORMALIZADA" ? "EMPRESA FORMALIZADA" :
          "PERSONA FISICA"
      } else {
        this.TipoSolicitante = "DATOS DE LA EMPRESA"
      }
    } else {
      this.TipoSolicitante = ""
    }
  }

  async irAlFinal() {
    const collapseElement = document.getElementById('servicioJudicialCollapse');
    const hasClass = collapseElement.classList.contains('show');

    if (hasClass) {
      collapseElement.classList.remove('show');
    } else {
      collapseElement.classList.add('show');
      setTimeout(this.gotToBottom, 300);
    }
  }

  checkDocumentNumber(input: string): string {
    const regex = /^[0-9\-]+$/;

    if (regex.test(input)) {
      return null;
    } else {
      this.errorMessageForDocumentNumber =
        'El input contiene caracteres invalidos';
      console.log('El input contiene caracteres invalidos');
      return 'El input contiene caracteres invalidos';
    }
  }



  async duplicarServicioAsistenciaDiaria(redirect: boolean = true) {
    this.asistenciaDiariaForm.enable();

    if (this.asistenciaDiariaForm.valid) {
      const data = this.asistenciaDiariaForm.getRawValue();
      const nacionalidadSeleted: any = this.nationalityDrop.find((x: any) => x.value == data.idNacionalidad)
      this.asistenciaDiariaForm.patchValue({ idNacionalidadDropDown: [nacionalidadSeleted] });
      const newDataInsert = {
        idUsuario: this.user.userId,
        fechaAlta: new Date().toISOString().substring(0, 10),
        idTipoIdentificacion: data?.idTipoIdentificacion,
        identificacion: data?.identificacion,
        nombre: data?.nombre,
        apellido: data?.apellido,
        idSexo: data?.idSexo,
        idEstadoCivil: data?.idEstadoCivil,
        idNacionalidad: data?.idNacionalidad || nacionalidadSeleted?.value,
        edad: data?.edad
      };

      this.router.navigate(['/Casos/creacionRecord/'], {
        queryParams: newDataInsert
      });
    } else {
      this.asistenciaDiariaForm.markAllAsTouched();
    }
  }

  async guardarAsistenciaDiaria(redirect: boolean = true) {
    if (this.asistenciaDiariaForm.valid && this.asistenciaDiariaForm.hasError('abogadosIguales') == false) {
      this.HttpService.postDailyAttendanceForm(
        this.asistenciaDiariaForm.value
      ).subscribe(
        (data: any) => {
          const redirectToHistorial = () => { this.router.navigate(['/Casos/historial']); };
          const idAsistenciaDiaria = data?.idAsistenciaDiaria || this.asistenciaDiariaForm.value.idAsistenciaDiaria;
          const codigo = data?.codigo || this.asistenciaDiariaForm.value.codigo;
          
          this.asistenciaDiariaForm.patchValue({ codigo, idAsistenciaDiaria });
          if (redirect) {
            if (data) {

              this.sweet
                .record(
                  'success',
                  `Registro Creado Exitosamente`,
                  `Se ha creado su registro con el <strong>No. ${codigo}</span>.</strong> Puede ir a la pantalla de historial para ver o modificar los datos`,
                  ``
                )
                .then(redirectToHistorial);
            } else {
              this.sweet
                .record(
                  'success',
                  `Registro Actualizado`,
                  'Su registro ha sido guardado exitosamente',
                  ``
                )
                .then(redirectToHistorial);
            }
          }
        },
        (error) => {
          this.toast.error(
            'favor inténtelo mas tarde!',
            'La aplicación no esta disponible'
          );
          console.log(error);
        }
      );
    } else {
      this.asistenciaDiariaForm.markAllAsTouched();
    }
  }

  async validateAsistenciaDiariaForm(isServicioJudicial: boolean = false) {
    const redirectToHistorial = () => {
      this.router.navigate(['/Casos/historial']);
    };
    
    if (this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador) {
      const data: any = await this.HttpService.getById(
        'DailyAttendanceEmployer',
        this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador
      ).toPromise().catch((x) => null);

      if (data) {
        if (!this.route.snapshot.params['idAsistenciaDiaria']) {
          this.sweet
            .record(
              'success',
              `Registro Creado Exitosamente`,
              `Se ha creado su registro con el <strong>No. ${data?.codigo}</span>.</strong> Puede ir a la pantalla de historial para ver o modificar los datos`,
              ``
            )
            .then(redirectToHistorial);
        } else {
          this.sweet
            .record(
              'success',
              `Registro Actualizado`,
              `Se ha creado su registro con el <strong>No. ${data?.codigo}</span>.</strong>`,
              ``
            )
            .then(redirectToHistorial);
        }
      } else {
        this.toast.error(
          'favor inténtelo mas tarde!',
          'La aplicación no esta disponible'
        );
      }
    } else {
      this.toast.error(
        'favor inténtelo mas tarde!',
        'La aplicación no esta disponible'
      );
    }
  }

  onPressAddNote() {
    if (!this.asistenciaJudicial?.codigo) {
      this.sweet.alert(
        'warning',
        `No puede agregar Notas`,
        'No existe Asistencia Judicial para creada para realizar esta acción.'
      );

      return;
    }

    const ngmodalorderNote: NgbModalRef = this.ngBModal.open(
      NotesComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false, centered: true
    });

    ngmodalorderNote.componentInstance.serviceOrderNumber = _.cloneDeep(this.asistenciaJudicial?.codigo);
    ngmodalorderNote.componentInstance.edit.subscribe();
  }

  // Deshabilatar boton asistencia judicial cuando sea una consulta

  motivoVisita() {
    var motivo = document.getElementById('idMotivoVisita') as HTMLSelectElement;
    var asistenciaJudicial = document.getElementById('btnAddService') as HTMLButtonElement;
    var creaOtroRegistro = document.getElementById('creaOtroRegistro') as HTMLButtonElement;

    const motivoSelected = this.reasonOfVisitDrop?.find(mv => mv.value == motivo.value);

    if (motivo instanceof HTMLSelectElement &&
      asistenciaJudicial instanceof HTMLButtonElement &&
      creaOtroRegistro instanceof HTMLButtonElement) {
      if (motivoSelected.alternateField != 'SOLSER') {
        asistenciaJudicial.style.display = "none";
        creaOtroRegistro.classList.remove("float-start");
        creaOtroRegistro.classList.add("float-end");
      } else {
        asistenciaJudicial.style.display = "block";
        creaOtroRegistro.classList.remove("float-end");
        creaOtroRegistro.classList.add("float-start");
      }
    } else {
      console.error()
    }
  }

  // VALIDACIÓN DE LA FECHA  ACORDEON
  calendarFechaAcordeon() {
    let inputCal = document.getElementById('fechaAcordeon') as HTMLInputElement;
    inputCal.min = new Date(new Date().setDate(new Date().getDate() - 14))
      .toISOString()
      .slice(0, 10);
    inputCal.max = new Date().toISOString().split('T')[0];
  }

  // OBTENER DATOS DEL CIUDADANO (DB CIUDADANO)
  nacionalidadCiudadana: any
  getCitizen() {
    let documento = this.asistenciaDiariaForm.value.identificacion;
    let tipoDocumentoField = this.asistenciaDiariaForm.value.idTipoIdentificacion;

    let tipoDocumento = this.identificationDrop.find(d => d.value == tipoDocumentoField)?.alternateField;

    if (tipoDocumento && documento) {

      this.showSpinnerCitizen(true, 'btnSearchCitizen');

      this.HttpService.getCitizens(tipoDocumento, documento).subscribe((response: any) => {
        this.citizens = response;

        if (this.citizens.length > 0) {
          const foundCitizen = this.citizens[0];

          const nacionalidadCiudadana = this.nationalityDrop.find(
            n => n.value == parseInt(foundCitizen.nacionalidad)
          );
          
          const sexoCiudadano = this.sexDrop.find(
            s => s.value == parseInt(foundCitizen.sexo)
          );
          
          const estadoCivilCiuadano = this.civilStatusDrop.find(
            cs => cs.value == parseInt(foundCitizen.estadoCivil)
          );

          console.log('citicen', foundCitizen);

          this.asistenciaDiariaForm.patchValue({ idNacionalidadDropDown: [nacionalidadCiudadana] })

          this.asistenciaDiariaForm.patchValue({
            nombre: foundCitizen.nombres,
            apellido: foundCitizen.apellidos,
            idSexo: sexoCiudadano.value,
            edad: foundCitizen.edad,
            idEstadoCivil: estadoCivilCiuadano.value,
            idNacionalidad: nacionalidadCiudadana.value
          });
        } else {
          this.asistenciaDiariaForm.value.identificacion.markAsTouched();
          this.showSpinnerCitizen(false, 'btnSearchCitizen');
        }

        this.showSpinnerCitizen(false, 'btnSearchCitizen');
      }, (error) => {
        if (error.status == 404) {
          this.toast.error('', 'Documento no encontrado');
          this.showSpinnerCitizen(false, 'btnSearchCitizen');
        }
        console.error('Ha ocurrido un error: ', error)
        this.showSpinnerCitizen(false, 'btnSearchCitizen');
      });
    } else {
      this.asistenciaDiariaForm.value.identificacion.markAsTouched();

      this.showSpinnerCitizen(false, 'btnSearchCitizen');
    }
  }

  getCitizenPersonaFisica() {
    let documento = this.empresaFormalizadaForm.value.identificacion;
    let tipoDocumentoField = this.empresaFormalizadaForm.value.idTipoIdentificacion;

    let tipoDocumento = this.identificationDrop.find(d => d.value == tipoDocumentoField)?.alternateField;

    if (tipoDocumento && documento) {
      this.HttpService.getCitizens(tipoDocumento, documento).subscribe((response: any) => {
        this.citizens = response;


        if (this.citizens.length > 0) {
          const foundCitizen = this.citizens[0];

          const nacionalidadCiudadana = this.nationalityDrop.find(n => n.value == parseInt(foundCitizen.nacionalidad));
          const estadoCivilCiuadano = this.civilStatusDrop.find(cs => cs.value == parseInt(foundCitizen.estadoCivil));

          this.asistenciaDiariaForm.patchValue({ idNacionalidadDropDown: [nacionalidadCiudadana] })

          this.empresaFormalizadaForm.patchValue({
            nombre: foundCitizen.nombres,
            apellido: foundCitizen.apellidos,
            idEstadoCivil: estadoCivilCiuadano.value,
            idNacionalidad: nacionalidadCiudadana.value
          });
        } else {
          this.empresaFormalizadaForm.get('identificacion').setValidators([Validators.required]);
        }
      });
    } else {
      this.empresaFormalizadaForm.get('identificacion').setValidators([Validators.required]);
    }
  }

  /*
  Validar tipo de documento: 
  Si esta seleccionado "No posee documentos, el numero de este no es requerido"
  */
  async validateDocumentType() {
    let documentTypeSelect = document.getElementById('idTipoIdentificacion') as HTMLSelectElement;

    let selected = documentTypeSelect.selectedIndex;
    let option = documentTypeSelect.options[selected];

    const documentSelected = this.identificationDrop?.find(td => td.value == documentTypeSelect.value);

    if (documentSelected?.alternateField == 'NPDC') {
      this.asistenciaDiariaForm.get('identificacion').setValidators(null);
      this.asistenciaDiariaForm.get('identificacion').updateValueAndValidity();

      document.getElementById('numberDocumentAsterisco').style.color = '#fff';
    } else {
      document.getElementById('numberDocumentAsterisco').style.color = '#ED232A';
    }
  }

  async validateDocumentTypeEmpoyer() {
    let documentTypeSelect = document.getElementById('tipoDeDocumento') as HTMLSelectElement;

    const documentSelected = this.identificationDrop?.find(td => td.value == documentTypeSelect.value);

    if (documentSelected?.alternateField == 'NPDC') {
      this.empresaFormalizadaForm.get('identificacion').setValidators(null);
      this.empresaFormalizadaForm.get('identificacion').updateValueAndValidity();

      document.getElementById('numberDocumentEmployerAsterisco').style.color = '#fff';
    } else {
      document.getElementById('numberDocumentEmployerAsterisco').style.color = '#ED232A';
    }
  }

  // Get info from SIRLA and fill the form Empresa Formalizada
  sucursales: any[];
  isBlocked: boolean = false;
  totalSalariosSirla: any;
  numeroDocumento: any;

  getCompanyData(inputValue: any, field: any) {
    const formData = this.empresaFormalizadaForm.value;

    for (const key in formData) {
      if (key !== field) {
        this.empresaFormalizadaForm.get(key).setValue('');
      }
    }

    let companyRnc = this.empresaFormalizadaForm.value.rncCedula;
    let companyRnl = this.empresaFormalizadaForm.value.rnl;
    let companyName = this.empresaFormalizadaForm.value.nombreComercial.toUpperCase();

    if (companyRnc || companyName || companyRnl) {
      this.isBlocked = true
      this.showSpinnerSirla(true, 'btn.btn-buscarInput.btnSirla')

      this.HttpService.getCompanyDataBySIRLA(companyName, companyRnc, companyRnl).subscribe((response: any) => {
        this.companyData = response.length > 0 ? response[0] : null;
        this.sucursales = response.filter(company => company.rnc === response[0].rnc);

        console.log(this.companyData);
        this.empresaFormalizadaForm.patchValue({ identificacion: this.companyData.documentoRepLegal });

        let actividadEconomicaOption = this.economicActivities.find(ea => ea.id == this.companyData.actividadEconomicaId);
        this.empresaFormalizadaForm.patchValue({ idTipoActividadComercialDropDown: [actividadEconomicaOption] });

        if (this.sucursales?.length == 2) {
          this.companyData = this.sucursales?.find(sucursal => sucursal.tipo.toLowerCase() == 'establecimiento')
        } else if (this.sucursales?.length > 2) {
          if (companyRnc != '') {
            const modalRef = this.ngBModal.open(
              SucursalesModalComponent, {
              size: 'lg',
              keyboard: false, centered: false, scrollable: true
            });

            modalRef.componentInstance.coincidencias = this.sucursales.sort((a, b) => (a.rnl > b.rnl) ? 1 : -1);
            modalRef.componentInstance.rnlSeleccionado.subscribe((rnl: string) => {
              this.empresaFormalizadaForm.patchValue({ rnl });

              this.companyData = this.sucursales?.find(r => r.rnl.match(rnl));
              console.log('sucursales', this.companyData);

              this.empresaFormalizadaForm.patchValue({
                rncCedula: this.companyData.rnc || '',
                rnl: this.companyData.rnl || '',
                identificacion: this.companyData.documentoRepLegal,
                nombreComercial: this.companyData.nombreComercial || '',
                dedicacion: this.companyData.aQueSeDedica || '',
                idTipoActividadComercial: this.companyData.actividadEconomicaId || '',
                razonSocial: this.companyData.razonSocial || '',
                calle: this.companyData.calle || '',
                representanteLegalEmpleador: this.companyData.nombrePersonaContacto || '',
                provincia: this.companyData.provinciaId != null ? this.companyData.provinciaId : 0,
                municipio: this.companyData.municipioId != null ? this.companyData.municipioId : 0,
                distritoMunicipal: this.companyData.distritoMunicipalId != null ? this.companyData.distritoMunicipalId : 0,
                numero: this.companyData.numero || '',
                sector: this.companyData.nombreBarrio || '',
                direccionReferencia: this.companyData.referencia || '',
                idTipoIdentificacion: 0,
                documentoEmpleador: this.companyData.documentoEmpleador || '',
              });

              // Formulario Situacion Socio Economica - empleador
              this.situacionEconomicaForm.patchValue({
                valorExistenciaInstalacion: this.companyData.valorInstalaciones || '',
                salario: this.totalSalariosSirla || '',
              });

              // Formulario Elementos del contrato
              this.contratoTrabajoForm.patchValue({
                fechaInicio: this.companyData.fechaInicioActividades
              })

              //this.companyData = this.sucursales?.find(r => r.rnl.match(rnl)).sort((a, b) => (a.rnl > b.rnl) ? 1 : -1);
              this.loadEmpresaFormalizadaForm();

              if (this.empresaTitleForm === 'DATOS LABORALES') {
                this.getContractElement(companyRnc);
              }
            });

            return;
          }

          //Formulario empresa formalizada/Datos Laborales
          this.empresaFormalizadaForm.patchValue({
            rncCedula: this.companyData.rnc || '',
            rnl: this.companyData.rnl || '',
            identificacion: this.companyData.documentoRepLegal,
            nombreComercial: this.companyData.nombreComercial || '',
            dedicacion: this.companyData.aQueSeDedica || '',
            idTipoActividadComercial: this.companyData.actividadEconomicaId || '',
            razonSocial: this.companyData.razonSocial || '',
            calle: this.companyData.calle || '',
            representanteLegalEmpleador: this.companyData.nombrePersonaContacto || '',
            provincia: this.companyData.provinciaId != null ? this.companyData.provinciaId : 0,
            municipio: this.companyData.municipioId != null ? this.companyData.municipioId : 0,
            distritoMunicipal: this.companyData.distritoMunicipalId != null ? this.companyData.distritoMunicipalId : 0,
            numero: this.companyData.numero || '',
            sector: this.companyData.nombreBarrio || '',
            direccionReferencia: this.companyData.referencia || '',
            idTipoIdentificacion: 0,
            documentoEmpleador: this.companyData.documentoEmpleador || '',
          });

          // Formulario Situacion Socio Economica - empleador
          this.situacionEconomicaForm.patchValue({
            valorExistenciaInstalacion: this.companyData.valorInstalaciones || '',
            salario: this.totalSalariosSirla || '',
          });

          // Formulario Elementos del contrato
          this.contratoTrabajoForm.patchValue({
            fechaInicio: this.companyData.fechaInicioActividades
          })

          if (this.companyData) {
            this.economicActivities.find(ae => ae.id == this.companyData.actividadEconomicaId);
          }

          if (this.companyData.idTipoDocumento) {
            this.identificationDrop.find(dt => dt.value == this.companyData.idTipoDocumento)
          }

          //Address
          this.getMunicipalities(this.companyData.provinciaId);
          this.getDistricts(this.companyData.distritoMunicipalId);

          this.showSpinnerSirla(false, 'btn.btn-buscarInput.btnSirla');
        }
        this.showSpinnerSirla(false, 'btn.btn-buscarInput.btnSirla');

        this.loadEmpresaFormalizadaForm();
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.toast.error('', 'Empresa no Encontrada');
        }

        this.showSpinnerSirla(false, 'btn.btn-buscarInput.btnSirla');
      });

      this.isBlocked = true;
      this.showSpinnerSirla(false, 'btn.btn-buscarInput.btnSirla');

      // Elementos del Contrato de Trabajo
      if (this.empresaTitleForm === 'DATOS LABORALES') {
        this.getContractElement(companyRnc);
      }
    }
  }

  isSearchingOrdenSicit: boolean;
  getOrdenSicitData(ordenServicioNumero: string) {
    this.ordenesSicitForm.markAllAsTouched();
    
    if (this.ordenesSicitForm.valid == false) return
    
    if (ordenServicioNumero) {
      this.HttpService.getConsultaOrdenesSicit(ordenServicioNumero).subscribe((response: ConsultaOrdenSicitResponse[]) => {
        let ordenSicit = response[0]
        if (ordenSicit)
        {
          this.ordenesSicitForm.patchValue({...ordenSicit});
          this.ordenesSicitForm.patchValue({fechaOrden: new Date(ordenSicit.fechaOrden).toISOString().substring(0, 10)})   
        } 
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.ordenesSicitForm.patchValue({
            ordenServicioNumero: ordenServicioNumero,
            empRnc: '',
            empRnl: '',
            fechaOrden: '',
            estadoOrdenServicioInfo: ''
          })
          console.log(this.ordenesSicitForm.value)
          this.toast.error(
            '',
            'No existe ninguna orden de servicio asociada al RNC o Cédula suministrado'
          );
        }
      });
    }
  }

  loadEmpresaFormalizadaForm() {
    if (this.companyData) {
      this.empresaFormalizadaForm.patchValue({
        rncCedula: this.companyData.rnc || '',
        rnl: this.companyData.rnl || '',
        identificacion: this.companyData.documentoRepLegal || '',
        nombreComercial: this.companyData.nombreComercial || '',
        dedicacion: this.companyData.aQueSeDedica || '',
        idTipoActividadComercial: this.companyData.actividadEconomicaId || '',
        razonSocial: this.companyData.razonSocial || '',
        calle: this.companyData.calle || '',
        representanteLegalEmpleador: this.companyData.nombrePersonaContacto || '',
        provincia: this.companyData.provinciaId != null ? this.companyData.provinciaId : 0,
        municipio: this.companyData.municipioId != null ? this.companyData.municipioId : 0,
        distritoMunicipal: this.companyData.distritoMunicipalId != null ? this.companyData.distritoMunicipalId : 0,
        numero: this.companyData.numero || '',
        sector: this.companyData.nombreBarrio || '',
        direccionReferencia: this.companyData.referencia || '',
        idTipoIdentificacion: this.companyData.idTipoIdentificacion || ''
      });
    }
  }

  // This block is for cascading dropdowns about Divisiones Territoriales

  // properties
  provinces: any;
  municipality: any;
  district: any;

  municipiosDrop:any
  municipalityDistrictConsulting:any

  //Provinces
  getProvinces() {
    this.HttpService.getAllProvince().subscribe((response: any) => {
      this.provinces = response;
    });
  }

  getMunicipios() {
    this.HttpService.getAllMunicipalities().subscribe((response: any) => {
      this.municipality = response;

      // for empresa formalizada/datos laborales
      this.municipiosDrop = response;
    });
  }

  getDistritosMunicipales() {
    this.HttpService.getAllDistricts().subscribe((response: any) => {
      this.district = response;
    });
  }

  onSelectedProvince() {
    const selectedProvinceId = this.empresaFormalizadaForm.value.provincia;

    this.getMunicipalities(selectedProvinceId);

    this.district = [];
  }

  selectedProvince() {
    const provinceSelected = this.referenciaPersonalesForm.value.provincia;

    this.getMunicipalities(provinceSelected);
  }

  //Municipality
  getMunicipalities(parent?: number) {
    const selectedMunicipalityId = this.empresaFormalizadaForm.value.municipio;

    this.HttpService.getAllMunicipalities(parent).subscribe((response: any) => {
      this.municipality = response;
      
      this.getDistricts(selectedMunicipalityId);
    }, (error) => {
      console.log(error);
    });
  }

  selectedMunicipality(parent?: number) {
    const selectedMunicipalityId = this.referenciaTestigos.value.municipio;

    this.HttpService.getAllMunicipalities(parent).subscribe((response: any) => {
      this.municipality = response;
      
      this.getDistricts(selectedMunicipalityId);
    }, (error) => {
      console.log(error);
    });
  }

  // District
  getDistricts(parent?: number) {
    this.HttpService.getAllDistricts(parent).subscribe((response: any) => {
      this.district = response;
    }, (error) => {
      console.log(error);
    });
  }

  //Divisiones territoriales de Referencia 

  onSelectedProvinceReferencia() {
    const selectedProvinceId = this.referenciaPersonalesForm.value.provincia;
    this.getMunicipalitiesReferencia(selectedProvinceId);
  }

  getMunicipalitiesReferencia(parent?: number) {
    const municipioSelected = this.referenciaPersonalesForm.value.municipio;
    
    this.HttpService.getAllMunicipalities(parent).subscribe((response: any) => {
      this.municipality = response;
      console.log('Municipios', this.municipality);
    });
    
    this.getDistrictsReferencia(municipioSelected);
  }
    
  getDistrictsReferencia(parent?: number) {
    this.HttpService.getAllDistricts(parent).subscribe((response: any) => {
      this.district = response;
      console.log('district', this.district);
    }, (error) => {
      console.log(error);
    });
  }

  // DIVISIONES TERRITORIALES TESTIGOS
  onSelectedProvinceTestigos() {
    const selectedProvinceId = this.testigosForm.value.provincia;
    this.getMunicipalitiesTestigo(selectedProvinceId);
  }

  getMunicipalitiesTestigo(parent?: number) {
    this.HttpService.getAllMunicipalities(parent).subscribe((response: any) => {
      this.municipality = response;

      this.getDistrictsTestigo();
    }, (error) => {
      console.log(error);
    });
  }

  getDistrictsTestigo(parent?: number) {
    this.HttpService.getAllDistricts(parent).subscribe((response: any) => {
      this.district = response;
    }, (error) => {
      console.log(error);
    });
  }


  /**End of the block about Divisiones territoriales */

  validateGeneralInfoForm() {
    if (this.informacionGeneralForm.valid) {
      this.showLoadingSpinner(true, "btn-informacionGeneral");


      const idAsistenciaDiaria = this.asistenciaDiariaForm.value.idAsistenciaDiaria;

      let idRepLocalProvinciaCatalog = this.informacionGeneralForm.value.idRepLocalProvinciaCatalog;
      let fechaRegistro = this.informacionGeneralForm.value.fechaRegistro;

      const idAD = { idRepLocalProvinciaCatalog, idAsistenciaDiaria };

      const idData = {
        fechaRegistro,
        idUsuario: this.user.userId,
        tipoEmpleador: this.asistenciaJudicialHeaderForm.value.tipoEmpleador,
        IdAsistenciaDiaria: this.asistenciaDiariaForm.value.idAsistenciaDiaria,
        tieneApoderadoSuDemanda: true,
        idAsistenciaDiariaEmpleador: this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador,
        idRepLocalProvinciaCatalog: this.asistenciaDiariaForm.value.idRepLocalProvinciaCatalog,
      };

      this.HttpService.postDailyAttendanceEmployer(idData).subscribe(
        async (response: any) => {
          const idAsistenciaDiariaEmpleador =
            response?.idAsistenciaDiariaEmpleador ||
            this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador;

          this.asistenciaJudicialHeaderForm.patchValue({
            idAsistenciaDiariaEmpleador,
          });

          await this.actualizarDatosAsistenciaJudicial()

          this.showIconTo('InformacionGeneral', true);
          this.showAccordingTo('InformacionGeneral', false);

          if (this?.TipoSolicitante === 'Empleador') {
            this.showAccordingTo('EmpresaFormalizada', true);
          } else {
            this.showAccordingTo('EmpresaFormalizada', true);
          }
          this.showLoadingSpinner(false, "btn-informacionGeneral");
        }
      );

      this.HttpService.postDailyAttendanceForm(idAD).subscribe(response => {
        console.log(response);
      }, (error) => {
        console.error('Ha ocurrido un error: ', error);
        this.showLoadingSpinner(true, "btn-informacionGeneral");
      });
    }
  }

  //Send number to get a Correspondencia from SISCOR
  async getSISCORData() {
    this.showSpinner(true, 'btnSerachC');

    this.mailNumber = this.empleadorCorrespondenciaForm.value.CodigoCorrespondencia;

    if (this.mailNumber === '' || this.mailNumber === null || !this.mailNumber) {
      alert('Ingrese un numero de Correspondencia')

      this.showSpinner(false, 'btnSerachC');

      return;
    }

    this.HttpService.getDataFromSISCOR(this.mailNumber).subscribe((response: any) => {
      this.resultMailNumberSiscord = response;

      // Comprueba si response.name es igual a 'N/A' y, si lo es, cambia el valor a 'No Encontrado'.
      if (this.resultMailNumberSiscord.length > 0) {

        if (this.resultMailNumberSiscord[0].name == 'N/A') {
          this.resultMailNumberSiscord[0].name = 'Documento No Encontrado';
        }

        this.empleadorCorrespondenciaFilesItem?.forEach((file: File) => {
          this.resultMailNumberSiscord = this.resultMailNumberSiscord?.filter(
            fileSiscord => fileSiscord.name === 'Documento No Encontrado' || fileSiscord.name !== file.name
          );
        });

        this.showSpinner(false, 'btnSerachC');
      } else {
        this.toast.error(
          'Sin Resultados',
          'La busqueda no obtuvo resultados.'
        );

        this.showSpinner(false, 'btnSerachC');
      }
    }, (error) => {
      console.error(error);
      this.showSpinner(false, 'btnSerachC');
    });
  }

  // Check roles for save and edit form
  isInRole: boolean = false;

  checkRolesToSaveOrEdit() {
    const allowedRoles = ['PLEGA', 'ENCA', 'DIR', 'ADM', 'COOR'];
    this.isInRole = allowedRoles.includes(this.user.roleCode);
  }

  checkloggedUserRlt() {
    if (this.user?.multipleRlt?.length == 1) {
      const multipleUserRlt = this.user?.multipleRlt[0]?.localRepresentativeProvince;
      const valuesRlt = {
        idRepLocalProvinciaCatalog: multipleUserRlt.localRepresentativeProvinceId, idRepLocalProvinciaCatalogDropDown: [{
          value: multipleUserRlt?.localRepresentativeProvinceId,
          text: `${multipleUserRlt?.provinceCode} - ${multipleUserRlt?.localRepProvinceInformation}`,
          code: multipleUserRlt?.provinceCode
        }]
      }

      this.asistenciaDiariaForm.patchValue(valuesRlt)
      this.informacionGeneralForm.patchValue(valuesRlt)
    }
  }

  downLoadAttachedFile(file: any) {
    this.showLoading('Descarga en curso...')
    this.tool.downLoadAttachedFile(file.idArchivo)
  }

  downLoadAttachedSignedFile(file: any) {
    this.showLoading('Descarga en curso...');

    if (file.name == this.idSignedFile.name) {
      this.tool.downLoadAttachedFile(this.idSignedFile.id)
    }
  }

  downloadMailDocument(file: any) {
    if (file?.idArchivo) {
      this.showLoading('Descarga en curso...')

      this.tool.downLoadAttachedFile(file?.idArchivo)
    }
  }

  getEconomicActivities() {
    this.HttpService.getAllEconomicActivities().subscribe(response => {
      this.economicActivities = response;
    })
  }

  // Ocultar el boton de añadir servicio Judicial
  consulta: boolean = false;
  isMotivoConsulta(idMotivo: any) {
    if (idMotivo == 272) {
      this.consulta = false
    } else {
      this.consulta = true
    }
  }

  get isMotivoConsultaSelected() {
    //Select input form, disabled when the option selected is "Consulta"
    let selectMotivo = document.getElementById('idMotivoVisita') as HTMLSelectElement;

    let motivoSelectedValue = this.reasonOfVisitDrop?.find(mv => mv.value == selectMotivo.value);

    if (motivoSelectedValue) {
      if (motivoSelectedValue.alternateField == 'SOLSER') {
        this.consulta = true;
      } else {
        this.consulta = false;
      }
    }

    return (!this.asistenciaJudicialHeaderForm.value.idAsistenciaDiariaEmpleador ||
      !this.asistenciaDiariaForm.value.idAsistenciaDiaria) && this.consulta;
  }

  // Elementos del Salario by SIRLA
  getSalaryElements(documentNumber: any, rnl: any) {
    this.HttpService.getSalaryElementDataBySIRLA(documentNumber, rnl).subscribe(data => {
      console.log('salary data: ', data);
    })
  }

  //Elementos del Contrato
  getContractElement(rncNumber: any) {
    this.numeroDocumento = this.asistenciaDiariaForm.value.identificacion;

    this.HttpService.getContractElements(rncNumber, this.numeroDocumento).subscribe((response: any) => {
      console.log(response);

      this.contratoTrabajoForm.patchValue({
        ocupacion: response[0].cargo || '',
        lugarTrabajo: response[0].empresa || '',
        idTipoJornada: '',
        idJornadaLaboral: '',
        fechaInicio: response[0].fechaIngreso,
        fechaFin: '',
        departamento: '',
        supervisorInmediato: ''
      });

      this.salarioForm.patchValue({
        monto: response[0].salario || '',
      });
    }, (error: HttpErrorResponse) => {
      if (error.status === 404) {
        this.toast.error('Este trabajador no pertence a esta empresa.', 'Trabajador no Encontrado');
      }
    });
  }

  //Filtrar lista de abogados: No poder seleccionar el mismo abogado en diferentes listas
  abogadoAlternoDrop: any;

  getAlternateLayer() {
    this.HttpService.getListLayers().subscribe((data) => {
      this.abogadoAlternoDrop = data;
    });
  }

  principalLayer: any = [];
  alternateLayer: any = [];

  filterPrincipalLayer() {
    this.abogadosDrop = this.abogadosDrop?.filter(
      option => !this.alternateLayer?.find(
        selectedOption => selectedOption.userCode === option.userCode));
  }

  filterAlternateLayer() {
    this.abogadoAlternoDrop = this.abogadoAlternoDrop?.filter(
      option => !this.principalLayer?.find(
        selectedOption => selectedOption.userCode === option.userCode));
  }

  openReferencesModal(rp: any) {
    const referenceModal = this.ngBModal.open(
      WitnessReferencesModalComponent, {
      size: 'lg',
      keyboard: false, centered: false, scrollable: true
    });

    referenceModal.componentInstance.referenciasP = rp;
  }
  
  openWitnessModal(rp: any) {
    const witnessModal = this.ngBModal.open(
      WitnessModalComponent, {
      size: 'lg',
      keyboard: false, centered: false, scrollable: true
    });

    witnessModal.componentInstance.testigosR = rp;
  }

  // Adding spinner in searching/saving in data
  showSpinner(isLoading: boolean, btnId: string) {
    let btn = document.querySelector('button#' + btnId) as HTMLButtonElement;
    let btnIcon = document.querySelector('button#' + btnId + ' i.fa.fa-search');

    let btnIconS = document.querySelector('button#' + btnId + ' i.fa.fa-spin.fa-spinner');

    if (isLoading) {
      btnIcon?.classList.add('fa-spin', 'fa-spinner');
      btnIcon?.classList.remove('fa-search');
      btn.disabled = true;
    } else {
      btnIconS?.classList.remove('fa-spin', 'fa-spinner');
      btnIconS?.classList.add('fa-search');
      btn.disabled = false;
    }
  }

  async showSpinnerCitizen(isLoading: boolean, btnId: string) {
    let btn = document.querySelector('button#' + btnId) as HTMLButtonElement;
    let btnIcon = document.querySelector('button#' + btnId + ' i.fa.fa-search');

    let btnIconS = document.querySelector('button#' + btnId + ' i.fa.fa-spin.fa-spinner');

    if (isLoading) {
      btnIcon?.classList.add('fa-spin', 'fa-spinner');
      btnIcon?.classList.remove('fa-search');
      btn.disabled = true;
    } else {
      btnIconS?.classList.remove('fa-spin', 'fa-spinner');
      btnIconS?.classList.add('fa-search');
      btn.disabled = false;
    }
  }


  async showSpinnerSirla(isLoading: boolean, btnId: string) {
    let btn = document.querySelector('button.' + btnId) as HTMLButtonElement;
    let btnIcon = document.querySelector('button.' + btnId + ' i.fa.fa-search');

    let btnIconS = document.querySelector('button.' + btnId + ' i.fa.fa-spin.fa-spinner');

    if (isLoading) {
      btnIcon?.classList.add('fa-spin', 'fa-spinner');
      btnIcon?.classList.remove('fa-search');
      btn.disabled = true;
    } else {
      btnIconS?.classList.remove('fa-spin', 'fa-spinner');
      btnIconS?.classList.add('fa-search');
      btn.disabled = false;

      this.isBlocked = false;
    }
  }

  async showLoadingSpinner(isLoading: boolean, btnId: string) {
    let btn = document.getElementById(btnId) as HTMLButtonElement;

    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa fa-spin fa-spinner"></i>'
    } else {
      btn.disabled = false;
      btn.innerHTML = 'Listo';
    }
  }

  showLoading(title: string) {
    Swal.fire({
      title: title,
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading();
      }
    })
  }
}
