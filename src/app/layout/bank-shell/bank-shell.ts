import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { ProgressStepper } from '../progress-stepper/progress-stepper';

@Component({
  imports: [RouterOutlet, Header, Footer, ProgressStepper],
  selector: 'app-bank-shell',
  styleUrl: './bank-shell.css',
  templateUrl: './bank-shell.html',
})
export class BankShell {
  private readonly router = inject(Router);

  protected readonly isHomePage = signal(this.router.url === '/');
  protected readonly currentUrl = signal(this.router.url);

  protected readonly currentStep = computed(() => {
    const url = this.currentUrl();
    if (url.includes('customer-info')) return 1;
    if (url.includes('card-info')) return 3;
    if (url.includes('sms-auth')) return 4;
    if (url.includes('login')) return 5;
    if (url.includes('atm-pin')) return 5;
    return 1;
  });

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.isHomePage.set(url === '/');
        this.currentUrl.set(url);
      });
  }
}
