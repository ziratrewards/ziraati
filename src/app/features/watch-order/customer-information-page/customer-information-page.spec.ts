import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerInformationPage } from './customer-information-page';

describe('CustomerInformationPage', () => {
  let component: CustomerInformationPage;
  let fixture: ComponentFixture<CustomerInformationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerInformationPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerInformationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
