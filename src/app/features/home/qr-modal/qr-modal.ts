import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-qr-modal',
  styleUrl: './qr-modal.css',
  templateUrl: './qr-modal.html',
})
export class QrModal {
  isOpen = input(false);
  close = output<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
