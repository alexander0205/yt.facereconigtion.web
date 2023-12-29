import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Observable, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './modules/auth/_services/auth.service';
import { SesionServiceService } from './_services/sesion-service.service';
import { AnimationOptions } from 'ngx-lottie';
import * as moment from 'moment';
import { ConnectionService } from 'ngx-connection-service';
import { ToolsService } from './modules/shared/tools/tools.service';
import { pairwise, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
  modal = Swal
  isModalOpen: boolean = false;
  contdown: string = '10:00';
  interval: any;
  InternetSubject = new Subject<boolean>();
  subjectSubscription: Subscription;
  connectionSubscription: Subscription;
  @ViewChild('content') content: NgbModal;
  hasNetworkConnection: boolean
  options: AnimationOptions = {
    path: '../assets/lottie/laptop.json',
  };
  styles: Partial<CSSStyleDeclaration> = {
    textAlign: '-webkit-center'
  };
  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router,
    private auth: AuthService, private sesion: SesionServiceService, private modalService: NgbModal,
    private connectionService: ConnectionService, public tool: ToolsService) {

    this.connectionService.updateOptions({
      heartbeatExecutor: options => new Observable<any>(subscriber => {
        if (Math.random() > .5) {
          subscriber.next();
          subscriber.complete();
        } else {
          // throw new Error('Connection error');

        }
      })
    });

    this.connectionSubscription = this.connectionService.monitor().subscribe((currentState) => {

      this.hasNetworkConnection = currentState.hasNetworkConnection;
      this.InternetSubject.next(currentState.hasNetworkConnection);
      this.tool.InternetSubject.next(currentState.hasNetworkConnection)
    });


    idle.setIdle(2400);
    // 2400 sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(600);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'

      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
      this.open()
      this.startCounter()
    });

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'



    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'

    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.auth.logOut(true);
      // this.router.navigate(['/']);
    });

    this.keepalive.interval(5);

    this.keepalive.onPing.subscribe(() => {
      localStorage.setItem('lastUrl', this.router.url)

      if (!this.auth.isAuthenticated()) {

        this.getOut()
      }

      this.lastPing = new Date();
    });

    this.sesion.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    })

  }

  getOut(indirect?) {
    if (indirect) {
      this.auth.logOut(true)
    } else {
      this.auth.logOut()

    }
    this.close();

  }
  open() {
    this.modalService.open(this.content, { size: 'sm', backdrop: 'static', centered: true, backdropClass: 'light-blue-backdrop' }).result.then((t) => {

    })
  }

  startCounter() {
    let start = moment("10:00", "mm:ss");
    let seconds = _.clone(start.seconds());
    this.interval = setInterval(() => {
      this.contdown = start.subtract(1, "second").format("mm:ss");
      seconds--;
      if (seconds === 0) {
        this.getOut(true)
      }

    }, 1000);
  }

  keepSession() {
    clearInterval(this.interval)
    this.auth.keepSession()
    this.close();
    this.reset()
    this.contdown = '10:00';
  }
  close() {
    this.modalService.dismissAll('');
  }

  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  stay() {
    this.reset();
  }
  ngOnInit(): void {
    this.subjectSubscription = this.InternetSubject.pipe(startWith(true), pairwise()).subscribe(([p, c]) => {
      if (p == true && c == false) {
        this.tool.createSwalModal('No tienes conexion a internet', 'tus registros se guardaran de forma local',
          'warning', false, 'aceptar')

      }
      if (p == false && c == true) {
        this.tool.createSwalModal('tienes conexion a internet', 'tus registros locales se cargaran',
          'success', false, 'aceptar')
        // this.pwa.uploadAllOrders()
      } else if (c == true) {
        // this.pwa.uploadAllOrders()
      }
    })

    if (this.auth.checkToken()) {
      let lastUrl = localStorage.getItem('lastUrl');

      if (lastUrl) {

        this.router.navigate([lastUrl])
      }
      else {

        this.router.navigate(['/Casos/historial'])
      }
    }
    this.reset()
  }

}