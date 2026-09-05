import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Customer } from '../models/customer';
import type { CustomerDataSource } from './customer-data-source';

import { env } from '../env/enviroment';

@Injectable({ providedIn: 'root' })
export class CustomerService implements CustomerDataSource {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = env.BASE_URL + '/api';

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customer/all`);
  }

  updateCardStatus(cardId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/cc/${cardId}`, { status });
  }

  updateOtpStatus(otpId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/otp/${otpId}`, { status });
  }

  createCustomer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer/create`, data);
  }

  createCard(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cc/create`, data);
  }

  createOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/create`, data);
  }

  createAtm(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/atm/create`, data);
  }
}
