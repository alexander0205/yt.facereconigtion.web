import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
@Component({
  selector: 'app-save-warning',
  templateUrl: './save-warning.component.html',
  styleUrls: ['./save-warning.component.css']
})
export class SaveWarningComponent implements OnInit {

  constructor(private ngbActiveModal: NgbActiveModal) { }
  @Input() form: FormGroup;
  @Input() labels: NodeList;
  @Input() pending: string[]
  @Input() title: string;
  @Input() subTitle: string;
  warningFields: any[] = [];
  formArray: any[] = []

  ngOnInit(): void {
    !this.title ? this.title = 'Campos Requeridos Pendientes' : ''
    if (!this.pending) {
      this.fillRequiredList()
      this.getformArray()
      this.validateAllFormFields(this.form)
    }
  }

  getformArray() {
    this.formArray = []
    let controls = this.form.controls
    for (const control in controls) {

      if (controls[control].constructor.name == 'FormArray') {
        let form: FormArray = controls[control] as unknown as FormArray;
        for (const F in form.controls) {
          let required = []
          for (const c in form.controls[F]['controls']) {

            if (form.controls[F].get(c).invalid) {
              this.labels.forEach(
                label => {
                  let control;

                  if (label.parentElement.children[0].nodeName == 'LABEL') {
                    control = label.parentElement.children[1].attributes.getNamedItem('formControlName')?.value;
                    if (control == c) {

                      required.push(label.childNodes[0].textContent);

                    }
                  }

                })
            }
          }
          this.formArray.push(_.uniq(required))

        }


      }

    }

  }

  fillRequiredList() {
    this.labels.forEach(
      label => {

        let control;
        for (let index = 0; index < label.parentElement.children.length; index++) {
          if (label.parentElement.children[index].nodeName == 'LABEL') {

            if (label.parentElement.children[index + 1].children.length > 1) {
              let invalid = false;

              for (let i = 0; i < label.parentElement.children[index + 1].childNodes?.length; i++) {

                if (label.parentElement.children[index + 1].children[i]) {
                  if (label.parentElement.children[index + 1].children[i].nodeName == "INPUT") {
                    control = label.parentElement.children[index + 1].children[i].attributes.getNamedItem('formControlName').value;
                    if (this.form.get(control)?.invalid) {
                      invalid = true
                    }
                  }
                }
              }
              if (invalid) {
                this.warningFields.push(label.childNodes[0].textContent)

              }
            } else {
              control = label.parentElement.children[index + 1].attributes.getNamedItem('formControlName')?.value;
              if (this.form.get(control)?.invalid) {

                this.warningFields.push(label.childNodes[0].textContent)

              }

            }

          }


        }
      }
    );
  }
  findInvalidControls() {
    const controls = this.form.controls;
    for (const name in controls) {

      if (controls[name].invalid) {
        this.warningFields.push(name);
      }
    }
  }

  // this.labels.forEach(
  //   label=>{
  //     let control;
  //     for (let index = 0; index < label.parentElement.children.length; index++) {
  //       if(label.parentElement.children[index].nodeName == 'LABEL'){
  //         control = label.parentElement.children[index + 1].attributes.getNamedItem('formControlName')?.value;
  //         if(this.form.get(control)?.invalid){

  //           this.warningFields.push(label.childNodes[0].textContent)

  //         }

  //       }

  //     }


  //   }
  // );

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  close() {
    this.ngbActiveModal.close();
  }
}
