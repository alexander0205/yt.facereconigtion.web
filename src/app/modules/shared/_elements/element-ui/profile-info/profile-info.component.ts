import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { user } from 'src/app/modules/auth/_models/User';
import { UserService } from 'src/app/modules/auth/_services/user.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {

  constructor(private ngbActiveModal: NgbActiveModal, public userS: UserService) { }

  @Input() user:user;

  ngOnInit(): void {
    this.user = this.userS.getUserData() as user

    console.log(this.user);
    
  }

  close() {
    this.ngbActiveModal.close();
  }
}
