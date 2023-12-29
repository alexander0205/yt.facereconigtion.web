import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { PrimeNGConfig } from 'primeng/api';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { SweetAlertService } from 'src/app/modules/shared/_services/sweetAlert/sweet-alert.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-by-date-range-report',
  templateUrl: './by-date-range-report.component.html',
  styleUrls: ['./by-date-range-report.component.css'],
  animations: [
    trigger('warning', [
      state('show', style({
        opacity: 1,
        transform: 'scale(2)',
        display: 'inline-block'
      })),
      state('hide', style({
        opacity: 1,
        transform: 'scale(1)',
        display: 'inline-block'
      })),
      transition('show => hide', animate('800ms ease-out')),
      transition('hide => show', animate('100ms ease-in'))
    ])
  ]

})
export class ByDateRangeReportComponent implements OnInit {
  urlApi: any;
  
  constructor(private translate: TranslateService, private config: PrimeNGConfig,
    private FB: FormBuilder, public tool: ToolsService, private http: HttpClientService,
    private el: ElementRef, private location: Location, private sweet: SweetAlertService,) {

    this.urlApi = environment.api_url;
    this.translate.setDefaultLang('es');
  }
  
  byDateRangeForm: FormGroup;
  show: boolean = false;
  disableButtonGenerateReport: boolean = true;
  maxDate = moment().toDate()
  async ngOnInit() {
    this.translate.get('primeng').subscribe(res => this.config.setTranslation(res));
    this.byDateRangeForm = this.FB.group({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    }, { validator: this.fechaInicioMenorQueFin })
  }

  notFound() {
    this.show = true;
    setTimeout(() => { this.show = false }, 1000)
  }


  generateReport() {    
    if (this.byDateRangeForm.invalid) {
      this.tool.createWarning(this.byDateRangeForm, this.el).then(result => this.notFound())
    } else {
      const { startDate, endDate } = this.byDateRangeForm.value
      this.downloadReport(`ExcelReports/${this.pathValue()}?FromDate=${moment(startDate).format('MM/DD/YYYY').toString()}&ToDate=${moment(endDate).format('MM/DD/YYYY').toString()}`)      
    }
  }
  pathValue() { 
    const url: string = this.location.path();
    const ultimaBarraIndex: number = url.lastIndexOf('/');
    return url.substring(ultimaBarraIndex + 1);
  }

  fechaInicioMenorQueFin(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaInicio = control.get('startDate').value;
    const fechaFin = control.get('endDate').value;
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      return { 'fechaInvalida': true };
    } 
    return null;
  }

  validarRangoFecha()
  {
    this.disableButtonGenerateReport =this.byDateRangeForm.invalid
  }

  downloadReport(url: string) {
    this.disableButtonGenerateReport = true;
    this.showLoading(() => {
      this.disableButtonGenerateReport = false;
          this.http.downloadExcels(url).subscribe((blob: any) => {
            this.tool.downloadFile(blob, "xls", this.pathValue())
          }, error => {
            this.disableButtonGenerateReport = false;
            this.sweet.record('warning', 'Error al descargar el archivo. inténtelo mas tarde', ``, ``);
          }, () => {
            this.sweet.record('success', `Su solicitud para la generación del reporte fue exitosa`, ``, ``)
          });
    }, 'Generando Reporte')     
  }

  showLoading(Funcion: Function, title:string) {
    Swal.fire({
      title: title,
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(
      dismiss => {
        if (true) {
          Funcion();
        }
      }
    )
  }
}
