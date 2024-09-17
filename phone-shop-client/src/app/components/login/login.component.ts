<<<<<<< Updated upstream:phone-shop-client/src/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { Login } from '../data/login';
=======
import { Component } from '@angular/core';
>>>>>>> Stashed changes:phone-shop-client/src/app/components/login/login.component.ts
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
<<<<<<< Updated upstream:phone-shop-client/src/login/login.component.ts
=======
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api-services/api.services';
import { Media } from '../../services/api-services/media';
import { ApiUrls } from '../../services/api-services/api-url';
import { Login } from '../../models/login';
>>>>>>> Stashed changes:phone-shop-client/src/app/components/login/login.component.ts

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,CheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  error = '';
  success = '';
  formLogin: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, private readonly apiService: ApiService) {
    this.formLogin = formBuilder.group({
      username: this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator()]),
      password: this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator()]),
    });
  }

  private noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  get usernameInput() {
    return this.formLogin.get('username') as FormControl;
  }

  get passwordInput() {
    return this.formLogin.get('password') as FormControl;
  }


  submit() {
    const username = this.usernameInput.value;
    const password = this.passwordInput.value;
    const login: Login = {
      username: username,
      password: password
    };

    const data = JSON.stringify(login);

    const headers = new HttpHeaders({
<<<<<<< Updated upstream:phone-shop-client/src/login/login.component.ts
      'Content-Type': Media.CONTENT_TYPE
=======
      'Content-Type': Media.CONTENT_TYPE,
      
>>>>>>> Stashed changes:phone-shop-client/src/app/components/login/login.component.ts
    });
    let token = localStorage.getItem('token');

    this.apiService.post(ApiUrls.URL_LOGIN, data, headers).subscribe(
      response => {
        const code = response.code;
        const message = response.message;
        if (code === 200) {
          const token = response.data.token;
          localStorage.clear();
          this.success = 'Login successful';
          this.error = '';
        } else {
          this.error = message;
          this.success = '';
        }
      },

      error => {
        console.error('Có lỗi xảy ra : ', error);
      }
    );
  }
}
