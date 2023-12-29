import { Component, OnInit } from '@angular/core';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from 'src/app/modules/shared/_models/dateFormat';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-record-history-detail',
  templateUrl: './record-history-detail.component.html',
  styleUrls: ['./record-history-detail.component.css'], providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class RecordHistoryDetailComponent implements OnInit {
  
  constructor() {}
  
  ngOnInit(): void {}

  maxCheck(event: any) {
    const { value, maxlength } = event.target;

    if (value.length > maxlength) {
      event.target.value = value.slice(0, maxlength);
    }
  }

  async typeApplicantChange() {
    try {
      let selectTypeApplicant = document.getElementById(
        'typeApplicant'
      ) as HTMLSelectElement;

      let especifiqueDrop = document.getElementById(
        'especifique'
      ) as HTMLSelectElement;

      let selected = selectTypeApplicant.selectedIndex;
      let option = selectTypeApplicant.options[selected];

      if (parseInt(option.value) == 283 || parseInt(option.value) == 284) {
        especifiqueDrop.style.display = 'block';
      } else {
        especifiqueDrop.style.display = 'none';
        option.value = null || '' || String(0);
      }
    } catch (error) {
      console.error(error);
    }

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
}

