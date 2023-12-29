import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { UserService } from '../auth/_services/user.service';
import { orderNotes } from '../service/serviceOrderForm/order-notes/_models/orderNotes';
import { HttpClientService } from '../shared/_services/http-client/http-client.service';
import { SweetAlertService } from '../shared/_services/sweetAlert/sweet-alert.service';
import { ToastService } from '../shared/_services/toast/toast.service';
import { ToolsService } from '../shared/tools/tools.service';
import * as _ from 'lodash';
import { NotesDataService } from '../shared/notes-history/order-notes-data.service';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {

  constructor(private fb: FormBuilder, private user: UserService, private ngbActiveModal: NgbActiveModal,
    private HttpService: HttpClientService, private sweet: SweetAlertService, private notesData: NotesDataService,
    private toast: ToastService, private ngBModal: NgbModal, private elem: ElementRef, private tool: ToolsService) { }
  serviceOrderNumber: string;
  orderNotes: orderNotes;
  orderNoteCopy: FormGroup;
  orderNotesForm: FormGroup;
  title = '';
  @Output() edit = new EventEmitter<boolean>();
  @Input() canEdit: boolean = true;
  show = false
  ngOnInit(): void {

    this.createForm()
  }

  createForm() {
    if (!this.orderNotes) {
      this.title = 'Creando Nota'
      this.orderNotesForm = this.fb.group({
        idNota: new FormControl(0),
        codigo: new FormControl(this.serviceOrderNumber),
        notaInfo: new FormControl(null, Validators.required),
        registradoPor: new FormControl(this.user.getUserData().userCode),
        modificadoPor: new FormControl(null),
        estatusRegistro: new FormControl(true),
        fechaNotificacion: new FormControl(null),
        fechaRegistro: this.currentDay,
        fechaModificacion: this.currentDay
      })
      this.orderNoteCopy = _.cloneDeep(this.orderNotesForm)

    } else {
      console.log(this.orderNotes)
      this.orderNotesForm = this.fb.group({
        idNota: new FormControl(this.orderNotes.idNota),
        codigo: new FormControl(this.orderNotes.codigo),
        notaInfo: new FormControl(this.orderNotes.notaInfo, Validators.required),
        modificadoPor: new FormControl(this.user.getUserData().userCode),
        registradoPor: new FormControl(this.orderNotes.registradoPor),
        estatusRegistro: new FormControl(this.orderNotes.estatusRegistro),
        fechaNotificacion: this.orderNotes.fechaNotificacion ? new Date(this.orderNotes.fechaNotificacion)
          .toISOString()
          .substring(0, 10) : null,
        fechaRegistro: this.orderNotes.fechaRegistro,
        registradoPorNombre: this.orderNotes.registradoPorNombre,
        modificadoPorNombre: this.orderNotes.modificadoPorNombre,
        fechaModificacion: this.currentDay
      })
    }
    // fechaAlta: new Date(_data.fechaAlta || Date.now())
    // .toISOString()
    // .substring(0, 10),
  }

  // serviceOrderNoteId: new FormControl(this.orderNotes.serviceOrderNoteId),
  //     serviceOrderNumber: new FormControl(this.orderNotes.serviceOrderNumber),
  //     serviceOrderNoteInfo: new FormControl(this.orderNotes.serviceOrderNoteInfo, Validators.required),
  //     registeredBy: new FormControl(this.orderNotes.registeredBy),
  //     modifiedBy: new FormControl(this.user.getUserData().userCode),
  //     recordStatus: new FormControl(this.orderNotes.recordStatus),
  //     registrationDate: this.orderNotes.registrationDate,
  //     registeredByName: this.orderNotes.registeredByName,
  //     modifiedByName: this.orderNotes.modifiedByName,
  //     recordModificationDate: this.currentDay
  get currentDay() {
    let date = moment().utc()
    return date
  }
  cleanForm() {
    this.orderNotesForm.reset(this.orderNoteCopy.value)
  }
  close(direct?: boolean) {
    if (direct) {
      this.ngbActiveModal.close();
    } else {
      this.tool.modalWarning().then((result) => {
        if (result.isConfirmed) {
          this.ngbActiveModal.close();
        }
      })

    }
  }


  saveNoteData() {
    if (!this.orderNotesForm.invalid) {
      if (this.orderNotes) {

        this.HttpService.update<orderNotes>(this.orderNotesForm.value, "Nota").subscribe(
          {
            next: response => {
              this.edit.emit(true);
              this.close(true);
              // this.sweet.record('success', `Registro No.${this.orderNotes.idNota}`, 'Su nota se ha actualizado correctamente', ``)
              this.sweet.record('success', 'Nota Guardada', 'Su nota se ha actualizado correctamente', ``)

              this.notesData.subject.next(true)

            },
            error: error => {
              this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible')

            }
          }
        )



      }

      else {

        this.HttpService.post<orderNotes>(this.orderNotesForm.value, "Nota").subscribe(
          {
            next: response => {
              // this.sweet.record('success', `Registro No.${response.idNota}`, 'Su nota se ha registrado correctamente', `Este registro se ha añadido a su historial de Notas`)
              this.sweet.record('success', 'Nota Guardada', 'Su nota se ha registrado correctamente', `Este registro se ha añadido a su historial de Notas`)
              this.close(true);
              this.edit.emit(true);
              this.notesData.subject.next(true)

            },
            error: error => {
              this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible')

            }
          }
        )

      }
    }
    else {
      this.tool.createWarning(this.orderNotesForm, this.elem).then(result => {
        this.notFound()
      })
    }
  }

  get stateName() {
    return this.show ? "show" : "hide";
  }

  notFound() {
    this.show = true;
    setTimeout(() => { this.show = false }, 1000)
  }

}
