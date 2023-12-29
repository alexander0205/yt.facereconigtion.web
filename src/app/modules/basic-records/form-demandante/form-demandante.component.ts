import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { BehaviorSubject } from 'rxjs';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { ExpedienteDemandanteResponse } from '../../shared/_services/http-client/types/ExpedienteDemandateResponse';
import { AccordeonOpenCloseExpedientService } from '../../shared/accordeon/accordeon-open-close-expedient.service';
import { ToastService } from '../../shared/_services/toast/toast.service';
import { Desplegable } from '../../shared/_services/http-client/types/AsistenciaDiariaResponse';

@Component({
  selector: 'app-form-demandante',
  templateUrl: './form-demandante.component.html',
  styleUrls: ['./form-demandante.component.css']
})
export class FormDemandanteComponent {

  asistenciaDiariaForm: FormGroup;

  provinces: any;
  municipio: any;
  distrito: any;
  citizens: any;

  nacionalityDropdownSettings: any = {};

  @Input() expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() user: any;

  // @Input() nationalityDrop: DropDownOptionModel[] = [];
  @Input() nationalityDrop: any;
  @Input() civilStatusDrop: DropDownOptionModel[] = [];
  // @Input() identificationDrop: DropDownOptionModel[] = [];
  @Input() identificationDrop: any;
  @Input() sexDrop: DropDownOptionModel[] = [];
  @Input() typeApplicantDrop: DropDownOptionModel[] = [];
  @Input() rTEDrop: DropDownOptionModel[] = [];
  @Input() reasonOfVisitDrop: DropDownOptionModel[] = [];
  @Input() referidoDrop: DropDownOptionModel[] = [];
  @Input() abogadosDrop: DropDownOptionModel[] = [];
  @Input() expedientCerrado: boolean

  constructor(private httpService: HttpClientService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private accordeonService: AccordeonOpenCloseExpedientService) { }

