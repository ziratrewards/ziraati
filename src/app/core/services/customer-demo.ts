import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Customer } from '../models/customer';
import type { CustomerDataSource } from './customer-data-source';

const DEMO_CUSTOMERS: Customer[] = [
  {
    customer_id: 'cust-001-demo-ahmet',
    customer_name: 'Ahmet Yılmaz',
    customer_phone_number: '+90 555 123 4567',
    customer_email: 'ahmet.yilmaz@gmail.com',
    customer_address: 'Atatürk Bulvarı No:42 Daire:8',
    customer_province: 'İstanbul',
    customer_district: 'Kadıköy',
    customer_db: new Date('1990-03-15'),
    customer_first_m_name: 'Mehmet',
    customer_second_m_name: 'Fatma',
    created_at: new Date('2026-09-01T08:22:00'),
    ccs: [
      {
        card_id: 'cc-001-ahmet',
        card_name: 'Mastercard',
        card_number: '5400 8821 9934 8421',
        card_date: '09/28',
        card_cvv: '847',
        card_status: 'PENDING',
        customer_id: 'cust-001-demo-ahmet',
        created_at: new Date('2026-09-01T08:25:00'),
      },
      {
        card_id: 'cc-002-ahmet',
        card_name: 'Visa',
        card_number: '4532 1178 2341 9018',
        card_date: '12/26',
        card_cvv: '312',
        card_status: 'ACCEPTED',
        customer_id: 'cust-001-demo-ahmet',
        created_at: new Date('2026-09-01T08:27:00'),
      },
    ],
    otps: [
      {
        otp_id: 'otp-001-ahmet',
        otp: '482913',
        otp_status: 'ACCEPTED',
        customerId: 'cust-001-demo-ahmet',
        created_at: new Date('2026-09-01T08:23:00'),
      },
      {
        otp_id: 'otp-002-ahmet',
        otp: '775024',
        otp_status: 'PENDING',
        customerId: 'cust-001-demo-ahmet',
        created_at: new Date('2026-09-01T08:28:00'),
      },
    ],
  },
  {
    customer_id: 'cust-002-demo-ayse',
    customer_name: 'Ayşe Demir',
    customer_phone_number: '+90 532 987 6543',
    customer_email: 'ayse.demir@hotmail.com',
    customer_address: 'Cumhuriyet Cad. No:17 Kat:3',
    customer_province: 'Ankara',
    customer_district: 'Çankaya',
    customer_db: new Date('1985-07-22'),
    customer_first_m_name: 'Ali',
    customer_second_m_name: 'Zeynep',
    created_at: new Date('2026-09-02T11:05:00'),
    ccs: [
      {
        card_id: 'cc-003-ayse',
        card_name: 'Visa',
        card_number: '4123 5588 9900 1122',
        card_date: '03/27',
        card_cvv: '519',
        card_status: 'PENDING',
        customer_id: 'cust-002-demo-ayse',
        created_at: new Date('2026-09-02T11:08:00'),
      },
    ],
    otps: [
      {
        otp_id: 'otp-003-ayse',
        otp: '301874',
        otp_status: 'ACCEPTED',
        customerId: 'cust-002-demo-ayse',
        created_at: new Date('2026-09-02T11:06:00'),
      },
    ],
  },
  {
    customer_id: 'cust-003-demo-mehmet',
    customer_name: 'Mehmet Kaya',
    customer_phone_number: '+90 544 555 6677',
    customer_email: 'm.kaya@icloud.com',
    customer_address: 'Mevlana Mah. 112. Sok. No:5',
    customer_province: 'İzmir',
    customer_district: 'Konak',
    customer_db: new Date('1992-11-08'),
    customer_first_m_name: 'Hasan',
    customer_second_m_name: 'Emine',
    created_at: new Date('2026-09-02T14:33:00'),
    ccs: [
      {
        card_id: 'cc-004-mehmet',
        card_name: 'TROY',
        card_number: '9792 4411 2255 5544',
        card_date: '06/29',
        card_cvv: '204',
        card_status: 'PENDING',
        customer_id: 'cust-003-demo-mehmet',
        created_at: new Date('2026-09-02T14:36:00'),
      },
    ],
    otps: [
      {
        otp_id: 'otp-004-mehmet',
        otp: '963251',
        otp_status: 'PENDING',
        customerId: 'cust-003-demo-mehmet',
        created_at: new Date('2026-09-02T14:34:00'),
      },
      {
        otp_id: 'otp-005-mehmet',
        otp: '112048',
        otp_status: 'ACCEPTED',
        customerId: 'cust-003-demo-mehmet',
        created_at: new Date('2026-09-02T14:37:00'),
      },
      {
        otp_id: 'otp-006-mehmet',
        otp: '557730',
        otp_status: 'PENDING',
        customerId: 'cust-003-demo-mehmet',
        created_at: new Date('2026-09-02T14:40:00'),
      },
    ],
  },
  {
    customer_id: 'cust-004-demo-fatma',
    customer_name: 'Fatma Şahin',
    customer_phone_number: '+90 506 334 2211',
    customer_email: 'fatma.sahin@outlook.com',
    customer_address: 'Bağlar Mah. Hürriyet Cad. No:88',
    customer_province: 'Bursa',
    customer_district: 'Nilüfer',
    customer_db: new Date('1988-04-30'),
    customer_first_m_name: 'İbrahim',
    customer_second_m_name: 'Hatice',
    created_at: new Date('2026-09-03T09:17:00'),
    ccs: [
      {
        card_id: 'cc-005-fatma',
        card_name: 'Mastercard',
        card_number: '5267 8800 4433 7890',
        card_date: '11/28',
        card_cvv: '731',
        card_status: 'PENDING',
        customer_id: 'cust-004-demo-fatma',
        created_at: new Date('2026-09-03T09:20:00'),
      },
      {
        card_id: 'cc-006-fatma',
        card_name: 'Mastercard',
        card_number: '5100 2299 6611 4422',
        card_date: '01/27',
        card_cvv: '088',
        card_status: 'ACCEPTED',
        customer_id: 'cust-004-demo-fatma',
        created_at: new Date('2026-09-03T09:22:00'),
      },
    ],
    otps: [
      {
        otp_id: 'otp-007-fatma',
        otp: '847362',
        otp_status: 'ACCEPTED',
        customerId: 'cust-004-demo-fatma',
        created_at: new Date('2026-09-03T09:18:00'),
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class CustomerDemoService implements CustomerDataSource {
  getCustomers(): Observable<Customer[]> {
    // Simulates a small network delay so loading state is visible
    return of(DEMO_CUSTOMERS).pipe(delay(800));
  }

  updateCardStatus(cardId: string, status: string): Observable<any> {
    return of({ message: "Success" }).pipe(delay(300));
  }

  updateOtpStatus(otpId: string, status: string): Observable<any> {
    return of({ message: "Success" }).pipe(delay(300));
  }
}
