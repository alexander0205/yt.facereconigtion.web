import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected http: HttpClient, private tokenService: TokenService) {
  }

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { email: username, password });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout(params: Record<string, any>) {
    return this.http.post<any>('/auth/logout', params);
  }

  me() {    
    return this.http.get<User>(`/users/${this.tokenService.getUserId()}`);
  }

  menu() {
    return this.http
    .get<{ menu: Menu[] }>('assets/data/menu.json?_t=' + Date.now())
    .pipe(map(res => res.menu));
  }
}
