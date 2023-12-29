import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { user } from 'src/app/modules/auth/_models/User';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';
import { ProfileInfoComponent } from 'src/app/modules/shared/_elements/element-ui/profile-info/profile-info.component';
import { Breadcrumb } from 'src/app/_models/Breadcrumb';
import { BreadcrumService } from 'src/app/_services/breadcrum.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() moduleName: string;
  user: user;
  breadcrumbs$: Observable<Breadcrumb[]>;
  breadcrumb$: Observable<Breadcrumb>;
  constructor(private readonly breadcrumbService: BreadcrumService, private auth: AuthService, public userS: UserService,
    private ngBModal: NgbModal, public toolService: ToolsService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
    this.breadcrumb$ = breadcrumbService.breadcrumb$
  }

  ngOnInit(): void {
    this.user = this.userS.getUserData() as user
    this.user.getInitials()
  }

  logOut() {
    this.auth.logOut()
  }

  seeProfile() {

    const ngmodalinspectionReport: NgbModalRef = this.ngBModal.open(
      ProfileInfoComponent, {
      size: 'sm', backdrop: 'static',
      keyboard: false, centered: true, backdropClass: 'light-blue-backdrop'
    });
    ngmodalinspectionReport.componentInstance.user = this.user;

    // console.log(this.user);
    
  }
}
