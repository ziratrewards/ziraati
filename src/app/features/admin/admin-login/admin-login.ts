import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly passwordVisible = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  protected togglePasswordVisibility() {
    this.passwordVisible.update(v => !v);
  }

  protected onSubmit() {
    if (this.form.valid) {
      this.isSubmitting.set(true);
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/dashboard']);
      }, 1500);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
