import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-display',
  templateUrl: './code-display.component.html',
  styleUrls: ['./code-display.component.css']
})
export class CodeDisplayComponent {
  @Input() code: string = '';
  @Input() caption: string = '';

  isCopied: boolean = false;

  onCopy() {
    this.isCopied = true;

    setTimeout(() => {
      this.isCopied = false;
    }, 2500);
  }

}