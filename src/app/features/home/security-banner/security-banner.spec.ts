import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityBanner } from './security-banner';

describe('SecurityBanner', () => {
  let component: SecurityBanner;
  let fixture: ComponentFixture<SecurityBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
