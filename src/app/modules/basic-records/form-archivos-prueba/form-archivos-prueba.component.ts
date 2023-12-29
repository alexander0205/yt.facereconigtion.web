import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { AccordeonOpenCloseExpedientService } from '../../shared/accordeon/accordeon-open-close-expedient.service';
import { BehaviorSubject } from 'rxjs';
import { ExpedientResponse } from '../../shared/_services/http-client/types/ExpedientResponse';
import { FileListEntity } from '../../shared/_services/http-client/types/file-list-entity';
import { user } from '../../auth/_models/User';
import { UserService } from '../../auth/_services/user.service';
import { ToolsService } from '../../shared/tools/tools.service';
import { ToastService } from '../../shared/_services/toast/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-archivos-prueba',
  templateUrl: './form-archivos-prueba.component.html',
  styleUrls: ['./form-archivos-prueba.component.css']
})
export class FormArchivosPruebaComponent {

  @Input() expedientResult: BehaviorSubject<ExpedientResponse | null> = new BehaviorSubject(null);
  @Input() expedientCerrado: boolean


  constructor(private httpService: HttpClientService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private users: UserService,
    private accordeonService: AccordeonOpenCloseExpedientService,
    private tool: ToolsService) { }

  user: any;


  fundamentoDefensaFilesItem: File[] = [];

  archivosPruebaForm: FormGroup;

  ngOnInit(): void {
    this.user = this.users.getUserData() as user;

    this.archivosPruebaForm = this.formBuilder.group({
      idExpediente: [0],
      descripcionArchivosDePrueba: [''],
    })
    this.loadInformationExpedient()
  }

  loadInformationExpedient() {
    this.expedientResult.subscribe(expedientResult => {
      if (expedientResult) {
        this.archivosPruebaForm.setValue({
          idExpediente: expedientResult.idExpediente,
          descripcionArchivosDePrueba: expedientResult.descripcionArchivosDePrueba
        });
        this.validateForm()
        this.loadFiles(expedientResult.idExpediente);

        if (expedientResult.estado.codigoReferencia == 'SOLCIE') {
          this.expedientCerrado = true;
        }
      }
    }, (error) => {
      console.error('Ha ocurrido un problema: ', error);

      this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
    });
  }

  async loadFiles(idExpediente) {
    const listExpedienteArchviosPruebas = await this.httpService.getWithQuery(`ExpedienteArchivosPrueba`, { idExpediente: idExpediente })
      .toPromise()
      .catch((_x) => null);
    const fundamentoDefensaFilesItem: any = this.fundamentoDefensaFilesItem;
    if (listExpedienteArchviosPruebas) {
      for (let ref of listExpedienteArchviosPruebas) {
        if (ref.archivo) {
          fundamentoDefensaFilesItem.push({
            name: ref.archivo?.nombreArchivo,
            idArchivo: ref.archivo?.idArchivo,
          });
        }
      }
      // this.showIconTo('Referencia', true);
    }
  }

  validateForm() {
    if (this.archivosPruebaForm?.valid) {
      this.accordeonService.cerrarAcordeon('flush-collapseSevent')
    }
  }

  onFileSelect(event): void {
    Array.from(event.target.files).forEach((file: File) => {
      this.fundamentoDefensaFilesItem.push(file);
    });
  }

  deleteFile(index: number) {
    this.fundamentoDefensaFilesItem.splice(index, 1);
  }

  validateGuardarDatos() {
    if (this.archivosPruebaForm.valid) {
      if (this.archivosPruebaForm.value.descripcionArchivosDePrueba == '') {
        this.archivosPruebaForm.markAllAsTouched();
        return;
      }

      this.showLoadingSpinner(true, "btnGuardarArchivo");

      this.httpService.postExpediente(this.archivosPruebaForm.value).subscribe(
        async (response: any) => {
          if (response) {
            this.expedientResult.next(response);
          }
          await this.deleteDailyAttendanceNotificationFiles(this.expedientResult?.value.idExpediente)
          await this.uploadpostExpedienteArchivosPrueba(this.expedientResult?.value.idExpediente)

          this.accordeonService.cerrarAcordeon('flush-collapseSevent')
          this.showLoadingSpinner(false, "btnGuardarArchivo");

        },
        (error) => {
          console.log(error)

          this.showLoadingSpinner(false, "btnGuardarArchivo");
          this.toast.error(error, 'Ha ocurrido un problema, contacte a soporte');
        }
      );

    } else {
      this.archivosPruebaForm.markAllAsTouched();
    }
  }


  async deleteDailyAttendanceNotificationFiles(idExpediente) {
    const listExpedienteArchviosPruebas = await this.httpService.getWithQuery(`ExpedienteArchivosPrueba`, { idExpediente: idExpediente })
      .toPromise()
      .catch((_x) => null);


    if (listExpedienteArchviosPruebas) {
      const deletePromises = listExpedienteArchviosPruebas.map(
        (xNF) => {
          // Check if the current file is not in the fundamentoDefensaFilesItem array
          if (
            this.fundamentoDefensaFilesItem &&
            !(this.fundamentoDefensaFilesItem as any).some(
              (item) => item.idArchivo === xNF?.archivo?.idArchivo
            )
          ) {
            const deleteFilePromise = xNF?.archivo?.idArchivo
              ? this.httpService.deleteFile(xNF?.archivo?.idArchivo).toPromise()
              : Promise.resolve();
            const deleteNotifFilePromise = xNF?.idExpedienteArchivosPrueba ? this.httpService.delete(xNF?.idExpedienteArchivosPrueba,
              'ExpedienteArchivosPrueba'
            ).toPromise()
              : Promise.resolve();
            return Promise.all([deleteFilePromise, deleteNotifFilePromise]);
          } else {
            return Promise.resolve(); // Return resolved promise for the files we don't want to delete
          }
        }
      );
      await Promise.all(deletePromises);
    }
  }

  async uploadpostExpedienteArchivosPrueba(
    idExpediente
  ) {
    let listadoFile: any = await this.uploadFileList(
      this.fundamentoDefensaFilesItem
    );

    this.handlepostExpedienteArchivosPrueba(
      idExpediente,
      listadoFile
    );
  }

  handlepostExpedienteArchivosPrueba(idExpediente, listadoFile) {
    if (listadoFile) {
      listadoFile.ids.forEach((element) => {
        element.idArchivo,
          this.httpService.postExpedienteArchivosPrueba({
            idArchivo: element.idArchivo,
            idExpediente,
          }).toPromise();
      });
    }
  }
  
  private uploadFileList(event: File[]): Promise<FileListEntity | null> {
    if (event && event.length > 0) {
      const formData = new FormData();
      let length = 0;
      for (let i = 0; i < event.length; i++) {
        const _iEvent: any = event[i];
        if (!_iEvent?.idArchivo) {
          length++;
          formData.append('files', event[i], event[i].name);
        }
      }
      if (length === 0) {
        return null;
      }
      return this.httpService.postFiles(formData)
        .toPromise()
        .then(
          (response: FileListEntity) => {
            console.log('Uploaded file: ', response);
            return response;
          },
          (error) => {
            console.error(error);
            return null;
          }
        );
    }
    return null;
  }

  downLoadAttachedFile(file: any) {
    this.showLoading('Descarga en curso...');
    
    this.tool.downLoadAttachedFile(file.idArchivo)
  }

  async showLoadingSpinner(isLoading: boolean, btnId: string) {
    let btn = document.getElementById(btnId) as HTMLButtonElement;

    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa fa-spin fa-spinner"></i>'
    } else {
      btn.disabled = false;
      btn.innerHTML = 'Listo';
    }
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
