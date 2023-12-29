import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDatepickerConfig, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import { ConnectionService } from 'ngx-connection-service/lib/connection-service.service';
import { Subject } from 'rxjs';

import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DropDownOptionModel } from '../_elements/element-ui/dropdown/models/dropdown-option-model';
import { SaveWarningComponent } from '../_elements/element-ui/save-warning/save-warning/save-warning.component';
import { HttpClientService } from '../_services/http-client/http-client.service';
import { ToastService } from '../_services/toast/toast.service';
import fileSaver from 'file-saver';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  InternetSubject = new Subject<boolean>();
  hasInternetConnection: boolean;

  constructor(private ngBModal: NgbModal, private connectionService: ConnectionService, private http: HttpClient, private config: NgbDatepickerConfig,
    private calendar: NgbCalendar, private toast: ToastService, private calendarS: NgbCalendar, private HttpService: HttpClientService) {
    connectionService.monitor().subscribe(con => {
      this.hasInternetConnection = con.hasNetworkConnection;
    })
  }

  disableDateJson = {
    disable: [6, 7],
    disabledDates: [
      { year: 2020, month: 8, day: 13 },
      { year: 2020, month: 8, day: 19 },
      { year: 2020, month: 8, day: 25 }
    ]
  };

  dateToObject(date: string) {
    if (date) {
      let a: any[] = date.slice(0, 10).split('-').map(x => {
        return Number(x)
      })
      return { year: a[0], month: a[1], day: a[2] };
    }
    return null
  }
  formatDate(dateStr: string): string {
    let dateParts = dateStr.split("-");
    return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
  }

  shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return true;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return true;
      }
    }

    return false;
  }

  currentDay() {
    let date = moment().format('YYYY-MM-DD')
    return date
  }
  createWarning(form, elemRef: ElementRef) {

    const ngmodalinspectionReport: NgbModalRef = this.ngBModal.open(
      SaveWarningComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false, centered: true
    });
    ngmodalinspectionReport.componentInstance.form = form;
    ngmodalinspectionReport.componentInstance.labels = elemRef.nativeElement.querySelectorAll('.form-label');
    return ngmodalinspectionReport.result;
  }

  createPendingWarning(pending: string[], subTittle?: string, title?: string) {

    const ngmodalinspectionReport: NgbModalRef = this.ngBModal.open(
      SaveWarningComponent, {
      size: 'lg', backdrop: 'static',
      keyboard: false, centered: true
    });
    ngmodalinspectionReport.componentInstance.pending = pending;
    ngmodalinspectionReport.componentInstance.subTitle = subTittle;
    ngmodalinspectionReport.componentInstance.title = title
    return ngmodalinspectionReport.result;
  }
  stateName(show) {
    return show ? "show" : "hide";
  }

  JsonToObject(json: string) {

    if (json) {
      let res: DropDownOptionModel[] = JSON.parse(json);
      return res.map(item => {
        return {
          value: Number(item.value),
          text: item.text
        }
      });
    }
    return null
  }

  getMinDate(subsDays: number) {
    return {
      year: this.calendarS.getPrev(this.calendarS.getToday(), 'd', subsDays).year,
      month: this.calendarS.getPrev(this.calendarS.getToday(), 'd', subsDays).month,
      day: this.calendarS.getPrev(this.calendarS.getToday(), 'd', subsDays).day
    }
  }
  createSwalModal(title: string, text: string, icon: SweetAlertIcon, cancel?: boolean, confirmText?: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: cancel == false ? false : true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText || 'Sí',
      cancelButtonText: 'No'

    })
  }
  modalWarning() {
    return Swal.fire({
      title: '¿Está seguro que deseas salir del formulario?',
      text: "Toda su informacion se perdera",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1460B8',
      cancelButtonColor: '#F14F56',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'

    })
  }

  changesWarning() {
    return Swal.fire({
      title: 'Se realizaron nuevos cambios, ¿Esta seguro que desea salir?',
      text: "Se perdaran todos lo cambios",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'

    })
  }
  findInvalidControls(form: FormGroup) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  download(binaryData: ArrayBuffer, fileType: string, fileName: string): void {
    const file: Blob = new Blob([binaryData], { type: fileType });
    const url: string = window.URL.createObjectURL(file);
    const anchorElement: HTMLAnchorElement = document.createElement('a');
    anchorElement.download = fileName;
    anchorElement.href = url;
    anchorElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }

  downloadFile(binaryData: Blob, fileType: string, fileName: string): void {
    const url = window.URL.createObjectURL(binaryData);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${fileType}`; // Nombre del archivo descargado
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadFileGeneric(binaryData: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(binaryData);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}`; // Nombre del archivo descargado
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadPdf(url) {
    // return this.http.get(url, {
    //   responseType: 'arraybuffer',
    //   headers: new HttpHeaders().append('Content-Type', 'application/pdf'),
    // });
    fileSaver.saveAs(url, 'test.pdf')
    fileSaver.saveAs("https://httpbin.org/image", "image.jpg");
  }

  removeValidators(form: FormGroup) {
    const controls = form.controls;
    for (const name in controls) {

      controls[name].clearValidators();
      controls[name].updateValueAndValidity()
    }
  }

  getListedItems(objects: any[]) {
    return objects.map((item) => { return item['value'] }).join(',')
  }

  isDisabled = (
    date: NgbDateStruct
  ) => {
    return this.disableDateJson.disabledDates.find(x =>
      (new NgbDate(x.year, x.month, x.day).equals(date))
      || (this.disableDateJson.disable.includes(this.calendar.getWeekday(new NgbDate(date.year, date.month, date.day))))
    )
      ? true
      : false;
  };


  buildSearch(forms: Object, modal?: NgbActiveModal) {
    let query = ''

    Object.keys(forms).forEach(el => {


      if (Array.isArray(forms[el]) && forms[el]) {

        query += `&${el}=${this.getListedItems(forms[el])}`;

      }
      else if (forms[el]) {
        if (typeof (forms[el]) == 'object') {
          const dateObj = forms[el]

          const date = `${dateObj['year']}-${dateObj['month']}-${dateObj['day']}`
          query += `&${el}=${date}`
        } else {

          query += `&${el}=${forms[el]}`
        }

      }
    })
    return modal ? modal.close(query) : query
  }


  buildSearchwithForm(forms: FormGroup[], modal: NgbActiveModal) {
    let query = ''

    forms.forEach((form: FormGroup) => {
      const controls = form.controls;

      for (const control in controls) {

        if (Array.isArray(controls[control]?.value) && controls[control]?.value) {

          query += `&${control}=${this.getListedItems(controls[control]?.value)}`;

        }

        else if (controls[control]?.value) {
          if (typeof (controls[control]?.value) == 'object') {
            const dateObj = controls[control]?.value

            const date = `${dateObj['year']}-${dateObj['month']}-${dateObj['day']}`
            query += `&${control}=${date}`
          } else {

            query += `&${control}=${controls[control].value}`
          }

        }
      }
    })
    modal.close(query)


  }
  dateValidator(control: AbstractControl) {

    if (typeof control.value == 'object' && control.value && control.value.year.toString().length == 4) {

      let date = `${control.value.year}/${control.value.month}/${control.value.day}`
      let momentDate = moment(date);

      let dayOfWeek = momentDate.day()

      let isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
      if (isWeekend) {

        return { weekends: true }
      }
      return null
    }

  }

  setFilterLS(name, filter) {
    localStorage.setItem(name, filter);
  }
  getFilterLS(name) {
    return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : null
  }
  cleanFilterLS(name) {
    localStorage.removeItem(name);
  }

  deactivateFilter(name) {
    if (localStorage.getItem(name)) {
      let form = JSON.parse(localStorage.getItem(name))
      let filter = { ...form, active: false }
      localStorage.setItem(name, JSON.stringify(filter))
    } else { }

  }

  activateFilter(name) {
    if (localStorage.getItem(name)) {
      let form = JSON.parse(localStorage.getItem(name))
      let filter = { ...form, active: true }
      localStorage.setItem(name, JSON.stringify(filter))
    } else { }

  }
  getQueryFromLS(name) {
    let form = this.getFilterLS(name).form;

    return this.buildSearch(form)
  }

  cleanFilterForm(filterForm: string, fields: Object) {
    let filter = this.getFilterLS(filterForm);
    let form = { ...filter.form, ...fields }
    let cleanForm = { ...filter, ...{ form: form } }
    this.setFilterLS(filterForm, JSON.stringify(cleanForm))
  }

  hasFormAnyValue(form: Object) {
    let values: any[] = [];
    Object.keys(form).forEach(key => {
      if (form[key]) {
        values.push(form[key])
      }
    })
    return values.length !== 0 ? true : false
  }


  dateVerification(form: FormGroup, control: string, date: any) {

    if (typeof date === 'object') {
      if (date['year'].toString().length == 4 && date['month'].toString().length <= 2 && date['day'].toString().length <= 2) {

        if (form.get(control).invalid && form.get(control).errors?.weekends) {
          this.toast.error('No puedes seleccionar dias no laborables o fuera del rango aceptado', 'fecha incorrecta')
        }
      }
    }
  }

  objToDate(date: any) {

    return new Date(date['year'], date['month'] - 1, date['day']).toLocaleDateString("en-US")
  }

  public openPDF(element: any): void {


    html2canvas(element, {
      windowHeight: window.outerHeight,
      windowWidth: window.outerWidth,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY
    }).then(canvas => {
      let imgData = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', [canvas.width, canvas.height]);

      let imgProps = pdf.getImageProperties(imgData);
      let pdfWidth = pdf.internal.pageSize.getWidth();
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('dashboard.pdf');
    });
    // html2canvas(element.nativeElement).then(canvas => {

    //     let fileWidth = 360;
    //     let fileHeight = (canvas.height * (fileWidth - 100) / canvas.width) + 60;

    //     const FILEURI = canvas.toDataURL('image/png')
    //     let PDF = new jsPDF('p', 'mm', 'a4');
    //     let position = 0;
    //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

    //     PDF.save('angular-demo.pdf');
    //   });
    // })
  }



  showLoading(url: string) {
    Swal.fire({
      title: 'Generando Reporte',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(
      dismiss => {
        if (true) {
          saveAs(url);
        }
      }
    )
  };

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public getCurrentDate14(): string {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }

  public getMinDate14(): string {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 14);
    return currentDate.toISOString().split('T')[0];
  }

  /**
   *
   * @param header ['Header 1', 'Header 2', 'Header 3']
   * @param data [ ['John Doe', 30, 'john.doe@example.com'] ]
   */
  exportToExcel(header: string[], data: string[][], fileName: string) {
    const exportData = [header, ...data];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, fileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  downLoadAttachedFile(idArchivo: any) {
    this.HttpService.getFileAttached(idArchivo).subscribe((response: any) => {
      this.HttpService.downloadAttachedFile(response.idArchivo).subscribe((blobResponse: any) => {
        if (blobResponse instanceof Blob) {

          this.downloadFileGeneric(blobResponse, response.nombreArchivo)
        } else {
          console.error('La respuesta no es un Blob válido.');
        }
      })
    })
  }
}
