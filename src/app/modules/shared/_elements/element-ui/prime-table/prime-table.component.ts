import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { serviceOrder } from 'src/app/modules/service/serviceOrderForm/_models/serviceOrder';
import { HttpClientService } from '../../../_services/http-client/http-client.service';
import { ButtonModel } from '../table/models/button-model';
import { TableConfigView } from '../table/models/table-config-view';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { Jsonp } from '@angular/http';
import { ToolsService } from '../../../tools/tools.service';
import { Table } from 'primeng/table';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-prime-table',
  templateUrl: './prime-table.component.html',
  styleUrls: ['./prime-table.component.css']
})
export class PrimeTableComponent implements OnInit {
  @Input() records: any[]
  @Input() cols: TableConfigView[];
  @Input() loading: boolean = true;
  @Input() hasExport: boolean = false;
  @Input() buttons: ButtonModel[] = [];
  @Input() filters: [] = []
  @Input() isEmpty: boolean = false;
  @Input() paginator: boolean = true;
  @Input() hasGlobalFilters: boolean = true
  @Input() hasIndividualFilters: boolean = true
  @Input() hasRouter: boolean = false
  @Input() notRegistersMessage: string;
  @Input() creationButton: { label: string; action: () => {} };
  @ViewChild('dt1') table: Table
  status: any[] = []
  _selectedColumns: any[];
  viewName = '';
  first = 0;

  rows = 5;
  exportColumns: any[];


  styles(index) {
    if (this.cols[index].style) {
      let style = this.cols[index].style;
      return { style };
    }
  }
  constructor(private http: HttpClientService, private datePipe: DatePipe,
    private config: PrimeNGConfig, public tool: ToolsService) {
      }
  activityValues: number[] = [0, 100];
  async ngOnInit() {


    this._selectedColumns = this.cols;
    this.exportColumns = this.cols?.map(col => ({ title: col.header, dataKey: col.field }));

  }


  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.records ? this.first === (this.records.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.records ? this.first === 0 : true;
  }


  exportPdf() {

    const doc = new jsPDF.default('landscape');
    doc.autoTable(this.exportColumns, this.records);
    doc.save('records.pdf');
  }




  getRecordsForExport() {
    const activeHeaders: { key: string; label: string }[] = this.cols
      .filter((header) => header.view.table)
      .map((x) => ({ key: x.field, label: x.header }));
    const newList = [];
    for (const record in this.records) {
      const newData = {};
      const labels = activeHeaders.map((x) => x.label);
      for (const label in labels) {
        const p = activeHeaders.find((x) => x.label === labels[label]).key;
        newData[labels[label]] = this.records.map((x) => x[p])[record];
      }
      newList.push(newData);
    }
    return newList;
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }



  mapDates() {

    let records = this.records.map((record) => {
      let r = this.cols.forEach(col => {
        if (col.format) {

          if (col.format == 'date') {
          } else {

            return record[col.field]
          }

        } else {
          return record[col.field]
        }
      })

      return r;
    })

  }

  resetTable() {
    this.table.reset();
  }
}
