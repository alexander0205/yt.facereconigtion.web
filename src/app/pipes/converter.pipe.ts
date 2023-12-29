import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
    name: 'filterUnique',
    pure: false
})
  export class FilterPipe implements PipeTransform {
  
    transform(value: any, args?: any): any {
      // Remove the duplicate elements
      let uniqueArray = value.filter(function (el, index, array) { 
        return array.indexOf (el) == index;
      });
  
      return uniqueArray;
    }
  }

@Pipe({name:'converter'})
export class ConverterPipe implements PipeTransform{
    transform(value:any, by:any){
        let value_one:number = parseInt(value);
        let value_two: number = parseInt(by);

        let result = "The Multiplication: " + value_one + " X " + value_two + " = " + (value_one * value_two);

        return result;
    }
}