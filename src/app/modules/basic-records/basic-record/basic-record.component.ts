import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-record',
  templateUrl: './basic-record.component.html',
  styleUrls: ['./basic-record.component.css']
})
export class BasicRecordComponent {

  constructor(private router: Router) {}

  ngOnInit() {}

  routeToRecords() {}

  active() {
    return (
      (this.router.url).search('asistenciaJudicial') || 
      (this.router.url).search('crearExpediente') 
      )!== -1 ? true : false;
  }
}
