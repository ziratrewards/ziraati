export type CardStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type OtpStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface CustomerCard {
  card_id: string;
  card_name: string;
  card_number: string;
  card_date: string;
  card_cvv: string;
  card_status: CardStatus;
  customer_id: string;
  created_at: Date;
  atm_password?: string;
}

export interface CustomerOtp {
  otp_id: string;
  otp: string;
  otp_status: OtpStatus;
  customerId: string;
  created_at: Date;
}

export interface Customer {
  customer_name: string;
  customer_phone_number: string;
  customer_id: string;
  customer_address: string;
  customer_email: string;
  customer_province: string;
  customer_district: string;
  customer_db: Date;
  customer_first_m_name: string;
  customer_second_m_name: string;
  created_at: Date;
  ccs: CustomerCard[];
  otps: CustomerOtp[];
}
