import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileAppBanner } from './mobile-app-banner';

describe('MobileAppBanner', () => {
  let component: MobileAppBanner;
  let fixture: ComponentFixture<MobileAppBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAppBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileAppBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
