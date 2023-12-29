import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, forkJoin, throwError } from 'rxjs';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { AsistenciaDiariaEmpleadorResponse } from '../../shared/_services/http-client/types/AsistenciaDiariaEmpleadorResponse';
import { UserService } from '../../auth/_services/user.service';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { catchError, map } from 'rxjs/operators';
import { ExpedienteCierreArchivoResponse } from '../../shared/_services/http-client/types/ExpedientFileResponse';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { user } from '../../auth/_models/User';
import { ToastService } from '../../shared/_services/toast/toast.service';
import { ToolsService } from '../../shared/tools/tools.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-close-expedient-modal',
  templateUrl: './close-expedient-modal.component.html',
  styleUrls: ['./close-expedient-modal.component.css']
})
export class CloseExpedientModalComponent {
  cerrarExpedientForm: FormGroup;
  closeExpedientFormApprove: FormGroup;

  @Input() estadosManualExpedienteDrop: DropDownOptionModel[] = [];
  @Input() expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);
  @Input() record: AsistenciaDiariaEmpleadorResponse;
  @Input() user: any;
  @Input() estadoExpediente: string;
  @Input() EstadoNombre: string
  @Input() expedientCerrado: boolean
  motivoCierreDrop: DropDownOptionModel[] = [];
  archivosDesdeElApi: [] = []
  showBotonGuardar: boolean
  showFormSolicitudExpediente: boolean
  expedientCierre: any

  constructor(private httpService: HttpClientService,
    private formBuilder: FormBuilder,
    private sweet: SweetAlertService,
    private router: Router,
    private modalService: NgbModal,
    private toast: ToastService,
    public ngbActiveModal: NgbActiveModal,
    public userS: UserService, private tool: ToolsService) { }

  ngOnInit(): void {
    this.calendar();

    this.user = this.userS.getUserData() as user;

    this.cerrarExpedientForm = this.formBuilder.group({
      idExpedienteCierre: [0],
      idExpediente: [this.expedientResult.value.idExpediente],
      idUsuarioSolicitud: [this.user?.userId],
      fechaSolicitud: [new Date().toISOString().substring(0, 10)],
      idMotivoCierre: ['', Validators.required],
      observacionSolicitud: [''],
      sumaPagada: [0],
      files: this.formBuilder.array([])
    })
    this.getMotivoCierre()
    
    this.closeExpedientFormApprove = this.formBuilder.group({
      idExpedienteCierre: [0],
      observacionAccion: ['', Validators.required],
      idUsuarioSolicitud: [this.user?.userId],
      fechaAccion: [new Date().toISOString().substring(0, 10)],
      estado: [''],

    });

    this.loadShowExpedientSaveBottom()
    this.loadShowSoliciduExpedienteBottom()
    this.loadExpedienteCierre()
  }
  loadExpedienteCierre() {
    const expedienteCierre = this.expedientResult?.value?.expedienteCierre
    if (expedienteCierre) {
      this.loadExpedienteCierreData(expedienteCierre?.idExpedienteCierre)
      this.cerrarExpedientForm.get('idExpedienteCierre').setValue(expedienteCierre?.idExpedienteCierre);
      this.cerrarExpedientForm.get('idUsuarioSolicitud').setValue(expedienteCierre?.idUsuarioSolicitud);
      this.cerrarExpedientForm.get('fechaSolicitud').setValue(new Date(expedienteCierre?.fechaSolicitud || Date.now()).toISOString().substring(0, 10));
      this.cerrarExpedientForm.get('idMotivoCierre').setValue(expedienteCierre?.idMotivoCierre);
      this.cerrarExpedientForm.get('observacionSolicitud').setValue(expedienteCierre?.observacionSolicitud);
      this.cerrarExpedientForm.get('sumaPagada').setValue(expedienteCierre?.sumaPagada);

      this.closeExpedientFormApprove.get('idExpedienteCierre').setValue(expedienteCierre?.idExpedienteCierre);
      this.closeExpedientFormApprove.get('fechaAccion').setValue(new Date(expedienteCierre?.fechaAccion || Date.now()).toISOString().substring(0, 10));
      this.closeExpedientFormApprove.get('observacionAccion').setValue(expedienteCierre?.observacionAccion || "");
      this.closeExpedientFormApprove.get('estado').setValue(expedienteCierre?.estado || "");

      this.loadExpedientFiles(expedienteCierre?.idExpedienteCierre);
    }
  }

  get mostrarAccionDelDirectorAlAbogado() {
    if (this.expedientResult?.value?.expedienteCierre
      && this.expedientResult?.value?.expedienteCierre?.estado) {
      return true
    }

    return false
  }

  get mostrarAprobarDeclinarParaDirector() {
    if (this.expedientResult?.value?.expedienteCierre
      &&
      this.expedientResult?.value?.expedienteCierre?.estado
    ) {
      return false
    }
    return true
  }

  expedientIsWaitingForAction = false;

  loadShowExpedientSaveBottom() {
    if (this.userS.user.roleCode == 'ENCA') {
      this.showBotonGuardar = false;
    }
    else if (this.expedientResult.value.estado.codigoReferencia != 'CERR') {
      if (this.expedientResult?.value?.expedienteCierre && !this.expedientResult?.value?.expedienteCierre?.estado) {
        this.showBotonGuardar = false;
        this.expedientIsWaitingForAction = true;
      } else {
        this.showBotonGuardar = true;
      }

    }
    else {
      this.showBotonGuardar = false;
    }
  }

  loadShowSoliciduExpedienteBottom() {
    if (this.userS.user.roleCode == 'ENCA' && this.expedientResult.value.estado.codigoReferencia === 'SOLCIE') {
      this.showFormSolicitudExpediente = true;
    } else {
      this.showFormSolicitudExpediente = false;
    }
  }
  loadExpedienteCierreData(id: string) {
    this.httpService.getExpedienteCierre(id).subscribe((data) => {
      this.expedientCierre = data
    })
  }

  loadExpedientFiles(idExpediente: number): void {
    this.httpService.getExpedientCierreArchivo(idExpediente)
      .then((expedientFiles: ExpedienteCierreArchivoResponse[]) => {
        if (expedientFiles) {
          this.clearFiles(); // Limpiar los archivos actuales antes de cargar los nuevos
          this.archivosDesdeElApi = this.files as any
          expedientFiles.forEach((file: ExpedienteCierreArchivoResponse) => {
            const fileGroup = this.createFileGroup();
            fileGroup.get('comentario').setValue(file.descripcion);
            fileGroup.get('file').setValue({
              name: file.archivo?.nombreArchivo || '',
              idArchivo: file.archivo?.idArchivo,
              idExpedienteCierreArchivo: file?.idExpedienteCierreArchivo
            });
            this.files.push(fileGroup);
          });
          this.archivosDesdeElApi = Object.assign({}, this.files) as any

        }
      })
      .catch((error) => console.error('Error al cargar los archivos del expediente: ', error));
  }


  clearFiles(): void {
    while (this.files.length !== 0) {
      this.files.removeAt(0);
    }
  }

  getMotivoCierre() {
    this.httpService.get<any[]>('ExpedientReasonOfClosure').subscribe((data) => {
      this.motivoCierreDrop = data;
    });
  }

  validateCerrarExpedient() {
    if (!this.cerrarExpedientForm.valid) {
      this.cerrarExpedientForm.markAllAsTouched();
    }
  }

  createFileGroup(): FormGroup {
    return this.formBuilder.group({
      comentario: [''],
      file: [null]
    });
  }

  addFileGroup(): void {
    this.files.push(this.createFileGroup());
  }

  onFileSelect(event, index) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.files.at(index).get('file').setValue(file);
    }
  }

  deleteFileGroup(index: number): void {
    this.files.removeAt(index);
  }

  get files(): FormArray {
    return this.cerrarExpedientForm.get('files') as FormArray;
  }

  submitFormApprove(estado: string): void {
    if (this.closeExpedientFormApprove.valid) {
      this.httpService.postExpedienteCierre({
        ...this.closeExpedientFormApprove.value,
        estado,
        idUsuarioAccion: this.user?.userId
      }).subscribe(
        async (response: any) => {
          return this.sweet.record('success', `Solicitud Cierre Actualizada`,
            `Su solicitud ha sido actualizada exitosamente.`,
            `Puede ir a la pantalla de historial para ver modificar los datos.`).then(x => {
              this.ngbActiveModal.close(true)
              setTimeout(() => {
                this.router.navigateByUrl('/Expedientes/historial')
              }, 200)
            })
        }, (error) => {
          console.error(error);
          this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible')
        }
      );
    }
  }

  submitForm(): void {

    if (this.cerrarExpedientForm.invalid) {
      this.cerrarExpedientForm.markAllAsTouched();

      return;
    }

    if (this.cerrarExpedientForm.valid) {
      const files = this.cerrarExpedientForm.get('files').value;
      const value: any = { ...this.cerrarExpedientForm.value }

      if (this.mostrarAccionDelDirectorAlAbogado) {
        value.idExpedienteCierre = null
      }

      this.httpService.postExpedienteCierre(value).subscribe(
        async (response: any) => {

          const idExpedienteCierre = response?.idExpedienteCierre || this.cerrarExpedientForm.get('idExpedienteCierre').value;

          await this.removeDeletedFiles()
          await this.uploadFilesAndSaveExpedientFiles(files, idExpedienteCierre);
          return this.sweet.record('success', `Solicitud Cierre Expediente`,
            `Su solicitud de cierre ha sido creada exitosamente.`,
            `Puede ir a la pantalla de historial para ver o modificar los datos.`).then(x => {
              this.ngbActiveModal.close(true)
              setTimeout(() => {
                this.router.navigateByUrl('/Expedientes/historial')
              }, 200)
            })
        }, (error) => {
          console.error(error);
          this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible')
        }
      );
    } else {
      this.cerrarExpedientForm.markAllAsTouched();
    }
  }

  removeDeletedFiles() {
    const files = this.cerrarExpedientForm.get('files') as FormArray;
    // Comparar los archivos cargados desde el API con los archivos del formulario
    const promises = []
    if ((this.archivosDesdeElApi as any)?.value) {
      (this.archivosDesdeElApi as any).value.forEach((file: any) => {
        const idExpedienteCierreArchivo = file?.file?.idExpedienteCierreArchivo;
        const idArchivo = file?.file?.idArchivo;
        // Verificar si el archivo cargado desde el API no está presente en el formulario
        if (!files.value.some((fileGroup: any) => fileGroup?.file?.idExpedienteCierreArchivo === idExpedienteCierreArchivo)) {
          promises.push(this.deleteExpedientFiles(idExpedienteCierreArchivo, idArchivo))
        }
      });
    }
    return Promise.all(promises)
  }

  async deleteExpedientFiles(idExpedienteCierreArchivo: number, idArchivo: number) {
    return Promise.all([this.httpService.deleteExpedientCierreArchivo(idExpedienteCierreArchivo).subscribe(() => { console.log(`Eliminar ExpedientFiles ${idExpedienteCierreArchivo}`) }, (error) => console.error(error)),
    this.httpService.deleteFile(idArchivo).subscribe(() => { console.log(`Eliminar archivo ${idArchivo}`) }, (error) => console.error(error))
    ])

  }

  uploadFilesAndSaveExpedientFiles(files: any[], idExpedienteCierre: number) {

    const fileUploads = files.map((fileGroup: any, index) => {
      const file = fileGroup?.file;
      const comentario = fileGroup?.comentario;
      const idArchivo = file?.idArchivo;
      const idExpedienteCierreArchivo = file?.idExpedienteCierreArchivo;
      if (idArchivo && idExpedienteCierreArchivo) {
        // The file has already been saved, no need to upload it again
        return Promise.resolve({
          idExpedienteCierreArchivo: idExpedienteCierreArchivo,
          idArchivo: idArchivo,
          idExpedienteCierre: idExpedienteCierre,
          descripcion: comentario
        });
      } else {
        return this.uploadFileAndGetId(file).toPromise()
          .then(idArchivo => ({
            idArchivo: idArchivo,
            idExpedienteCierre: idExpedienteCierre,
            descripcion: comentario,
            fileGroup
          }));
      }
    });

    return Promise.all(fileUploads)
      .then((expedientFileData: any[]) => {
        expedientFileData.forEach(expedientFile => {
          this.saveExpedientFile(expedientFile, (expedientFile as any).fileGroup);
        });
      })
      .catch((error) => console.log(error));
  }

  uploadFileAndGetId(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpService.postFile(formData).pipe(
      map(response => response.idArchivo),
      catchError(error => {
        console.error('Error al subir el archivo: ', error);
        return throwError(error);
      })
    );
  }

  saveExpedientFile(expedientFile: any, fileGroup: any): void {
    this.httpService.postExpedientCierreArchivo(expedientFile).subscribe(
      (response: any) => {
        // Additional actions on success
        if (response) {
          fileGroup.file = {
            name: response.archivo?.descripcion || '',
            idArchivo: response.archivo?.idArchivo,
            idExpedienteArchivo: response?.idExpedienteArchivo
          };
          this.archivosDesdeElApi = Object.assign({}, this.files) as any
        }
      },
      (error) => {
        console.error('Error al guardar el ExpedientFile: ', error);

      }
    );
  }

  validateObservationField() {
    let comment = document.getElementById('observacionesCierre') as HTMLInputElement;

    if (comment.value == '') {
      if (!this.closeExpedientFormApprove.valid) {
        this.closeExpedientFormApprove.markAllAsTouched();
        return false;
      }
    } else {
      alert('Se ha creado una solicitud de cierre.');
      this.modalService.dismissAll(CloseExpedientModalComponent);

      return true;
    }
  }



  openModalConfirmsClose() {
    if (confirm('Está seguro que desea realizar esta acción? No podrá desaser los cambios realizados.')) {
      alert('Se ha aceptado la solicitud de cierre.');
      this.modalService.dismissAll(CloseExpedientModalComponent);
    }
  }

  calendar() {
    let inputCal = document.getElementById('fechaSolicitud') as HTMLInputElement;
    inputCal.min = new Date(new Date().setDate(new Date().getDate() - 14))
      .toISOString()
      .slice(0, 10);
    inputCal.max = new Date().toISOString().split('T')[0];
  }

  downLoadAttachedFile(file: any) {
    this.showLoading('Descarga en curso...')
    this.tool.downLoadAttachedFile(file.value.idArchivo)
  }

  showLoading(title:string) {
    Swal.fire({
      title: title,
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 3000,
      didOpen: () => {
        Swal.showLoading();
      }
    })
  }
}
