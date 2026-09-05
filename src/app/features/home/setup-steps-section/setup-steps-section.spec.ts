import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupStepsSection } from './setup-steps-section';

describe('SetupStepsSection', () => {
  let component: SetupStepsSection;
  let fixture: ComponentFixture<SetupStepsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupStepsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupStepsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
