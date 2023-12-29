import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { user } from 'src/app/modules/auth/_models/User';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { NgbDateCustomParserFormatter } from 'src/app/modules/shared/_models/dateFormat';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { chartsData } from '../../components/models/chartData';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],

  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class DashboardLayoutComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  constructor(public userService: UserService, private http: HttpClientService, private FB: FormBuilder, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, public tools: ToolsService, private userS: UserService) {
    this.currentUser = this.userService.getUserData() as user
    this.fromDate = calendar.getPrev(calendar.getToday(), 'm', 1)
    this.toDate = calendar.getToday();

  }
  layerValue: string;
  maxDate = { year: this.calendar.getToday().year, month: this.calendar.getToday().month, day: this.calendar.getToday().day }
  // localReps: any[] = []
  localReps: any
  repLocalCode: number = null
  export: number = null
  isloading: boolean = true
  user = this.userS.getUserData() as user
  chartData: chartsData;
  pieStatus: any[];
  currentUser: user;
  isSupervisorOrHigher: boolean;
  rltId: number = null;
  rltCode: any;
  codeRlt:any;

  locaLayer: any;

  rltList: any;

  async ngOnInit() {

    console.log(this.user);

    this.checkRole()
    
    this.getLoggedUserRLT(this.user.repLocalProvId)

    //Abogado, paralegal, representante, solo cambian la fecha
    // director, coordinador, encargado y admin, pueden cambiar rlt, fecha y abogados

    if (this.currentUser.roleCode === 'PLEGA' || this.currentUser.roleCode === 'ABOG') {
      let selectLayer = document.getElementById('layerDropdown') as HTMLSelectElement;
      let selectRlt = document.getElementById('rltColumn') as HTMLSelectElement;
      let layerDropdownColumn = document.getElementById('layerColumn') as HTMLElement;
      
      selectLayer.disabled = true;
      
      selectRlt.remove();
      layerDropdownColumn.remove();
    }

    if (this.currentUser.roleCode === 'REPLO') {
      let selectLayer = document.getElementById('layerDropdown') as HTMLSelectElement;
      let selectRlt = document.getElementById('localRepDropDown') as HTMLSelectElement;

      selectLayer.disabled = false;
      selectRlt.disabled = true;

      this.http.getLayerByRepresentativeLocal(this.currentUser.repLocalProvId).subscribe(resultado => this.locaLayer = resultado)
      this.http.getRltById(this.currentUser.repLocalProvId).subscribe(resultado => {
        this.localReps = resultado; console.log(this.localReps);
      })
    }

    if (this.currentUser.roleCode === 'COOR') {
      let selectLayer = document.getElementById('layerDropdown') as HTMLSelectElement;
      let selectRlt = document.getElementById('localRepDropDown') as HTMLSelectElement;

      selectLayer.disabled = false;
      selectRlt.disabled = false;
    }

    if (this.currentUser.roleCode === 'ENCA') {
      let selectRlt = document.getElementById('localRepDropDown') as HTMLSelectElement;

      selectRlt.disabled = false;
    }

    this.repLocalCode = this.rltCode;

    setTimeout(() => this.fetchData(), 2000);
  }


  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  async findLayerByRlt() {
    const rltId = this.repLocalCode

    this.http.getRlt().subscribe((data: any) => {
      const codeToSend = rltId;
      const value = this.getValueByCode(data, codeToSend.toString());

      if (value !== undefined) {
        this.http.getLayerByRepresentativeLocal(value).subscribe(response => {
          var localLayer = response;
          this.locaLayer = localLayer
        })
      } else {
        console.log('No encontrado');
      }
    });
  }

  getValueByCode(data: any[], code: string): number | undefined {
    const foundItem = data.find((item: any) => item.code === code);
    return foundItem ? foundItem.value : undefined;
  }

  onDateSelection(date: NgbDate, picker: NgbInputDatepicker) {
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

  checkRole() {
    if (this.currentUser.roleCode !== 'DIR' &&
      this.currentUser.roleCode !== 'INSP' &&
      this.currentUser.roleCode !== 'ENCA' &&
      this.currentUser.roleCode !== 'ADM' &&
      this.currentUser.roleCode !== 'ABOG' ) {
      this.isSupervisorOrHigher = true
    }
    else {
      this.isSupervisorOrHigher = false
    }
  }

  async fetchData() {
    this.isloading = true;
    const abogadoSelect = (this.layerValue && `${this.layerValue}`.toString() !== "0" ? `&IdAbogado=${this.layerValue}` : '')
    const custProviciaCode = `&ProvinceCode=${this.codeRlt}`;

    if (this.currentUser.roleCode === 'ABOG' || 
        this.currentUser.roleCode === 'PLEGA' ||
        this.currentUser.roleCode === 'REPLO') {
      this.chartData = await this.http.get<chartsData>(`DashBoard?FromDate=${this.tools.objToDate(this.fromDate)}&ToDate=${this.tools.objToDate(this.toDate)}${abogadoSelect}`).toPromise()
    } else {
      this.chartData = await this.http.get<chartsData>(`DashBoard?FromDate=${this.tools.objToDate(this.fromDate)}&ToDate=${this.tools.objToDate(this.toDate)}${custProviciaCode}${abogadoSelect}`).toPromise()
    }


    this.isloading = false;
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
  exportToPdf() {
    this.showLoading('Descarga en curso');

    let data = document.getElementById('contentToConvert');

    this.tools.openPDF(data)
  }

  getLoggedUserRLT(userRLT: any) {
    this.http.getLocalRepresentativeProvince().subscribe((response: any) => {
      this.localReps = response;

      this.rltCode = this.localReps.find(lr => lr.value == userRLT);
      this.codeRlt = this.rltCode.code;
    })
  }



  showLoading(title:string) {
    Swal.fire({
      title: title,
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading();
      }
    })
  }
}
