import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api/api.services';
import { Login } from '../../models/login';
import { Media } from '../../services/api/media';
import { ApiUrls } from '../../services/api/api-url';
import { DataService } from '../../services/data.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, ButtonModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  error = '';
  formLogin: FormGroup;
  test: number = 0;

  constructor(private readonly formBuilder: FormBuilder, private readonly apiService: ApiService,
    private readonly router: Router, private readonly dataService: DataService) {
    this.formLogin = this.formBuilder.group({
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

    const body = JSON.stringify(login);

    this.apiService.post(ApiUrls.URL_LOGIN, body, null).subscribe(
      response => {
        const code = response.code;
        const message = response.message;
        if (code === 200) {
          const token = response.data.token;
          const username = response.data.username;
          const userId = response.data.userId;
          const roleId = response.data.roleId;
          const roleName = response.data.roleName;
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('userId', userId);
          sessionStorage.setItem('roleId', roleId);
          sessionStorage.setItem('roleName', roleName);
          sessionStorage.setItem('token', token);
          localStorage.setItem('token', token);
          console.log(sessionStorage.getItem('token'))
          if (roleId == 1) {
            this.router.navigate(['/admin-page']);
          } else {
            this.router.navigate(['']);
          }

        } else {
          this.error = message;
        }
      },

      error => {
        console.error('Có lỗi xảy ra : ', error);
      }
    );
  }

  ngOnInit(): void {
    this.test = this.dataService.getCartLength();
  }

  plusNumber() {
    this.test += 1;
    this.dataService.setCartLength(this.test);
    console.log(this.test)
  }

}
