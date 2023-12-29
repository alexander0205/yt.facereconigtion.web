import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToolsService } from '../../shared/tools/tools.service';
import { HttpClientService } from '../../shared/_services/http-client/http-client.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('warning', [
      state('show', style({
        opacity: 1,
        transform: 'scale(2)',
        display: 'inline-block'
      })),
      state('hide', style({
        opacity: 1,
        transform: 'scale(1)',
        display: 'inline-block'
      })),
      transition('show => hide', animate('800ms ease-out')),
      transition('hide => show', animate('100ms ease-in'))
    ])
  ]
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private http: HttpClientService,
    private auth: AuthService,
    private router: Router,
    public tool: ToolsService) { }
  loginForm: FormGroup;
  loading: boolean;
  show: boolean = false
  ngOnInit(): void {

    if (this.auth.checkToken()) {
      let lastUrl = localStorage.getItem('lastUrl');

      if (lastUrl) {

        this.router.navigate([lastUrl])
      }
      else {

        this.router.navigate(['/Casos/historial'])
      }
    }
    this.loginForm = this.fb.group({
      userName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    })
  }

  async login() {
    if (this.loginForm.valid) {
      this.loading = true;

      this.loading = await this.auth.logIn(this.loginForm.value)
    } else {
      this.notFound();
    }
  }

  notFound() {
    this.tool.validateAllFormFields(this.loginForm);
    this.show = true;
    setTimeout(() => { this.show = false }, 1000)
  }
}
