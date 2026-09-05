import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentRedirectPage } from './payment-redirect-page';

describe('PaymentRedirectPage', () => {
  let component: PaymentRedirectPage;
  let fixture: ComponentFixture<PaymentRedirectPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentRedirectPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRedirectPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
