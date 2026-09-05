import { Component } from '@angular/core';
import { HeroSection } from '../hero-section/hero-section';
import { StatisticsSection } from '../statistics-section/statistics-section';
import { BankingFeaturesSection } from '../banking-features-section/banking-features-section';
import { SetupStepsSection } from '../setup-steps-section/setup-steps-section';
import { TransferFeatureSection } from '../transfer-feature-section/transfer-feature-section';
import { SupportedWatchesSection } from '../supported-watches-section/supported-watches-section';
import { SecurityBanner } from '../security-banner/security-banner';
import { MobileAppBanner } from '../mobile-app-banner/mobile-app-banner';
import { MobileHomePage } from '../mobile-home-page/mobile-home-page';

@Component({
  imports: [
    HeroSection,
    StatisticsSection,
    BankingFeaturesSection,
    SetupStepsSection,
    TransferFeatureSection,
    SupportedWatchesSection,
    SecurityBanner,
    MobileAppBanner,
    MobileHomePage,
  ],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {}
