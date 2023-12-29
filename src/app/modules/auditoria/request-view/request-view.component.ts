import { Component } from '@angular/core';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { user } from '../../auth/_models/User';
import { UserService } from '../../auth/_services/user.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']
})


export class RequestViewComponent {
  user: any;
  requestId: number;
  dataRequest: any;
  dataResponse: any;
  
  constructor(private route: ActivatedRoute, private router: Router, private httpService: HttpClientService,
    private users: UserService) { }

  ngOnInit(): void {
    this.user = this.users.getUserData() as user;
    this.requestId = this.route.snapshot.params['id'];
    this.httpService.getLogRequestById(this.requestId).subscribe(
      (response: any) => {
        this.dataRequest = response;
        this.dataResponse = response.logResponses
      },
      error => console.error(error)
    );

  }
}
