import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { AccordeonOpenCloseExpedientService } from '../../shared/accordeon/accordeon-open-close-expedient.service';
import { ToastService } from '../../shared/_services/toast/toast.service';

@Component({
  selector: 'app-form-expedient-estados',
  templateUrl: './form-expedient-estados.component.html',
  styleUrls: ['./form-expedient-estados.component.css']
})
export class FormExpedientEstadosComponent {
  expedientEstadoForm: FormGroup;
  @Input() EstadoNombre:string
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() user: any;
  @Input() expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);
  @Input() recordDetailId: any
  @Input() estadosManualExpedienteDrop: DropDownOptionModel[] = [];
  @Input() expedientCerrado:boolean;

  constructor(private httpService: HttpClientService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private accordeonService: AccordeonOpenCloseExpedientService) { }

  ngOnInit(): void {
    this.expedientEstadoForm = this.formBuilder.group({
      idExpediente: [0],
      idAsistenciaDiariaEmpleador: [this.recordDetailId],
      idEstado: ['', Validators.required],
    })
    this.loadInformationExpedient()
  }

  loadInformationExpedient() {
    this.expedientResult.subscribe(expedientResult => {
      if (expedientResult) {
        console.log("expedientResult.idEstado",expedientResult.idEstado)
        this.expedientEstadoForm.setValue({
          idExpediente: expedientResult.idExpediente,
          idAsistenciaDiariaEmpleador: expedientResult.idAsistenciaDiariaEmpleador,
          idEstado: expedientResult.idEstado
        });

        this.validateForm()
      }
    }, (error) => {
      console.error('Ha ocurrido un problema: ', error);

      this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
    });
  }

  validateForm() {
    if (this.expedientEstadoForm.valid) {
      this.accordeonService.cerrarAcordeon('flush-collapseFive')
    }
  }
  validateEstadoExpedient() {
    if (this.expedientEstadoForm.valid) {
      this.httpService.postExpediente({...this.expedientEstadoForm.value,    idRepLocalProvinciaCatalog: this.record?.asistenciaDiaria?.idRepLocalProvinciaCatalog,}).subscribe(
        (response: any) => {
          if (response) {
            this.expedientResult.next(response);
          }
          this.accordeonService.cerrarAcordeon('flush-collapseFive')
        },
        (error) => {
          console.log(error),
          this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
        },
      );
    }
  }
  get getAllExpedientNoCerrado() {
    return [...this.estadosManualExpedienteDrop].filter(x=> !`${x.text}`.toLowerCase().includes('cerrado') )
  }

}
