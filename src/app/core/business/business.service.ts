import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Business } from './interface';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(protected http: HttpClient) {
  }

  getAllByUserId(userId: string) {
    return this.http.get<Business[]>(`/business/user/${userId}`);
  }
}
