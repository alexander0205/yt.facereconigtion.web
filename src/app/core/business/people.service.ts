import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { People } from './interface';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(protected http: HttpClient) {
  }

  getAllByBusinessId(businessId: string) {
    return this.http.get<People[]>(`peoples/business/${businessId}`);
  }

  getById(peopleId: string) {
    return this.http.get<People>(`peoples/${peopleId}`);
  }
}
