import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTypes } from './enums/format-types';

@Component({
  selector: 'widget-dynamic-format',
  templateUrl: './dynamic-format.component.html',
  styleUrls: ['./dynamic-format.component.css'],
})
export class DynamicFormatComponent {
  @Input() format: string;
  @Input() value: any;
  @Input() isAling = false;
  @Input() length: number;
  @Input() index: number;
  @Input() routePath: boolean;

  constructor(private router: Router) { }
  formatTypes = FormatTypes;
  charLength = 20;

  ngOnInit(): void {

  }
  valueOf(value: any): any {
    if (value && typeof value == 'object') {
      let objectProperty = '';
      value.forEach((element) => {
        objectProperty += ` ${element.itemName}:${element.childrenIds[0]}`;
      });
      return objectProperty;
    } else {
      return value;
    }
  }

  route() {
    this.router.navigate([`Casos/ordenServicio`, this.value])
  }
}
