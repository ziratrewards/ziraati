import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankingFeaturesSection } from './banking-features-section';

describe('BankingFeaturesSection', () => {
  let component: BankingFeaturesSection;
  let fixture: ComponentFixture<BankingFeaturesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankingFeaturesSection],
    }).compileComponents();

    fixture = TestBed.createComponent(BankingFeaturesSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
