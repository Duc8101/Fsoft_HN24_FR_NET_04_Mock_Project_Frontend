import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  error = '';
  formRegister: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, private readonly apiService: ApiService, private readonly router: Router) {
    this.formRegister = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator()]),
      password: this.formBuilder.control('', [Validators.required]),
      fullname: this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator()]),
      rePassword: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      phone: this.formBuilder.control('', [Validators.required, this.phoneValidator()]),
      address: this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator()]),
    }, { validators: this.passwordMatchValidator });
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneRegex = /^[0-9]{10}$/; // Kiểm tra 10 chữ số
      const valid = phoneRegex.test(control.value);
      return valid ? null : { phoneInvalid: true };
    };
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const repassword = formGroup.get('rePassword')?.value;
    console.log(( repassword != '' ? 'aa' :'bb'));
    return (password === repassword && repassword != '') ? null : { passwordMismatch: true };
  }

  private noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  get usernameInput() {
    return this.formRegister.get('username') as FormControl;
  }

  get passwordInput() {
    return this.formRegister.get('password') as FormControl;
  }

  get fullnameInput() {
    return this.formRegister.get('fullname') as FormControl;
  }

  get rePasswordInput() {
    return this.formRegister.get('rePassword') as FormControl;
  }

  get emailInput() {
    return this.formRegister.get('email') as FormControl;
  }

  get phoneInput() {
    return this.formRegister.get('phone') as FormControl;
  }

  get addressInput() {
    return this.formRegister.get('address') as FormControl;
  }


  submit(){

  }
}
