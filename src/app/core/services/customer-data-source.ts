import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Customer } from '../models/customer';

/** Abstract contract — dashboard only depends on this, never on the concrete implementation */
export interface CustomerDataSource {
  getCustomers(): Observable<Customer[]>;
  updateCardStatus(cardId: string, status: string): Observable<any>;
  updateOtpStatus(otpId: string, status: string): Observable<any>;
}

export const CUSTOMER_DATA_SOURCE = new InjectionToken<CustomerDataSource>(
  'CustomerDataSource'
);
