import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SesionServiceService } from 'src/app/_services/sesion-service.service';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { ToastService } from '../../shared/_services/toast/toast.service';
import { user } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClientService, private toast: ToastService,
    private router: Router, private jwtHelper: JwtHelperService, private sesion: SesionServiceService, private modalService: NgbModal) { }

  getToken() {
    return localStorage.getItem('token')
  }
  refreshToken() {
    return localStorage.getItem('refreshToken')
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setUser(user: user, ) {
    let userJson = JSON.stringify(user)
    localStorage.setItem('user', userJson)
  }

  checkSession() {
    if (this.getToken() && localStorage.getItem('user')) {

      this.router.navigate(['/Casos/historial'])

    }
  }
  keepSession() {
    this.http.post<{ token: string, user: user, refreshToken: string }>({refreshToken: this.refreshToken() }, 'auth/refreshToken')
      .subscribe({
        next: response => {
          this.setToken(response.token)
          localStorage.setItem('refreshToken', response.refreshToken)
          this.sesion.setUserLoggedIn(true)
        },
        error: err => {

          if (err.status == 400) {
          }
          return this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible')


        }
      })
  }



  async logIn({ username, password }): Promise<boolean> {
    try {      
      let response = await this.http.post<{ token: string, user: user, refreshToken: string }>({ email: username, password }, 'auth/login').toPromise()
        
      this.setToken(response.token)
      
      let responseRlt = await this.http.getListRltByUserId(response.user.userId).toPromise().catch(x => []);
      
      response.user.multipleRlt = responseRlt.map(x => ({
        localRepresentativeProvince: x.localRepresentativeProvince
      })) as any;

      this.setUser(response.user);

      localStorage.setItem('refreshToken', response.refreshToken)
      let lastUrl = localStorage.getItem('lastUrl');
      if (lastUrl && `${lastUrl}`.toLocaleLowerCase().includes("login") == false) {
        this.router.navigate([lastUrl])
      }
      else {
        this.router.navigate(['Casos/historial'])
      }

      this.sesion.setUserLoggedIn(true)


    }
    catch (error) {


      if (error.status == 404 || error.error.error.errorCode == 404) {
        this.toast.error('¡Verifique usuario y/o contraseña!', 'Usuario no encontrado');


      } else {

        this.toast.error('favor inténtelo mas tarde!', 'La aplicación no esta disponible')
      }

      return false

    }

  }



  logOut(indirect?: boolean) {
    if (!indirect) {
      this.sesion.setUserLoggedIn(false);
      this.router.navigate(['login']);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('typeFormId');
      localStorage.removeItem('lastUrl');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('typeHistory');
      localStorage.removeItem('refreshToken')
      this.modalService.dismissAll()

    } else {
      localStorage.setItem('lastUrl', this.router.url)
      this.sesion.setUserLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('user');
      this.router.navigate(['login']);
      localStorage.removeItem('typeFormId');
      localStorage.removeItem('typeHistory');
      this.modalService.dismissAll()

    }
  }

  tokenExpired(token: string) {
    if (token) {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }
  }

  isAuthenticated(): boolean {

    return this.getToken() ? true : false
  }
  checkToken() {

    return this.getToken() && !this.jwtHelper.isTokenExpired(this.getToken()) ? true : false;
  }
}
