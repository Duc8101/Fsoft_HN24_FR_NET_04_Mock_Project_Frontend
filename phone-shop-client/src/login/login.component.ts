import { Component, OnInit } from '@angular/core';
import { Login } from '../data/login';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../api/api.services';
import { ApiUrls } from '../api/api-url';
import { HttpHeaders } from '@angular/common/http';
import { Media } from '../data/media';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
      'Content-Type': Media.CONTENT_TYPE
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
