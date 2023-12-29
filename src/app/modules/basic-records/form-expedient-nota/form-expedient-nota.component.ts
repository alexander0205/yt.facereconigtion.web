import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { BehaviorSubject } from 'rxjs';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { AccordeonOpenCloseExpedientService } from '../../shared/accordeon/accordeon-open-close-expedient.service';
import { ToastService } from '../../shared/_services/toast/toast.service';

@Component({
  selector: 'app-form-expedient-nota',
  templateUrl: './form-expedient-nota.component.html',
  styleUrls: ['./form-expedient-nota.component.css']
})
export class FormExpedientNotaComponent {
  expedientNotasForm: FormGroup;
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() user: any;
  @Input() expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);
  @Input() recordDetailId: any
  @Input() expedientCerrado: boolean
  constructor(private httpService: HttpClientService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private accordeonService: AccordeonOpenCloseExpedientService) { }

  ngOnInit(): void {

    this.expedientNotasForm = this.formBuilder.group({
      idExpediente: [0],
      idAsistenciaDiariaEmpleador: [this.recordDetailId],
      notas: ['', Validators.required],
    })
    this.loadInformationExpedient()
  }

  loadInformationExpedient() {
    this.expedientResult.subscribe(expedientResult => {
      if (expedientResult) {
        this.expedientNotasForm.setValue({
          idExpediente: expedientResult.idExpediente,
          idAsistenciaDiariaEmpleador: expedientResult.idAsistenciaDiariaEmpleador,
          notas: expedientResult.notas
        });
        this.validateForm()
      }
    }, (error) => {
      console.error('Ha ocurrido un problema: ', error);

      this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
    });
  }

  validateForm() {
    if (this.expedientNotasForm?.valid) {
      this.accordeonService.cerrarAcordeon('flush-collapseSix')
    }
  }

  validateEstadoExpedientNotas() {
    if (this.expedientNotasForm.valid) {
      this.httpService.postExpediente({ ...this.expedientNotasForm.value, idRepLocalProvinciaCatalog: this.record?.asistenciaDiaria?.idRepLocalProvinciaCatalog, }).subscribe(
        (response: any) => {
          if (response) {
            this.expedientResult.next(response);
          }
          this.accordeonService.cerrarAcordeon('flush-collapseSix')
        },
        (error) => console.log(error),
      );
    }
  }
}