  ngOnInit(): void {
    this.asistenciaDiariaForm = this.formBuilder.group({
      idExpedienteDemandante: [0],
      idExpediente: [''],
      idUsuario: [this.user.userId],
      idTipoIdentificacion: ['', Validators.required],
      identificacion: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      idSexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.maxLength(2)]],
      idNacionalidad: ['', Validators.required],
      idNacionalidadDropDown: [[]],
      idEstadoCivil: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.maxLength(12),
        ],
      ],
      correoElectronico: [''],
      provincia: ['', Validators.required],
      municipio: ['', Validators.required],
      distritoMunicipal: ['', Validators.required],
      sector: ['', Validators.required],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      edificio: [''],
      direccionReferencia: [''],
      apartamentoCasa: [''],
    });
    this.loadAsistenciaDiariaTrabajador(this.record)
    
    this.loadInformationExpedient();

    this.getProvinceDemandante();
    this.getNacionalidad();

    this.nacionalityDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };
  }

  onNacionalitySelect(item: any) { this.asistenciaDiariaForm.patchValue({ idNacionalidad: item.value }); }

  loadInformationExpedient() {
    this.expedientResult.subscribe(expedientResult => {
      if (expedientResult) {
        console.log('expedientResult', expedientResult);
        
        this.loadExpedienteDemandante(expedientResult.idExpediente)
      }
    });
  }

  async loadAsistenciaDiariaTrabajador(AsistenciaDiariaEmpleadorR: AsistenciaDiariaEmpleadorResponse) {
    const asistenciaDiariaParaTrabajador = AsistenciaDiariaEmpleadorR?.asistenciaDiaria

    const tipoSolicitante = `${asistenciaDiariaParaTrabajador?.tipoSolicitante?.descripcion}`.toLowerCase()
    if (asistenciaDiariaParaTrabajador && tipoSolicitante.includes('trabajador')) {}
  }

  disableInputs() {
    let disableMode = false;
    Object.keys(this.asistenciaDiariaForm.controls).forEach(key => {
      const control = this.asistenciaDiariaForm.get(key);
      if (key === 'provincia') {
        disableMode = true; // Activar el modo de deshabilitar campos
      }

      if (!disableMode) {
        control.disable(); // Deshabilitar el campo
      }
    });
  }

  async loadExpedienteDemandante(idExpediente) {
    const expedienteDemandante = await this.httpService.getExpedienteDemandanteByExpedienteId(idExpediente);
    const _expedienteDemandante = expedienteDemandante && expedienteDemandante[0]
    if (_expedienteDemandante) {
      this.setExpedientData(_expedienteDemandante);
      //  this.disableInputs()
    } else {
      if (idExpediente) {
        this.asistenciaDiariaForm.patchValue({ idExpediente })
      }
    }
  }

  private setExpedientData(asistenciaDiaria: ExpedienteDemandanteResponse) {
    this.asistenciaDiariaForm.setValue({
      idExpedienteDemandante: asistenciaDiaria?.idExpedienteDemandante || 0,
      idExpediente: asistenciaDiaria?.idExpediente || 0,
      idUsuario: asistenciaDiaria?.idUsuario || "",
      idTipoIdentificacion: asistenciaDiaria?.idTipoIdentificacion || "",
      identificacion: asistenciaDiaria?.identificacion || "",
      nombre: asistenciaDiaria?.nombre || "",
      apellido: asistenciaDiaria?.apellido || "",
      idSexo: asistenciaDiaria.idSexo || "",
      edad: asistenciaDiaria.edad || "",
      idNacionalidad: asistenciaDiaria.idNacionalidad || "",
      idNacionalidadDropDown: [],
      telefono: asistenciaDiaria.telefono || "",
      correoElectronico: asistenciaDiaria.correoElectronico || "",
      idEstadoCivil: asistenciaDiaria?.idEstadoCivil || "",
      provincia: asistenciaDiaria.provincia || "",
      municipio: asistenciaDiaria.municipio || "",
      distritoMunicipal: asistenciaDiaria.distritoMunicipal || "",
      sector: asistenciaDiaria.sector || "",
      calle: asistenciaDiaria.calle || "",
      numero: asistenciaDiaria.numero || "",
      edificio: asistenciaDiaria.edificio || "",
      direccionReferencia: asistenciaDiaria.direccionReferencia || "",
      apartamentoCasa: asistenciaDiaria.apartamentoCasa || "",
    });

    this.validateForm()

    if (asistenciaDiaria.idNacionalidad) {
      const nacionalidadSeleted: any = this.nationalityDrop.find((x: any) => x.value == asistenciaDiaria.nacionalidad.id)
      this.asistenciaDiariaForm.patchValue({ idNacionalidadDropDown: [nacionalidadSeleted] });
    }

    // Municipio
    if (asistenciaDiaria.provincia) {
      const provinciaSelect = this.provinces.find(p => {
        if (p.id == asistenciaDiaria.provincia) {
          this.onSelectedProvince();
        }
      })
    }

    if (asistenciaDiaria.municipio) {
      const municipioSelect = this.provinces.find(p => p.id == asistenciaDiaria.municipio);
    } else {
      this.getMunicipioDemandante(parseInt(asistenciaDiaria.provincia));
    }
  }

  validateForm() {
    if (this.asistenciaDiariaForm.valid) {
      this.accordeonService.cerrarAcordeon('flush-collapseThree')
    }
  }

  getNacionalidad() {
    this.httpService.getNationalities().subscribe(response => this.nationalityDrop = response);
  }

  maxCheck(event: any) {
    const { value, maxlength } = event.target;
    if (value.length > maxlength) event.target.value = value.slice(0, maxlength);
  }

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

  validateDemandante() {
    this.showLoadingSpinner(true, 'btnDemandante');

    if (this.asistenciaDiariaForm.valid) {
      this.showLoadingSpinner(true, "btnDemandante");

      // const formValue = this.asistenciaDiariaForm.getRawValue();
      const formValue = this.asistenciaDiariaForm.value;

      console.log(formValue);

      this.httpService.postExpedienteDemandante(formValue).subscribe((response: any) => {
        console.log('response', response)

        if (response) {
          this.asistenciaDiariaForm.patchValue({ idExpedienteDemandante: response?.idExpedienteDemandante })
        }

        this?.accordeonService.cerrarAcordeon('flush-collapseThree')
        this.showLoadingSpinner(false, "btnDemandante");

      }, (error) => {
        console.error(error)
        this.showLoadingSpinner(false, "btnDemandante");

        this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
      });

      this.showLoadingSpinner(false, 'btnDemandante');
    } else {
      console.log(this.asistenciaDiariaForm.errors)

      this.asistenciaDiariaForm.markAllAsTouched();

      this.showLoadingSpinner(false, 'btnDemandante');
    }

    this.showLoadingSpinner(false, 'btnDemandante');
  }

  getProvinceDemandante(id?: any) {
    this.httpService.getAllProvince().subscribe((response: any) => {
      this.provinces = response;
    });
  }

  onSelectedProvince() {
    const selectedProvinceId = this.asistenciaDiariaForm.value.provincia;

    this.getMunicipioDemandante(selectedProvinceId);
  }

  getMunicipioDemandante(parent?: number) {
    const selectedMunicipalityId = this.asistenciaDiariaForm.value.municipio;

    this.httpService.getAllMunicipalities(parent).subscribe((response: any) => {
      this.municipio = response;

      this.getDistrictDemandante(selectedMunicipalityId);
    });
  }

  getDistrictDemandante(id?: any) {
    this.httpService.getAllDistricts(id).subscribe((response: any) => {
      this.distrito = response;
    })
  }

  // OBTENER DATOS DEL CIUDADANO (DB CIUDADANO)
  getCitizen() {
    let documento = this.asistenciaDiariaForm.value.identificacion;
    let tipoDocumentoField = this.asistenciaDiariaForm.value.idTipoIdentificacion;

    let tipoDocumento = this.identificationDrop.find(d => d.value == tipoDocumentoField)?.alternateField;

    if (tipoDocumento && documento) {
      this.showSpinner(true);

      this.httpService.getCitizens(tipoDocumento, documento).subscribe((response: any) => {
        this.citizens = response;

        if (this.citizens.length > 0) {
            const foundCitizen = this.citizens[0];
  
            if (foundCitizen.nacionalidad) {
           const nacionalidadCiudadana = this.nationalityDrop.find((n: Desplegable) => n.value == foundCitizen?.nacionalidad);
              this.asistenciaDiariaForm.patchValue({ idNacionalidad: foundCitizen?.nacionalidad })
              this.asistenciaDiariaForm.patchValue({ idNacionalidadDropDown: [nacionalidadCiudadana] })
  
            }
            const SexoCiudadana = this.sexDrop.find((n: Desplegable) => n.value == foundCitizen?.sexo);
            if (SexoCiudadana) {
              this.asistenciaDiariaForm.patchValue({ idSexo: SexoCiudadana?.value })
            }
  
            const EstadoCivilCiudadana = this.civilStatusDrop.find((n: Desplegable) => n.value == foundCitizen?.estadoCivil);
            if (EstadoCivilCiudadana) {
              this.asistenciaDiariaForm.patchValue({ idEstadoCivil: EstadoCivilCiudadana?.value })
            }
            this.asistenciaDiariaForm.patchValue({
              nombre: foundCitizen?.nombres,
              apellido: foundCitizen?.apellidos,
              edad: foundCitizen?.edad
            });
      

          this.showSpinner(false);
        } else {
          this.asistenciaDiariaForm.value.identificacion.markAsTouched();
          this.showSpinner(false);
        }
      }, (error) => {
        console.error('Ha ocurrido un problema: ', error);
        this.showSpinner(false);
        this.toast.error( 'Ha ocurrido un problema, contacte a soporte');
      });
    } else {
      this.asistenciaDiariaForm.value.identificacion.markAsTouched();
      this.showSpinner(false);
    }
  }

  async showSpinner(isLoading: boolean) {
    let btn = document.querySelector('button#buttonSe') as HTMLButtonElement;
    let btnIcon = document.querySelector('button#buttonSe i.fa.fa-search');

    let btnIconS = document.querySelector('button#buttonSe i.fa.fa-spin.fa-spinner');

    if (isLoading) {
      btnIcon.classList.add('fa-spin', 'fa-spinner');
      btnIcon.classList.remove('fa-search');
      btn.disabled = true;
    } else {
      btnIconS?.classList.remove('fa-spin', 'fa-spinner');
      btnIconS?.classList.add('fa-search');
      btn.disabled = false;
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
}
