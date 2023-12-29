import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[allowHyphens]'
  })
  export class AllowHyphensDirective {
    @HostListener('input', ['$event'])
    onInput(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value;
      
      // Reemplaza todos los caracteres que no sean guiones por una cadena vacía
      const sanitizedValue = inputValue.replace(/[^-]/g, '');
      
      // Actualiza el valor del campo de entrada con los caracteres permitidos
      inputElement.value = sanitizedValue;
    }
  }
  