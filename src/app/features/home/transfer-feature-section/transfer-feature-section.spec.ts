import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferFeatureSection } from './transfer-feature-section';

describe('TransferFeatureSection', () => {
  let component: TransferFeatureSection;
  let fixture: ComponentFixture<TransferFeatureSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferFeatureSection],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferFeatureSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
