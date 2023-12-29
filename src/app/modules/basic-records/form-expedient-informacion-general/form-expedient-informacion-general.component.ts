import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { BehaviorSubject } from 'rxjs';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { AccordeonOpenCloseExpedientService } from '../../shared/accordeon/accordeon-open-close-expedient.service';
import { ToolsService } from '../../shared/tools/tools.service';
import { ToastService } from '../../shared/_services/toast/toast.service';

@Component({
  selector: 'app-form-expedient-informacion-general',
  templateUrl: './form-expedient-informacion-general.component.html',
  styleUrls: ['./form-expedient-informacion-general.component.css'],
})
export class FormExpedientInformacionGeneralComponent {
  informacionGeneralForm: FormGroup;
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() user: any;
  @Input() expedientResult: BehaviorSubject<ExpedientResponse | null> =
    new BehaviorSubject(null);
  @Input() expedientCerrado: boolean;
  @Input() recordDetailId: any;

  constructor(
    private httpService: HttpClientService,
    private formBuilder: FormBuilder,
    private tool: ToolsService,
    private toast: ToastService,
    private accordeonService: AccordeonOpenCloseExpedientService
  ) {}

  ngOnInit(): void {
    this.informacionGeneralForm = this.formBuilder.group({
      idExpediente: [0],
      idAsistenciaDiariaEmpleador: [this?.record?.idAsistenciaDiariaEmpleador],
      fechaAlta: [new Date().toISOString().substring(0, 10)],
      demandaCorrespondeFechasAnteriores: [false],
      fechaDemandaAnterior: [new Date().toISOString().substring(0, 10)]
    });

    this.getExpediente(this.recordDetailId);
    this.loadInformationExpedient();
  }

  getExpediente(recordDetailId: number) {
    this.httpService
      .getExpedientsByAsistenciaJudicial(recordDetailId)
      .then((x) => {
        if (x) {
          const expedient = x[0];
          this.expedientResult.next(expedient);
        } else {
          this.validateInformacionGeneral();
        }
      }, (error) => {
        console.error('Ha ocurrido un problema: ', error);
  
        this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
      });
  }

  loadInformationExpedient() {
    this.expedientResult.subscribe((expedientResult) => {
      if (expedientResult) {
        this.informacionGeneralForm.setValue({
          idExpediente: expedientResult.idExpediente,
          idAsistenciaDiariaEmpleador:
            expedientResult.idAsistenciaDiariaEmpleador,
          fechaAlta: new Date(expedientResult?.fechaAlta || Date.now())
            .toISOString()
            .substring(0, 10),
          demandaCorrespondeFechasAnteriores: (expedientResult.demandaCorrespondeFechasAnteriores as any) == true ? '1' : '2', //expedientResult.demandaCorrespondeFechasAnteriores || false,
          fechaDemandaAnterior: new Date(expedientResult?.fechaDemandaAnterior || Date.now())
          .toISOString()
          .substring(0, 10),
        });
   
        this.validateForm(expedientResult);

        this.displayEspecifiqueField();
      }
    }, (error) => {
      console.error('Ha ocurrido un problema: ', error);

      this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
    });
  }

  validateForm(expedientResult: ExpedientResponse) {
    if (expedientResult?.fechaAlta) {
      this.accordeonService.cerrarAcordeon('flush-collapseOne');
    }
  }

  validateInformacionGeneral() {
    const demandaSelectValue = this.informacionGeneralForm.value.demandaCorrespondeFechasAnteriores;
    const transformValue = demandaSelectValue == '1' ? true : false;
    
    if (this.informacionGeneralForm.valid) {
      this.httpService
        .postExpediente({
          ...this.informacionGeneralForm.value,
          idRepLocalProvinciaCatalog:
            this.record?.asistenciaDiaria?.idRepLocalProvinciaCatalog,
          demandaCorrespondeFechasAnteriores: transformValue,
          fechaDemandaAnterior: this.informacionGeneralForm.value.fechaDemandaAnterior
        })
        .subscribe(
          (response: any) => {
            if (response) {
              this.expedientResult.next(response);
            }
            this.accordeonService.cerrarAcordeon('flush-collapseOne');
          },
          (error) => console.log(error)
        );
    }
  }

  public getCurrentDate(): string {
    return this.tool.getCurrentDate14();
  }

  public getMinDate(): string {
    return this.tool.getMinDate14();
  }

  displayEspecifiqueField() {
    let selectDemandaOption = document.getElementById('demandaCorrespondiente') as HTMLSelectElement;
    let especifiqueDate = document.getElementById('especifiqueDate') as HTMLElement;

    let selected = selectDemandaOption.selectedIndex;
    let option = selectDemandaOption.options[selected];

    if (parseInt(option.value) == 1) {
      especifiqueDate.style.display = 'block';
    } else {
      especifiqueDate.style.display = 'none';
    }
  }
}
