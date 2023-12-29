import { Component, Input, OnInit } from '@angular/core';
import { DropDownOptionModel } from '../dropdown/models/dropdown-option-model';

@Component({
  selector: 'app-prime-dropdown',
  templateUrl: './prime-dropdown.component.html',
  styleUrls: ['./prime-dropdown.component.css']
})
export class PrimeDropdownComponent implements OnInit {
  @Input() options: Array<DropDownOptionModel>;
  constructor() { }

  ngOnInit(): void {
  }

}
