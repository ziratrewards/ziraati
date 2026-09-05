import { Component, input } from '@angular/core';

export interface Step {
  label: string;
  sublabel: string;
}

const REGISTRATION_STEPS: Step[] = [
  { label: 'Kişisel Bilgiler', sublabel: 'Kimlik Doğrulama' },
  { label: 'Güvenlik', sublabel: '256-Bit SSL' },
  { label: 'Kart Seçimi', sublabel: 'Hesap Bağlama' },
  { label: 'SMS Onay', sublabel: 'Tek Kullanımlık Kod' },
  { label: 'Onay / Tamamlandı', sublabel: 'İşlem Özeti' },
];

@Component({
  imports: [],
  selector: 'app-progress-stepper',
  styleUrl: './progress-stepper.css',
  templateUrl: './progress-stepper.html',
})
export class ProgressStepper {
  activeStep = input(1);

  protected readonly steps = REGISTRATION_STEPS;

  protected isCompleted(stepIndex: number): boolean {
    return stepIndex + 1 < this.activeStep();
  }

  protected isActive(stepIndex: number): boolean {
    return stepIndex + 1 === this.activeStep();
  }
}
