import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Register } from '../../models/register';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../services/toastService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [ToastService]
})
export class RegisterComponent {
  error = '';
  formRegister: FormGroup;
  register? : Register;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private toastService: ToastService)
  {
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
    // call api create order
    this.register = {
      username: this.usernameInput.value,
      fullName : this.fullnameInput.value,
      phone : this.phoneInput.value,
      email: this.emailInput.value,
      address: this.addressInput.value,
      password: this.passwordInput.value,
      confirmPassword: this.rePasswordInput.value,
    };

    console.log(this.register);

    this.apiService
    .post('http://localhost:5125/User/Register', this.register, null)
    .subscribe(
      (response) => {
        const code = response.code;
        const message = response.message;
        if (code === 200) {
          this.toastService.showSuccess(message);
          this.router.navigate(['/login']);
        } else {
          this.toastService.showError(message);
        }
      },

      (error) => {
        this.toastService.showError("Register Fail!");
      }
    );
  }
}
