import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from '../shared/_services/http-client/http-client.service';
import { IAdvanceSearchProperties } from './IAdvanceSearchProperties';
import { DropDownOptionModel } from '../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
@Component({
  selector: 'app-avance-search',
  templateUrl: './avance-search.component.html',
  styleUrls: ['./avance-search.component.css'],
})
export class AvanceSearchComponent {
  advanceSearchForm: FormGroup;
  @Input() advanceSearchProperties: IAdvanceSearchProperties
  @Input() isAsistenciaJudicial: boolean

  constructor(
    private httpService: HttpClientService,
    private fb: FormBuilder,
    public ngbActiveModal: NgbActiveModal,
  ) { }
  listUsersParalegal: any;
  listUsersLayers: any;
  instanciJudicialDrop: DropDownOptionModel[] = [];
  faseProcesalDrop: DropDownOptionModel[] = [];

  async ngOnInit() {
    this.advanceSearchForm = this.fb.group({
      ID_Usuario: [this?.advanceSearchProperties?.ID_Usuario || ''],
      ID_Abogado: [this?.advanceSearchProperties?.ID_Abogado || ''],
      ID_AbogadoAlterno: [this?.advanceSearchProperties?.ID_AbogadoAlterno || ''],
      ID_AbogadoAlterno1: [this?.advanceSearchProperties?.ID_AbogadoAlterno1 || ''],
      Identificacion: [this?.advanceSearchProperties?.Identificacion || ''],
      NombreSolicitante: [this?.advanceSearchProperties?.NombreSolicitante || ''],
      RNL: [this?.advanceSearchProperties?.RNL || ''],
      RNC: [this?.advanceSearchProperties?.RNC || ''],
      NombreComercial: [this?.advanceSearchProperties?.NombreComercial || ''],
      IdentificacionPersonaFisica: [this?.advanceSearchProperties?.IdentificacionPersonaFisica || ''],
      NombrePersonaFisica: [this?.advanceSearchProperties?.NombrePersonaFisica || ''],
      RepresentanteLegalEmpleador: [this?.advanceSearchProperties?.RepresentanteLegalEmpleador || ''],
      ID_InstanciaJudicial: [this?.advanceSearchProperties?.ID_InstanciaJudicial || ''],
      ID_FaseProceso: [this?.advanceSearchProperties?.ID_FaseProceso || ''],

    });

    this.getListParalegal();
    this.getListAbogado();
    this.getInstancaJudicial()
    this.getFaseProcesal()
  }
  getFaseProcesal() {
    this.httpService.get<any[]>('ProcessPhase').subscribe((data) => {
      this.faseProcesalDrop = data;
    });
  }
  getInstancaJudicial() {
    this.httpService.get<any[]>('JudicialInstance').subscribe((data) => {
      this.instanciJudicialDrop = data;
    });
  }
  getListParalegal() {
    this.httpService.getListParalegal().subscribe(response => this.listUsersParalegal = response);
  }

  getListAbogado() {
    this.httpService.getListLayers().subscribe((data) => {
      this.listUsersLayers = data;
    });
  }


  advanceSearch() {
    const filterOptions = this.advanceSearchForm.value;
    this.ngbActiveModal.close(filterOptions)

    var btnColorbusqueda = document.getElementById("btnBusquedad") as HTMLElement;
    btnColorbusqueda.style.background = "#1460B8";
    btnColorbusqueda.style.color = "#fff";
  }
}
