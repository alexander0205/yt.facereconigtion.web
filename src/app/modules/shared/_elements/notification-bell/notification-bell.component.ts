import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/auth/_services/user.service';
import { serviceOrder } from 'src/app/modules/service/serviceOrderForm/_models/serviceOrder';
import { HttpClientService } from '../../_services/http-client/http-client.service';
import { Notification } from './_models/notification';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {

  constructor(private http: HttpClientService, private user: UserService, private route: Router) { }
  notifications: Notification[] = []

  ngOnInit(): void {
    this.http.get<Notification[]>(`UserAlert?UserCode=${this.user.getUserData().userCode}&RepLocalProvId=${this.user.getUserData().repLocalProvId}&Status=true`).subscribe(
      (response: any) => {
        this.notifications = response;
      }
    )
  }

  delete(id: number) {
    this.notifications = this.notifications.filter(x => x.userAlertId !== id);
    this.http.delete(id, `UserAlert`).toPromise();
  }

  seeDetail(notificacion: any) {
    if (notificacion.codigo.includes('EXP')) {
      this.route.navigate(['/Expedientes/crearExpediente/', notificacion.idAsistenciaDiariaJudicial]);

      this.delete(notificacion.userAlertId);
    }
    
    if (notificacion.codigo.includes('SAE') || notificacion.codigo.includes('SAT')) {
      this.route.navigate(['/Casos/creacionRecord/', notificacion.idAsistenciaDiaria]);
      
      this.delete(notificacion.userAlertId);
    }
  }

}
