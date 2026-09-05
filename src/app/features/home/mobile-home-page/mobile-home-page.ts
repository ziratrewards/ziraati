import { Component, signal, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-mobile-home-page',
  templateUrl: './mobile-home-page.html',
})
export class MobileHomePage implements OnInit, OnDestroy {
  protected readonly currentTime = signal('');
  protected readonly isBalanceHidden = signal(false);
  protected readonly feedbackMessage = signal('Önizleme butonlarına basarak bilek aksiyonlarını deneyin.');
  protected readonly isFeedbackSuccess = signal(false);
  
  private clockInterval: any;

  ngOnInit() {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 10000);
  }

  ngOnDestroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  private updateClock() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    this.currentTime.set(hrs + ':' + min);
  }

  protected toggleBalance() {
    this.isBalanceHidden.set(!this.isBalanceHidden());
  }

  protected flashFeedback(msg: string, isSuccess = true) {
    this.feedbackMessage.set(msg);
    this.isFeedbackSuccess.set(isSuccess);
    setTimeout(() => {
      this.feedbackMessage.set('Önizleme butonlarına basarak bilek aksiyonlarını deneyin.');
      this.isFeedbackSuccess.set(false);
    }, 3000);
  }

  protected simulateFast() {
    this.flashFeedback('✓ FAST Talebi Gönderildi: Annem (₺250,00) anında iletildi.', true);
  }

  protected simulateQr() {
    this.flashFeedback('✓ ATM Ekranı Eşleşti: Dokunmadan ₺500 çekim hazır.', true);
  }

  protected syncWatch() {
    this.flashFeedback('✓ Bluetooth Arama Başlatıldı: Saatiniz aranıyor...', true);
  }
}
