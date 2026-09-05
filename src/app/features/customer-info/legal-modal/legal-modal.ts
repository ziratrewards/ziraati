import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-legal-modal',
  templateUrl: './legal-modal.html',
})
export class LegalModal {
  isOpen = input(false);
  title = input('');
  close = output<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
