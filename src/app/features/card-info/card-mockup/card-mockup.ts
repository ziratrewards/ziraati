import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-card-mockup',
  templateUrl: './card-mockup.html',
})
export class CardMockup {
  cardType = input<'credit' | 'debit'>('credit');
  cardName = input<string>('');
  cardNumber = input<string>('');
  expiryMonth = input<string>('');
  expiryYear = input<string>('');
  cvv = input<string>('');

  protected readonly displayCardName = computed(() => {
    const val = this.cardName()?.trim();
    return val && val.length > 0 ? val.toUpperCase() : 'AD SOYAD';
  });

  protected readonly formattedNumber = computed(() => {
    const val = this.cardNumber() || '';
    const raw = val.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += raw[i];
    }
    return formatted;
  });

  protected readonly displayCardNumber = computed(() => {
    const formatted = this.formattedNumber();
    if (formatted.length > 0) {
      let mask = formatted;
      const diff = 19 - formatted.length;
      for (let j = 0; j < diff; j++) {
        if ((formatted.length + j) % 5 === 4) mask += ' ';
        else mask += '•';
      }
      return mask;
    }
    return '•••• •••• •••• ••••';
  });

  protected readonly cardBrand = computed(() => {
    const raw = (this.cardNumber() || '').replace(/\D/g, '');
    if (raw.startsWith('4')) {
      return 'VISA';
    } else if (/^5[1-5]/.test(raw)) {
      return 'MASTERCARD';
    } else {
      return 'TROY';
    }
  });

  protected readonly displayExpiry = computed(() => {
    const m = this.expiryMonth() || 'AA';
    const y = this.expiryYear() || 'YY';
    return `${m}/${y}`;
  });

  protected readonly displayCvv = computed(() => {
    const val = this.cvv() || '';
    return val.length > 0 ? val : '•••';
  });

  protected readonly badgeText = computed(() => this.cardType() === 'credit' ? 'Kredi Kartı' : 'Banka Kartı');
  protected readonly tierText = computed(() => this.cardType() === 'credit' ? 'Bankkart Platinum' : 'Bankkart Klasik');
}
