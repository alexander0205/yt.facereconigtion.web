import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: string, length: number, toggle: boolean): string {
    if(!value) return value;
    
    if(typeof value === "undefined") return value;

    if(value.length <= length) return value;

    if(!toggle) return value;

    return value.slice(0, length);
  }

}
