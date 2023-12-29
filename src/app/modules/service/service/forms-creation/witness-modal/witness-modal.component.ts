import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';

@Component({
  selector: 'app-witness-modal',
  templateUrl: './witness-modal.component.html',
  styleUrls: ['./witness-modal.component.css']
})
export class WitnessModalComponent {
  
  @Input() testigosR: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
  
  closeModal() { this.activeModal.close('cerrado'); }
}
