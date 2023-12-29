import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.component.html',
  styleUrls: ['./form-request.component.css']
})
export class FormRequestComponent {
  requestForm: FormGroup;
  usuarioDrop: any[] = [];

  @Input() data: any;

  constructor(
    private HttpService: HttpClientService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.requestForm = this.formBuilder.group({
      usuarioId: new FormControl(null),
      fechaRegistro: new FormControl(null),
      method: new FormControl(null),
      url: new FormControl(null),
      urlWithParams: new FormControl(null),
      responseType: new FormControl(null),
      headers: new FormControl(null),
      params: new FormControl(null),
      body: new FormControl(null),
    });
    this.getUsuario();      
    this.load()
  }


  private async load() {
    if (this.data) {
      const {fechaRegistro, params, body, headers, ...datarequest } = this.data
      this.requestForm.patchValue({...datarequest
                                    , fechaRegistro: this.datePipe.transform(fechaRegistro, 'yyyy-MM-dd HH:mm:ss')
                                    ,params: JSON.stringify(JSON.parse(params), null, 2)
                                    ,body: JSON.stringify(JSON.parse(body), null, 2)
                                    ,headers: JSON.stringify(JSON.parse(headers), null, 2)})
    }
    this.requestForm.disable();
  }

  getUsuario() {
    this.HttpService.get<any[]>('User/UsersDropDown?status=true').subscribe((data) => {
      this.usuarioDrop = data;
    });
  }

  onCopySuccess() {
    console.log('Código copiado con éxito');
  }
}
