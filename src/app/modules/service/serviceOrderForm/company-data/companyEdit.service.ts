import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class companyEdit {

    constructor() { }
    subject = new Subject<boolean>();
}
