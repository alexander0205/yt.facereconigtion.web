import { Injectable } from '@angular/core';
import { user } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
user:any=null;

  getUserData() {
    if(localStorage.getItem('user')) {
      this.user = new user(JSON.parse(localStorage.getItem('user'))) 
    }
    
   return this.user
  }
}
