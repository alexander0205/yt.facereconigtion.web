import { Component, Input } from '@angular/core';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { BehaviorSubject } from 'rxjs';
import { AccordeonOpenCloseExpedientService } from '../../shared/accordeon/accordeon-open-close-expedient.service';
import { ToolsService } from '../../shared/tools/tools.service';

@Component({
  selector: 'app-form-fundamento-demanda',
  templateUrl: './form-fundamento-demanda.component.html',
  styleUrls: ['./form-fundamento-demanda.component.css']
})
export class FormFundamentoDemandaComponent {
  fundamentoDeLaDemandaForm: FormGroup;
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() user: any;
  @Input() expedientCerrado: boolean
  @Input() expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);

  p: number = 1;

  instanciJudicialDrop: DropDownOptionModel[] = [];
  motivoDeLaDemandaDrop: DropDownOptionModel[] = [];
  faseProcesalDrop: DropDownOptionModel[] = [];

  instanciaJudicialDropdownSettings: any = {};
  motivoDemandaDropdownSettings: any = {};
  faseProcesoDropdownSettings: any = {};

  historicoExpedienteData: any;
  instanciaJudicialSelected: any;
  faseProcesoSelected: any;

  ultimaFecha: any;

  constructor(private httpService: HttpClientService,
    public tool: ToolsService,
    private accordeonService: AccordeonOpenCloseExpedientService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.fundamentoDeLaDemandaForm = this.formBuilder.group({
      idExpediente: [0],
      idAsistenciaDiariaEmpleador: [this?.record?.idAsistenciaDiariaEmpleador],
      idInstanciaJudicial: ['', Validators.required],
      idInstanciaJudicialDropDown: [[]],
      idMotivoDemanda: ['', Validators.required],
      idMotivoDemandaDropDown: [[]],
      idFaseProceso: ['', Validators.required],
      idFaseProcesoDropDown: [[]],
      noExpedienteExterno: [''],
      // fechaUltimaAudiencia: [new Date().toISOString().substring(0, 10)],
      fechaUltimaAudiencia: [''],
      fechaProximaAudiencia: [''],

      observaciones: [''],
    });

    Promise.all([this.getInstancaJudicial(), this.getMotivoDeLaDemanda(), this.getFaseProcesal()]).then(() => {
      this.loadInformationExpedient();
    }).catch((error) => { alert(error) });


    this.instanciaJudicialDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };

    this.motivoDemandaDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };

    this.faseProcesoDropdownSettings = {
      singleSelection: true,
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Deseleccionar',
      allowSearchFilter: true,
      idField: 'value',
      textField: 'text',
    };

    this.fundamentoDeLaDemandaForm.controls['fechaUltimaAudiencia'].setValue('');
    this.fundamentoDeLaDemandaForm.controls['fechaProximaAudiencia'].setValue('');
  }

  getInstancaJudicial(): Promise<any[]> {
    return this.httpService.get<any[]>('JudicialInstance').toPromise()
      .then(data => {
        this.instanciJudicialDrop = data;

        return data;
      });
  }

  getMotivoDeLaDemanda(): Promise<any[]> {
    return this.httpService.get<any[]>('ReasonOfDemand').toPromise()
      .then(data => {
        this.motivoDeLaDemandaDrop = data;
        return data;
      });
  }

  getFaseProcesal(): Promise<any[]> {
    return this.httpService.get<any[]>('ProcessPhase').toPromise()
      .then(data => {
        this.faseProcesalDrop = data;
        return data;
      });
  }

  getHistoricoExpedient(id: number) {
    this.httpService.getHistoricoExpediente(id).subscribe((data: any) => {
      this.historicoExpedienteData = data;

      
      this.ultimaFecha = this.historicoExpedienteData[this.historicoExpedienteData.length - 1].fechaProximaAudiencia;
      console.log('Fecha ultima audiencia: ', this.ultimaFecha);
    })
  }

  loadInformationExpedient() {
    this.expedientResult.subscribe(expedientResult => {
      if (expedientResult) {

        this.fundamentoDeLaDemandaForm.setValue({
          idExpediente: expedientResult?.idExpediente,
          idAsistenciaDiariaEmpleador: this?.record?.idAsistenciaDiariaEmpleador,
          idInstanciaJudicial: expedientResult?.idInstanciaJudicial,
          idInstanciaJudicialDropDown: [],
          idMotivoDemanda: expedientResult?.idMotivoDemanda,
          idMotivoDemandaDropDown: [],
          idFaseProceso: expedientResult?.idFaseProceso,
          idFaseProcesoDropDown: [],
          noExpedienteExterno: expedientResult?.noExpedienteExterno,
          fechaUltimaAudiencia: new Date(expedientResult.fechaProximaAudiencia || Date.now()).toISOString().substring(0, 10),
          fechaProximaAudiencia: null,
          observaciones: expedientResult?.observaciones,
        });

        if (expedientResult.idInstanciaJudicial) {
          const instanciaJudicialSelected: any = this.instanciJudicialDrop.find(ij => ij.value === expedientResult.idInstanciaJudicial)
          this.fundamentoDeLaDemandaForm.patchValue({ idInstanciaJudicialDropDown: [instanciaJudicialSelected] });
        }

        if (expedientResult.idMotivoDemanda) {
          const motivoDemandaSelected: any = this.motivoDeLaDemandaDrop.find((x: any) => x.value == expedientResult.idMotivoDemanda);
          this.fundamentoDeLaDemandaForm.patchValue({ idMotivoDemandaDropDown: [motivoDemandaSelected] })
        }

        if (expedientResult.idFaseProceso) {
          const faseProcesoSelected: any = this.faseProcesalDrop.find((x: any) => x.value == expedientResult.idFaseProceso);
          this.fundamentoDeLaDemandaForm.patchValue({ idFaseProcesoDropDown: [faseProcesoSelected] })
        }

        this.validateForm()

        this.getHistoricoExpedient(expedientResult?.idExpediente);
      }

    });
  }

  validateForm() {
    if (this.fundamentoDeLaDemandaForm.valid) {
      this.accordeonService.cerrarAcordeon('flush-collapseFour')
    }
  }

  validateFundamentoDeLaDemanda() {
    if (this.fundamentoDeLaDemandaForm.valid) {
      this.showLoadingSpinner(true, "btnFundamentoDemandada");
      // return;

      const expedienteId = this.fundamentoDeLaDemandaForm.value.idExpediente;

      this.httpService.postExpediente(this.fundamentoDeLaDemandaForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.expedientResult.next(response)
          }

          this.accordeonService.cerrarAcordeon('flush-collapseFour')
          this.showLoadingSpinner(false, "btnFundamentoDemandada");

          this.getHistoricoExpedient(expedienteId)

          this.fundamentoDeLaDemandaForm.reset();
        }, (error) => {
          console.log(error)
          this.showLoadingSpinner(false, "btnFundamentoDemandada");
        }
      )
    } else {
      this.fundamentoDeLaDemandaForm.markAllAsTouched();
      return;
    }

    this.showLoadingSpinner(true, "btnFundamentoDemandada");
  }

  onInstanciaJudicialSelect(item: any) {
    this.fundamentoDeLaDemandaForm.patchValue({ idInstanciaJudicial: item.value })
  }

  onMotivoDemandaSelect(item: any) {
    this.fundamentoDeLaDemandaForm.patchValue({ idMotivoDemanda: item.value })
  }

  onFaseProcesoSelect(item: any) {
    this.fundamentoDeLaDemandaForm.patchValue({ idFaseProceso: item.value })
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
