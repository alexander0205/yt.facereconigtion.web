import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { DropDownOptionModel } from 'src/app/modules/shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { saveAs } from 'file-saver'
import { monthlyViolationReport } from '../../models/montlyViolationReport';
import { ordersInspectionReasons } from '../../models/ordersInspectionReasons';
import { weeklyStatisticalReport } from '../../models/weeklyStatisticalReport';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-report-layout',
  templateUrl: './report-layout.component.html',
  styleUrls: ['./report-layout.component.css'], animations: [
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
export class ReportLayoutComponent implements OnInit {
  urlApi: any;
  constructor(private http: HttpClientService, private httP: HttpClient, public formatter: NgbDateParserFormatter, private calendar: NgbCalendar,
    public tool: ToolsService, public router: Router, private route: ActivatedRoute) { 
      this.urlApi = environment.api_url;
    }
  selection: any = null
  localRep: number = null;
  reportTypes: any[]
  localReps: DropDownOptionModel[];
  montlyViolationReport: monthlyViolationReport = new monthlyViolationReport();
  ordersInspectionReasons: ordersInspectionReasons;
  weeklyStatisticalReports: weeklyStatisticalReport;
  date2: any
  hoveredDate: NgbDate | null = null;
  show: boolean = false
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  maxDate = { year: this.calendar.getToday().year, month: this.calendar.getToday().month, day: this.calendar.getToday().day }

  async ngOnInit() {
    await this.getDropdowns()
  }

  async getDropdowns() {
    this.localReps = await this.http.get<DropDownOptionModel[]>(`LocalRepresentativeProvince`).toPromise();
    this.reportTypes = await this.http.get<any[]>('TypeOfReportForm').toPromise()
  }

  onDateSelection(date: NgbDate, picker: NgbInputDatepicker,) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;


      picker.close()
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  reportSelected(code) {
    switch (code) {
      case 'REPEXCELABOG':
        this.router.navigate(['ReportPorAbogado'], { relativeTo: this.route })
        break;
      case 'REPEXCELFASEPROC':
        this.router.navigate(['ReportPorFaseProceso'], { relativeTo: this.route })
        break;
      case 'REPEXCELINSTJUDI':
        this.router.navigate(['ReportPorInstanciaJudicial'], { relativeTo: this.route })
        break;
      case 'REPEXCELMOTVISIT':
        this.router.navigate(['ReportPorMotivoVisita'], { relativeTo: this.route })
        break;
      case 'REPEXCELNACIO':
        this.router.navigate(['ReportPorNacionalidad'], { relativeTo: this.route })
        break;
      case 'REPEXCELRLT':
        this.router.navigate(['ReportPorRLT'], { relativeTo: this.route })
        break;
      case 'REPEXCELECONOM':
        this.router.navigate(['ReportPorSectorEconomico'], { relativeTo: this.route })
        break;
      default:
        break;
    }
    if (code == 1) {

    }
    else if (code == 2) {

      this.router.navigate(['reporteSemanalEstadistico'], { relativeTo: this.route })
    }
    else if (code == 3) {

      this.router.navigate(['reporteMotivosInspeccion'], { relativeTo: this.route })

    }
  }

  download(el) {
    var blob = new Blob(el, { type: "application/octetstream" })
    let contentType = 'text/csv';
    var url = window.URL || window.webkitURL;
    var link = url.createObjectURL(blob);
    var a = document.createElement("a");
    saveAs(el, 'sample.xlsx')
    a.setAttribute("download", 'sample.xlsx');
    a.setAttribute("href", link);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
