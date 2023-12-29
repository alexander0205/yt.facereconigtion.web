import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { user } from '../../auth/_models/User';
import { DropDownOptionModel } from '../../shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { RoleManagementComponent } from '../role-management/role-management.component';
import * as _ from 'lodash';
import { TableUser } from '../models/tableUser';
import Swal from 'sweetalert2';
import { tableNewUser } from '../models/tableNewUser';
import { ToastService } from '../../shared/_services/toast/toast.service';
import { TableUserAD } from '../models/tableUserAD';
import { UserService } from '../../auth/_services/user.service';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit {
  records: any[];
  loading: boolean = true;
  customButtons: { class: string; function: (record: TableUser) => Promise<void>; tooltip: string; icon: string; }[];
  customAddButtons: { class: string; function: (record: TableUserAD) => Promise<void>; tooltip: string; icon: string; }[];
  history: any;
  recordAds: any[];
  filters: string[];
  cols: ({ field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color: string; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; hasMulti: any; multiFilter: { options: any; text: string; }; color?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; length: number; tooltip: string; fixedColumn: boolean; style: string; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; })[];
  localReps: any[];
  roles: { roleCode: string; roleInfo: string; }[];
  isNewUser: boolean = false;
  btnCssDefault: string = 'btn btn-nuevoUsuario';
  ibtnCssDefault: string = 'fa fa-user-plus';
  titlebtn: string = "Añadir Usuario";
  titleheader: string = "Lista de Usuarios";
  historyAd: any;
  filtersAd: string[];
  colsAd: ({ field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color: string; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; tooltip: string; fixedColumn: boolean; hasMulti: any; multiFilter: { options: any; text: string; }; color?: undefined; length?: undefined; style?: undefined; } | { field: string; header: string; view: { table: boolean; detail: boolean; }; length: number; tooltip: string; fixedColumn: boolean; style: string; color?: undefined; hasMulti?: undefined; multiFilter?: undefined; })[];
  fillNewUser: any = new tableNewUser();

  userListItem: any;
  userListLastLoggedItem: any;
  currentPage = 1;
  itemPerPage = 10;
  p: number = 1;

  userListFiltered: any;
  userQuery: string = '';

  constructor(private http: HttpClientService, private ngBModal: NgbModal, private toast: ToastService, private currUser: UserService, private sweet: SweetAlertService,) {

  }

  ngOnInit() {
    this.getDropdowns();
    this.onClickBtnNew();
    this.getBasicInfoForNewUser();
    this.getUserLastLoggedList();
    this.getUserList();
  }

  onClickBtnNew() {
    if (this.isNewUser) {
      this.getusersActDir();
      this.isNewUser = false;
      this.btnCssDefault = "btn btn-outline-danger";
      this.ibtnCssDefault = 'fa fa-arrow-circle-left';
      this.titlebtn = "Regresar";
      this.titleheader = `Lista de Usuarios Existentes en Active Directory`;

    } else {
      this.isNewUser = true;
      this.getusers();
      this.btnCssDefault = "btn btn-nuevoUsuario";
      this.ibtnCssDefault = 'fa fa-user-plus';
      this.titlebtn = "Añadir Usuario";
      this.titleheader = "Lista de Usuarios Existentes SICET";
    }
  }

  getusers() {
    this.records = [];
    this.loading = true;

    this.customButtons = [
      {
        class: "p-button-rounded btnEditarUser css-label-btn-grid px-2 me-2",
        function: async (user: TableUser) => {
          const ngmodal: NgbModalRef = this.ngBModal.open(RoleManagementComponent, { size: 'lg' });

          ngmodal.componentInstance.currentUser = _.cloneDeep(user);
          ngmodal.closed.subscribe(itSaved => {
            if (itSaved) {
              this.getusers()
            }
          })
        },
        tooltip: 'Editar',
        icon: 'fa fa-pencil'
      }]

    this.history = this.http.get<user[]>(`User/UserControl`).subscribe({
      next: response => {
        this.records = response
        this.loading = false;
      },
      error: error => {
        this.records = []
        this.loading = false
      }
    })

    this.filters = [
      "userName", 
      "registrationDateStr", 
      "email", 
      "repLocalProvInfo", 
      "lastTimeLoginDate", 
      "roleInfo"
    ]
    
    this.cols = [
      {
        field: 'userName',
        header: 'NOMBRE',
        view: { table: true, detail: true },

        tooltip: 'NOMBRE',
        fixedColumn: true,
        color: "#1460B8",
      },
      {
        field: 'registrationDateStr',
        header: 'FECHA ENTRADA',
        view: { table: true, detail: true },

        tooltip: 'FECHA ENTRADA',
        fixedColumn: true,

      },
      {
        field: 'email',
        header: 'CORREO ELECTRONICO',
        view: { table: true, detail: true },

        tooltip: 'CORREO ELECTRONICO',
        fixedColumn: true,

      },
      {
        field: 'lastTimeLoginDate',
        header: 'ULTIMA CONEXION',
        view: { table: true, detail: true },
        tooltip: 'ULTIMA CONEXION',
        fixedColumn: true,

      },
      {
        field: 'roleInfo',
        header: 'ROL',
        view: { table: true, detail: true },
        hasMulti: true,
        multiFilter: {
          options: this.roles,
          text: 'roleInfo'
        },
        tooltip: 'ROL',
        fixedColumn: true,
      },
      {
        field: 'recordStatusString',
        header: 'ESTATUS',
        view: { table: true, detail: true },
        tooltip: 'ESTATUS',
        fixedColumn: true,
      },
    ];
  }

  getDropdowns() {
    this.http.get<{ roleCode: string, roleInfo: string }[]>(`Role?status=true`).subscribe(
      roles => this.roles = roles
    )

    this.http.get<DropDownOptionModel[]>(`LocalRepresentativeProvince`).subscribe(reps => {
      this.localReps = reps;
      this.getusers();
    })
  }

  getBasicInfoForNewUser() {
    let defaultRepProv = "001";
    this.http.get<{ code: string, value: number }[]>(`LocalRepresentativeProvince`).subscribe(reps => {
      this.fillNewUser.repLocalProvId = reps.find(item => item.code == defaultRepProv).value;
    });

    this.http.get<{ roleCode: string, roleId: number }[]>(`Role?status=true`).subscribe(reps => {
      this.fillNewUser.roleId = reps.find(item => item.roleCode == 'PLEGA').roleId;
    });

    this.http.get<{ alternateField: string, value: number }[]>(`TypeOfIdentification`).subscribe(reps => {
      this.fillNewUser.typeOfIdentificationId = reps.find(item => item.alternateField == 'CD').value;
    });

    this.http.get<{ userId: number, userCode: string, isLocalRepresentative: boolean }[]>(`User/LocalRepresentativeAndDirector/provinceCode?provinceCode=${defaultRepProv}`).subscribe(reps => {
      if (reps.length > 0) this.fillNewUser.supervisorUserId = (reps.find(x => x.isLocalRepresentative == true).userId ?? null);
    });
  }

  fillUserInfo(newUser: TableUserAD) {
    this.fillNewUser.fullName = newUser.fullName;
    this.fillNewUser.firstName = newUser.firstName;
    this.fillNewUser.firstLastName = newUser.lastName;
    this.fillNewUser.phone = (newUser.homePhone ?? newUser.mobile);
    this.fillNewUser.userCode = newUser.samAccountName.toString().trim();
    this.fillNewUser.registeredBy = this.currUser.getUserData().userCode;
    this.fillNewUser.address = newUser.streetAddress;
    this.fillNewUser.email = (newUser.userPrincipalName ?? newUser.email);
    this.fillNewUser.identification = newUser.company
    this.fillNewUser.distinguishedName = newUser.distinguishedName;
  }

  getusersActDir() {
    this.recordAds = [];
    this.loading = true;
    this.customAddButtons = [
      {
        class: "p-button-rounded p-button-danger css-label-btn-grid px-2 me-2",
        function: async (newUser: TableUserAD) => {
          Swal.fire({
            icon: 'info',
            title: '¿Esta seguro que desea agregar este usuario al SICET?',
            showDenyButton: true,
            confirmButtonText: `Agregar`,
            denyButtonText: `Cancelar`,
          }).then((result) => {

            this.fillUserInfo(newUser);
            if (result.isConfirmed) {
              this.http.post<tableNewUser>(this.fillNewUser, 'User').subscribe(
                {
                  next: response => {
                    if (response.message === "Ok") {
                      this.sweet.record('success', `Usuario "${this.fillNewUser.userCode}" ha sido agregado al SICET`, '', `Para asignarle rol, Supervisor  y/o Representante debe dirigirse a la sección lista de usuarios existentes SICET, presionando botón de Regresar.`)
                    } else {
                      this.sweet.record('info', `Usuario "${this.fillNewUser.userCode}" ya existe en SICET`, '', `Para asignarle rol, Supervisor  y/o Representante debe dirigirse a la sección lista de usuarios existentes SICET, presionando botón de Regresar.`)
                    }
                    this.getusersActDir();
                  }, error: err => {
                    this.toast.error(err, 'error')
                  }
                }
              )
            } else if (result.isDenied) {
            }
          });
        },
        tooltip: 'Agregar al SICET',
        icon: 'pi pi-user-plus'
      }]

    this.historyAd = this.http.get<user[]>(`AuthenticationActiveDirectory/getAllUsers`).subscribe(
      {
        next: response => {
          this.recordAds = response
          this.loading = false;
        },
        error: error => {
          this.recordAds = []
          this.loading = false
        }
      }
    )



    this.filtersAd = ["fullName", "samAccountName", "userPrincipalName", "department", "physicalDeliveryOfficeName", "lastTimeLoginDate", "roleInfo", "userIsOnSicit"]
    this.colsAd = [
      {
        field: 'fullName',
        header: 'NOMBRE',
        view: { table: true, detail: true },

        tooltip: 'NOMBRE',
        fixedColumn: true,
        color: "#1460B8",
      },
      {
        field: 'samAccountName',
        header: 'USUARIO',
        view: { table: true, detail: true },

        tooltip: 'USUARIO',
        fixedColumn: true,

      },
      {
        field: 'userPrincipalName',
        header: 'CORREO ELECTRONICO',
        view: { table: true, detail: true },

        tooltip: 'CORREO ELECTRONICO',
        fixedColumn: true,

      },
      {
        field: 'physicalDeliveryOfficeName',
        header: 'RLT',
        view: { table: true, detail: true },
        tooltip: 'RLT',
        fixedColumn: true,

      },
      {
        field: 'userIsOnSicit',
        header: 'REGISTRADO EN SICET',
        view: { table: true, detail: true },
        hasMulti: true,
        multiFilter: {
          options: [{ userIsOnSicit: "Si" }, { userIsOnSicit: "No" }],
          text: 'userIsOnSicit'
        },
        tooltip: 'REGISTRADO EN SICET',
        fixedColumn: true,
      },

    ]
  }

  getUserList() {
    let userService = this.http.get<user[]>('User');

    userService.subscribe((response: any) => {
      this.userListItem = response;
    });
  }

  getUserLastLoggedList() {
    this.currentPage = 1

    let userService = this.http.get<user[]>('User/UserControl');

    userService.subscribe((response: any) => {
      this.userListLastLoggedItem = response;
    });
  }

  /** Codeblock to pagination */
  get totalPages(): number {
    return Math.ceil((this?.userListLastLoggedItem?.length || 0) / this?.itemPerPage);
  }

  get displayedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemPerPage;
    const endIndex = startIndex + this.itemPerPage;

    return this.userListLastLoggedItem?.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
