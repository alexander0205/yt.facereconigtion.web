import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-response',
  templateUrl: './form-response.component.html',
  styleUrls: ['./form-response.component.css']
})
export class FormResponseComponent {
  responseForm: FormGroup;

  @Input() data: any;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.responseForm = this.formBuilder.group({
      status: new FormControl(null),
      statusText: new FormControl(null),
      fechaRegistro: new FormControl(null),
      method: new FormControl(null),
      url: new FormControl(null),
      responseType: new FormControl(null),
      headers: new FormControl(null),
      message: new FormControl(null),
      body: new FormControl(null),
      ok: new FormControl(null),
      name: new FormControl(null),
      error: new FormControl(null),
    });     
    this.load()
  }


  private async load() {
    if (this.data) { 
      const {body, headers, error, ...dataResponse } = this.data[0]
      this.responseForm.patchValue({...dataResponse
                                      ,body: JSON.stringify(JSON.parse(body), null, 2)
                                      ,headers: JSON.stringify(JSON.parse(headers), null, 2)
                                      ,error: JSON.stringify(JSON.parse(error), null, 2)})
    }
    this.responseForm.disable();
  }
}
