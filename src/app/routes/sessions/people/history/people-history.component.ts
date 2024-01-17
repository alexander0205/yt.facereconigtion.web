import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { PeopleService } from '@core/business/people.service';
import { Business, People } from '@core/business/interface';
import { LocalStorageService } from '@shared';
import { key } from '../../businessSelector/businessSelector.component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-people-history',
  templateUrl: './people-history.component.html',
  styleUrls: ['./people-history.component.scss'],
})
export class PeopleHistoryComponent implements OnInit {
  columns: MtxGridColumn[] = [
    {
      header: 'Name',
      field: 'name',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: 'Identification',
      field: 'identification',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: 'actions',
      field: 'operation',
      minWidth: 140,
      width: '140px',
      pinned: 'right',
      type: 'button',
      buttons: [        
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'edit action',
          click: record => this.edit(record),
        },
      ],
    },
  ];
  list: People[] = [];
  isLoading = true;

  multiSelectable = false;
  rowSelectable = true;
  hideRowSelectionCheckbox = true;
  showToolbar = false;
  columnHideable = true;
  columnSortable = true;
  columnPinnable = true;
  rowHover = false;
  rowStriped = false;
  showPaginator = true;
  expandable = false;
  columnResizable = false;

  constructor(
    private peopleService: PeopleService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRecord()
    this.isLoading = false;
  }

  async loadRecord() {
    if (this.localStorage.has(key))
    {
      const businessSelected: Business = this.localStorage.get(key)
      
      await this.peopleService.getAllByBusinessId(businessSelected._id || '').subscribe((response) => {
        this.list = response
      })
    } else {

    }
  }

  edit(value: People) {
    console.log(value)
    this.router.navigateByUrl(`/people/${value._id}`);
  }

  delete(value: any) {

  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  enableRowExpandable() {
    this.columns[0].showExpand = this.expandable;
  }

  updateCell() {
    
  }

  updateList() {
    this.list = this.list.splice(-1).concat(this.list);
  }
}
