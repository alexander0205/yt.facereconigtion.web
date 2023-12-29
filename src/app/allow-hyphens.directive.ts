import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowHyphens]'
})
export class AllowHyphensDirective {

  constructor() { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value.replace(/[^a-zA-Z0-9-]/g, '');
    input.value = newValue;
  }
}
