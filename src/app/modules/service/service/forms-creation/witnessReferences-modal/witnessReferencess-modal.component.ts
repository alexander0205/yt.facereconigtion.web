import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';

@Component({
  selector: 'app-witnessReferences-modal',
  templateUrl: './witnessReferences-modal.component.html',
  styleUrls: ['./witnessReferences-modal.component.css']
})
export class WitnessReferencesModalComponent {
  
  @Input() referenciasP: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
  
  closeModal() { this.activeModal.close('cerrado'); }
}
