
import { Directive, ElementRef, Renderer2, OnInit, Input, HostListener } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Directive({
    selector: '[dateMask]'
})
export class dateMaskDirective implements OnInit {
    @Input() appMaskValue: string;
    @Input() fControl: AbstractControl
    private navigationKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'Home',
        'End',
        'ArrowLeft',
        'ArrowRight',
        'Clear',
        'Copy',
        'Paste',
    ];
    constructor(
        private elRef: ElementRef,
        private renderer: Renderer2
    ) { }
    ngOnInit(): void {
    }
    @HostListener('input', ['$event'])
    handleInput(event: KeyboardEvent) {
        if (this.appMaskValue && (this.appMaskValue.length === 10)) {
        }

    }
    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (this.appMaskValue && (this.appMaskValue.length === 10)) {

        }
        if (this.appMaskValue && (this.appMaskValue.length === 2 || this.appMaskValue.length === 5) && event.key !== 'Backspace') {
            this.renderer.setProperty(this.elRef.nativeElement, 'value', this.appMaskValue + '/');
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (
            // Allow: Delete, Backspace, Tab, Escape, Enter, etc
            this.navigationKeys.indexOf(e.key) > -1 ||
            (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
            (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
            (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
            (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
            (e.key === 'a' && e.metaKey === true) || // Cmd+A (Mac)
            (e.key === 'c' && e.metaKey === true) || // Cmd+C (Mac)
            (e.key === 'v' && e.metaKey === true) || // Cmd+V (Mac)
            (e.key === 'x' && e.metaKey === true) // Cmd+X (Mac)
        ) {
            return;  // let it happen, don't do anything
        }
        // Ensure that it is a number and stop the keypress
        if (e.key === ' ' || isNaN(Number(e.key))) {
            e.preventDefault();
        }
    }


    @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
        e.preventDefault();
    }
}