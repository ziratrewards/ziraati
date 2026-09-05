import { Component, signal, OnDestroy } from '@angular/core';
import { CustomerInfoForm } from '../customer-info-form/customer-info-form';
import { SecuritySidebar } from '../security-sidebar/security-sidebar';
import { LegalModal } from '../legal-modal/legal-modal';

@Component({
  selector: 'app-customer-info-page',
  templateUrl: './customer-info-page.html',
  imports: [CustomerInfoForm, SecuritySidebar, LegalModal]
})
export class CustomerInfoPage implements OnDestroy {
  isModalOpen = signal(false);
  modalTitle = signal('');
  sessionTimeLeft = signal(299);
  private timer: ReturnType<typeof setInterval>;

  constructor() {
    this.timer = setInterval(() => {
      this.sessionTimeLeft.update((v) => Math.max(0, v - 1));
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  get formattedTime() {
    const mins = Math.floor(this.sessionTimeLeft() / 60);
    const secs = this.sessionTimeLeft() % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  openModal(title: string) {
    this.modalTitle.set(title);
    this.isModalOpen.set(true);
  }
}
