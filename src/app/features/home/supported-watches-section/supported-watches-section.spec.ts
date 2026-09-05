import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportedWatchesSection } from './supported-watches-section';

describe('SupportedWatchesSection', () => {
  let component: SupportedWatchesSection;
  let fixture: ComponentFixture<SupportedWatchesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportedWatchesSection],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportedWatchesSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
