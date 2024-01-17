import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from '@core/business/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {
  peopleForm: FormGroup;
  peopleId: string = '';
  dir = 'assets/images/pixabay/';
  images: any[] = [];
  constructor(private peopleService: PeopleService, private formBuilder: FormBuilder, private activatedRouter: ActivatedRoute) {
    this.peopleId = this.activatedRouter.snapshot.params['peopleId'];    
    this.peopleForm = this.formBuilder.group({
      name: [''],
      identification: [''],      
    });
    this.peopleForm.disable()

    this.loadPeopleData()    
  }
  loadPeopleData() {
    if(this.peopleId) {
      this.peopleService.getById(this.peopleId).subscribe(response => {
        this.peopleForm.patchValue({...response})
      })
      this.loadImages()
    }
  }
  loadImages() {
    for (let i = 1; i <= 20; i++) {
      this.images.push({
        title: i,
        src: this.dir + i + '.jpg',
      });
    }
  }
}