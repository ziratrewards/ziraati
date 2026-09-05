import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileHomePage } from './mobile-home-page';

describe('MobileHomePage', () => {
  let component: MobileHomePage;
  let fixture: ComponentFixture<MobileHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileHomePage],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileHomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
