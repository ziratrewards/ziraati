import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cvv-modal',
  templateUrl: './cvv-modal.html',
})
export class CvvModal {
  isOpen = input<boolean>(false);
  close = output<void>();
}
