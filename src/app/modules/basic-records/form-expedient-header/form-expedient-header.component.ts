import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-form-expedient-header',
  templateUrl: './form-expedient-header.component.html',
  styleUrls: ['./form-expedient-header.component.css']
})
export class FormExpedientHeaderComponent {

  @Input() AbogadoPrincipal: string
  @Input() AbogadoAlternoNombre: string
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() expedientCerrado:boolean
}
