import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { ToolsService } from 'src/app/modules/shared/tools/tools.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public userS: UserService, public tool: ToolsService) { }

  ngOnInit(): void {

  }


}

