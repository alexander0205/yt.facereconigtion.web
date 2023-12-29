import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'el-ellipsis',
    templateUrl: './ellipsis.component.html',
    styleUrls: ['./ellipsis.component.scss']
})

export class EllipsisComponent implements OnInit {
    @Input() text: string;
    @Input() charLength: number;
    isTruncated: boolean;
    length: number;

    ngOnInit(): void {
        if(this.text) {
            if(this.text.length > this.charLength) {
                this.isTruncated = true;
                this.length = this.text.length;
            }
        }
        
    }

    toggle() {
        this.isTruncated = !this.isTruncated;
    }
}

