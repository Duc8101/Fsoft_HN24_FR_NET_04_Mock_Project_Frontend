import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../services/toastService';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers: [ToastService]
})
export class ForgotPasswordComponent {
  error = '';
  formForgotPassword: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private toastService: ToastService,
  ) {
    this.formForgotPassword = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
    });
  }
  private noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }

  get emailInput() {
    return this.formForgotPassword.get('email') as FormControl;
  }

  submit() {
    const email = {
      email: this.emailInput.value
    }
    this.apiService
      .put('http://localhost:5125/User/forgot-password', email)
      .subscribe(
        (response) => {
          const code = response.code;
          const message = response.message;
          if (code === 200) {
            this.toastService.showSuccess(message);
            this.router.navigate(['/login']);
          }
        },

        (error) => {
          this.toastService.showError('Some thing went wrong!');        
        }
      );
  }
}
