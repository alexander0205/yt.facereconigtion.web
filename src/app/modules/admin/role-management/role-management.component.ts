import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { TableUser } from '../models/tableUser';
import * as _ from 'lodash';
import { ToastService } from '../../shared/_services/toast/toast.service';
import { SweetAlertService } from '../../shared/_services/sweetAlert/sweet-alert.service';
import { ToolsService } from '../../shared/tools/tools.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {

  @Input() currentUser: TableUser;
  title: string
  localRep: any;
  roles: any;
  currentPersonAssigneess: [] = [];
  superiors: any[] = [];
  userToTransfer: string = null;
  loadingLists: boolean = true;
  sameRoleUsers: any[] = []
  sourceUserList: any[] = []
  targetUserList: any[] = []
  currentCopy: TableUser;
  userToTransferName: string;
  isSaving: boolean = false;

  //Edit user form
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  userId: any;

  editUserForm: FormGroup;

  editUserFormData = {
    userId: null,
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    repLocalProvId: null,
    roleId: '',
    recordStatus: false
  };

  rltById: any;

  ShowFilter = true;
  dropdownSettings: any = {};
  
  selectedRLT: any[] = [];
  selectedItems: any[] = [];
  deletedRlt: any[] = [];

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private http: HttpClientService, 
    private toast: ToastService, 
    private sweet: SweetAlertService, 
    private tool: ToolsService) {
  }

  async ngOnInit() {

    this.currentCopy = _.cloneDeep(this.currentUser);

    this.getRepresentativeLocal();

    this.getUserRole();

    this.getUserDataToEdit();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'text',
      selectAllText: 'Marcar Todos',
      unSelectAllText: 'Desmarcar Todos',
      itemsShowLimit: 10,
      allowSearchFilter: this.ShowFilter,
    };
  }

  changeRole() {
    this.http.update<any[]>({}, `User/UserRole?RoleCode=${this.currentUser.roleCode}&UserCode=${this.currentUser.userCode}&RepLocalProvCode=${this.currentUser.repLocalProvCode}&UserSupervisorCode=${this.currentUser.userSupervisorCode || ""}`).subscribe(
      {
        next: users => {
          this.sweet.record('success', ``, 'Usuario Editado Correctamente', ``)
          this.ngbActiveModal.close(true)
        }, error: err => {
          console.log(err);

          if (err.error.error.errorCode == 400) {
            let names = (err.error.data as Array<any>)?.map(user => user.userName)
            this.tool.createPendingWarning(names, 'Los siguientes usuarios deberan ser reasignados', 'Usuarios Pendientes');

          } else {
            this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible');
          }
        }
      }
    )
  };

  mapList(userList: any[]) {
    return userList.map(el => {
      return { userCode: el.userCode, prevSupervisorCode: el.prevSupervisorCode }
    })
  }

  getRepresentativeLocal() { this.http.getRlt().subscribe(response => { this.localRep = response }); }

  getUserRole() { this.http.getAllRoles().subscribe(response => this.roles = response); }

  //Edit User
  getUserDataToEdit() {
    this.http.getUserById(this.currentUser.userId).subscribe((response: any) => {
      this.editUserFormData.userId = response.userId;

      this.editUserFormData.firstName = response.firstName || '';
      this.editUserFormData.secondName = response.secondName || '';
      this.editUserFormData.firstLastName = response.firstLastName || '';
      this.editUserFormData.secondLastName = response.secondLastName || '';

      this.title = `${this.editUserFormData.firstName} 
                    ${this.editUserFormData.secondName} 
                    ${this.editUserFormData.firstLastName} 
                    ${this.editUserFormData.secondLastName}`;

      this.editUserFormData.recordStatus = response.recordStatus;

      this.editUserFormData.roleId = response.roleId;

      this.getRltByUser(this.currentUser.userId);
    });
  }

  //Enable/Disable User
  toggleActive() {
    this.editUserFormData.recordStatus = !this.editUserFormData.recordStatus;
  }

  // Edit User
  editUser() {
    const infoUser = {...this.editUserFormData}

    delete infoUser.repLocalProvId;

    this.http.update(infoUser, 'User').subscribe(async (response: any) => {
      console.log(response)
      
      // Clear the list
      await this.deleteRolesAndRlt();

      // Save Rlts and roles
      this.asignRolesAndRlt();

      this.ngbActiveModal.close();
      setTimeout(() => location.reload(), 2000);
    }, (error) => {
      console.error(error);

      // TODO: mensaje de error en SweetAlert
    });
  }
  
  // Asing RLTs
  asignRolesAndRlt() {
    let usuarioId = this.editUserFormData.userId;
    
    this.selectedItems.forEach(item => {
      let repLocalProvinciaCatalogId = item.value;

      const params = { usuarioId, repLocalProvinciaCatalogId };
      const existsRlt = this.selectedRLT.some(x => x.value == repLocalProvinciaCatalogId)

      if (!existsRlt) {
        this.http.postUserRlt(params).subscribe(response => {
          console.log('asignRolesAndRlt', response);
        });
      }
    });
  }

  async deleteRolesAndRlt() {
    let usuarioId = this.editUserFormData.userId;
    
    try {
      for (let item of this.deletedRlt) {
        let repLocalProvinciaCatalogId = item.value;
  
        await this.http.deleteMultipleRlt(item.usuarioRepLocalProvinciaCatalogId, 
                                          usuarioId, 
                                          repLocalProvinciaCatalogId).toPromise();
      }
  
      console.log("Todas las llamadas HTTP han terminado.");
    } catch (error) {
      console.error("Hubo un error en alguna de las llamadas HTTP:", error);
    }
  }
  
  onItemSelect(item: any) {
    this.selectedRLT.push(item.value);
  }
  
  onSelectAll(items: any) {
    console.log(items);
  }
  
  onItemDeSelect(item: any) {
    const eraseRlt = this.selectedRLT.filter(x => x.value == item.value);

    eraseRlt.forEach(x => {
      if (x.usuarioRepLocalProvinciaCatalogId) {
        this.deletedRlt.push(x)

        console.log(this.deletedRlt)
      }
    });
  }

  getRltByUser(id: any) {
    this.http.getListRltByUserId(id).subscribe((response: any) => {
      this.selectedItems = response.map(x => ({
        value: x.localRepresentativeProvince.localRepresentativeProvinceId,
        text: `${x.localRepresentativeProvince.provinceCode} - ${x.localRepresentativeProvince.localRepProvinceInformation}`,
        usuarioRepLocalProvinciaCatalogId: x.usuarioRepLocalProvinciaCatalogId
      }));
      
      this.selectedRLT = response.map(x => ({
        value: x.localRepresentativeProvince.localRepresentativeProvinceId,
        usuarioRepLocalProvinciaCatalogId: x.usuarioRepLocalProvinciaCatalogId
      }));
    });
  }
}
