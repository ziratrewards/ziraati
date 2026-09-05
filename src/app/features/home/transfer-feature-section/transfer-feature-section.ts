import { Component, signal, OnDestroy } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-transfer-feature-section',
  styleUrl: './transfer-feature-section.css',
  templateUrl: './transfer-feature-section.html',
})
export class TransferFeatureSection implements OnDestroy {
  protected showSuccess = signal(false);
  private successTimeout: ReturnType<typeof setTimeout> | null = null;

  confirmTransfer(): void {
    this.showSuccess.set(true);
    if (this.successTimeout) clearTimeout(this.successTimeout);
    this.successTimeout = setTimeout(() => this.showSuccess.set(false), 3500);
  }

  cancelTransfer(): void {
    this.showSuccess.set(false);
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = null;
    }
  }

  ngOnDestroy(): void {
    if (this.successTimeout) clearTimeout(this.successTimeout);
  }
}
