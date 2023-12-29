import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { TreeNode } from 'primeng/api';
import * as FS from 'file-saver'
import { ToolsService } from '../../../tools/tools.service';
import { SirlaFiles } from 'src/app/modules/service/serviceOrderForm/_models/SirlaFiles.service';


@Component({
  selector: 'app-tree-files',
  templateUrl: './tree-files.component.html',
  styleUrls: ['./tree-files.component.css']
})
export class TreeFilesComponent implements OnInit {
  @Input() files: any[] = [];
  @Output() getformInfo = new EventEmitter<SirlaFiles>();

  treeFiles: TreeNode[];
  hasRecords:boolean = false;
  records: any[];
  loading: boolean = true;
  customButtons: { class: string; function: (record: SirlaFiles) => Promise<void>; tooltip: string; icon: string; }[];
  history: any;
  filters: string[];
  cols: ({ field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color: string; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; hasMulti: any; multiFilter: { options: any; text: string; }; color?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; length: number; tooltip: string; fixedColumn: boolean; style: string; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; })[];
 

  constructor(private tool: ToolsService) {

  }

  ngOnInit(): void {

    this.getRecordFiles()
  }


  getRecordFiles(){
    this.records = [];
    this.loading = true;
    this.customButtons = [
      {
        class: "p-button-rounded p-button-info css-label-btn-grid px-2 me-2",
        
        function: async (records: SirlaFiles) => {
            this.getformInfo.emit(records);
        },
        tooltip: 'Ver documento',
        icon: 'pi pi-file btnShowSirlaFile',
         
      },      
      
      // {
      //   class: "p-button-rounded btn-light css-label-btn-grid px-2 me-2",
        
      //   function: async (sirlaFiles: SirlaFiles) => {

      //     this.tool.downloadPdf(sirlaFiles.root)
  
      //   },
      //   tooltip: 'Descargar documento',
      //   icon: 'pi pi-download',
         
      // },
    
    ];
  
    this.history    
      {

          
        if(this.files.length > 0){
          this.records = this.files;
          if(this.records.length > 0) this.hasRecords = true;
          this.loading = false;
  
        }else{
          this.records = []
          this.loading = false
          this.hasRecords = false;
        }

      }
     
    this.filters = ["formName","formTypeName", "formPeriod"]
    this.cols = [
   
      {
        field: 'formName',
        header: 'NOMBRE FORMULARIO',
        view: { table: true, detail: true },
  
        tooltip: 'NOMBRE FORMULARIO',
        fixedColumn: true,
        color: "#1460B8",
      },
      {
        field: 'formTypeName',
        view: { table: true, detail: true },
        header: 'TIPO FORMULARIO',
  
        tooltip: 'TIPO FORMULARIO',
        fixedColumn: true,
  
      },  
      {
        field: 'formPeriod',
        header: 'PERÍODO',
        view: { table: true, detail: true },
  
        tooltip: 'PERÍODO',
        fixedColumn: true,
  
      },           
             
  
    ]


  }
  
}
