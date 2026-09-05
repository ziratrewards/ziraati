import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentResultPage } from './payment-result-page';

describe('PaymentResultPage', () => {
  let component: PaymentResultPage;
  let fixture: ComponentFixture<PaymentResultPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentResultPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentResultPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
