import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { CompanyResponse } from '../../shared/_services/http-client/types/CompanyResponse';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';

@Component({
  selector: 'app-form-demandada',
  templateUrl: './form-demandada.component.html',
  styleUrls: ['./form-demandada.component.css']
})
export class FormDemandadaComponent {
  empresaFormalizadaForm: FormGroup;

  provincesDrop:any
  municipalitiesDrop: any;
  districtsDrop: any;

  economicActivities: any;
  economicActivityDropdownSettings: any = {};

  @Input() user: any;
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() nationalityDrop: DropDownOptionModel[] = [];
  @Input() civilStatusDrop: DropDownOptionModel[] = [];
  @Input() identificationDrop: DropDownOptionModel[] = [];
  @Input() expedientCerrado:boolean;

  constructor(
    private HttpService: HttpClientService,
    private formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.empresaFormalizadaForm = this.formBuilder.group({
      idEmpresa: [{ value: '', readOnly: true }],
      idAsistenciaDiariaEmpleador: [{ value: '', readOnly: true }],
      rncCedula: [{ value: '', readOnly: true }],
      rnl: [{ value: '', readOnly: true }],
      nombreComercial: [{ value: '', readOnly: true }],
      razonSocial: [{ value: '', readOnly: true }],
      provincia: [{ value: '', readOnly: true }, Validators.required],
      municipio: [{ value: '', readOnly: true }, Validators.required],
      distritoMunicipal: [{ value: '', readOnly: true }, Validators.required],
      sector: [{ value: '', readOnly: true }],
      calle: [{ value: '', readOnly: true }, Validators.required],
      numero: [{ value: '', readOnly: true }, Validators.required],
      edificio: [{ value: '', readOnly: true }],
      direccionReferencia: [{ value: '', readOnly: true }],
      apartamentoCasa: [{ value: '', readOnly: true }],
      idTipoActividadComercial: [{ value: '', readOnly: true }, Validators.required],
      idTipoActividadComercialDropDown: [[]],
      dedicacion: [{ value: '', readOnly: true }, Validators.required],
      representanteLegalEmpleador: [{ value: '', readOnly: true }, Validators.required],
      idTipoIdentificacion: [{ value: '', readOnly: true }],
      identificacion: [{ value: '', readOnly: true }],
      telefono: [{ value: '', readOnly: true }, Validators.required],
      correoElectronico: [{ value: '', readOnly: true }, Validators.pattern(".+@.+\.[a-zA-Z]{2,3}")],
      idNacionalidad: [{ value: '', readOnly: true }],
      idEstadoCivil: [{ value: '', readOnly: true }],
    });
    
    this.economicActivityDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'id',
      textField: 'nombre',
    };

    setTimeout(() => this.getEconomicActivities(), 2000)

    this.loadEmpresa(this.record?.idEmpresa, this.record.idAsistenciaDiariaEmpleador)
  }


  private async loadEmpresa(idEmpresa: number, idAsistenciaDiariaEmpleador: number) {
    const empresa: CompanyResponse = await this.HttpService.getById<CompanyResponse>("Company", idEmpresa).toPromise().catch(x => null);

    if (empresa) {
      this.empresaFormalizadaForm.setValue({
        idEmpresa: empresa?.idEmpresa,
        idAsistenciaDiariaEmpleador: idAsistenciaDiariaEmpleador || "",
        rncCedula: empresa.rncCedula || "",
        rnl: empresa.rnl || "",
        nombreComercial: empresa.nombreComercial || "",
        razonSocial: empresa.razonSocial || "",
        provincia: empresa.provincia || "",
        municipio: empresa.municipio || "",
        distritoMunicipal: empresa.distritoMunicipal || "",
        sector: empresa.sector || "",
        calle: empresa.calle || "",
        numero: empresa.numero || "",
        edificio: empresa.edificio || "",
        direccionReferencia: empresa.direccionReferencia || "",
        apartamentoCasa: empresa.apartamentoCasa || "",
        idTipoActividadComercial: empresa?.tipoActividadComercial?.id || "",
        idTipoActividadComercialDropDown: [],
        dedicacion: empresa.dedicacion || "",
        representanteLegalEmpleador: empresa.representanteLegalEmpleador || "",
        idTipoIdentificacion: empresa?.tipoIdentificacion?.id || "",
        identificacion: empresa.identificacion || "",
        telefono: empresa.telefono || "",
        correoElectronico: empresa.correoElectronico || "",
        idEstadoCivil: empresa?.estadoCivil?.id || "",
        idNacionalidad: empresa?.nacionalidad?.id || "",
      });
      
      this.getProvinceDemandada(parseInt(empresa.provincia));
      this.getMunicipalityDemandada(parseInt(empresa.provincia));
      this.getDistrictDemandada(parseInt(empresa.municipio));
    }

    this.empresaFormalizadaForm.disable();
  }

  getProvinceDemandada(id?: any) {
    this.HttpService.getAllProvince().subscribe((response: any) => {
      this.provincesDrop = response;
    })
  }

  getMunicipalityDemandada(id?: any) {
    this.HttpService.getAllMunicipalities(id).subscribe((response: any) => {
      this.municipalitiesDrop = response;
    });
  }

  getDistrictDemandada(id?: any) {
    this.HttpService.getAllDistricts(id).subscribe((response: any) => {
      this.districtsDrop = response;
    })
  }
  
  getEconomicActivities(): Promise<any> {
    return this.HttpService.getAllEconomicActivities().toPromise()
      .then(response => {
        this.economicActivities = response;
        return response;
      });
  }

  onEconomicActivitySelect(item: any) { this.empresaFormalizadaForm.patchValue({ idTipoActividadComercial: item.id }) }
}
