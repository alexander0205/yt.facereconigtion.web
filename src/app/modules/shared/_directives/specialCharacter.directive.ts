
import { Directive, HostListener, ElementRef, Input, forwardRef } from '@angular/core';
import { AbstractControl, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: `input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControlName],
    input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControl],
    input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[ngModel],
    textarea:not([readonly]):not(.ng-trim-ignore)[formControlName],
    textarea:not([readonly]):not(.ng-trim-ignore)[formControl],
    textarea:not([readonly]):not(.ng-trim-ignore)[ngModel],
    :not([readonly]):not(.ng-trim-ignore)[ngDefaultControl]’
    `,
})
export class SpecialCharacterDirective {

    regexStr = '^[a-zA-Z0-9_,./@\\- ]*$';
    @Input() isAlphaNumeric: boolean;
    @Input() fControl: AbstractControl
    @Input() allowSpecial: boolean = false;
    constructor(private el: ElementRef) { }
    @HostListener("blur", ['$event.target.value'])
    onBlur(val: string) {



        this.writeValue(val.trim());

    }
    @HostListener('keypress', ['$event']) onKeyPress(event) {

        if (!this.allowSpecial) { return new RegExp(this.regexStr).test(event.key) }
    }
    @HostListener('input', ['$event']) onValueChange(event) {

        return (event.target.value.length == 1 && (event.target.value !== ' '))
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        //  let value = event.target.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
        
        setTimeout(() => {

            // if (this.fControl) { this.fControl.setValue(this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '')) }
            if (this.fControl) { this.fControl.setValue(this.el.nativeElement.value.replace(/[^A-Za-z0-9,./@ ]/g, '').replace('insert', '').replace('delete', '').replace('update', '').replace('where', '').replace('from', 'de')) }
            event.preventDefault();
        }, 1)
        //  this.fControl.setValue(this.el.nativeElement.value.replace(this.regexStr, '').replace(/\s/g, ''))

    }

    writeValue(value: any): void {
        if (value) {

            if (typeof value === 'string') {
                if (!value.replace(/\s/g, '').length) {
                    this.fControl?.setValue(null);
                    this.fControl?.markAsDirty({ onlySelf: true })

                }
                else {
                    if (this.fControl) {

                        this.fControl.setValue(this.fControl?.value.trim())
                    }
                }
            }
        } else {
            this.fControl?.setValue(null);
        }

    }

}