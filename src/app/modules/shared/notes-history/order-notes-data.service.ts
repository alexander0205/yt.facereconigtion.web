import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesDataService {

  constructor() { }
  subject = new Subject<boolean>();

}
