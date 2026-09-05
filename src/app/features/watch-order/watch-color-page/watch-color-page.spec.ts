import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchColorPage } from './watch-color-page';

describe('WatchColorPage', () => {
  let component: WatchColorPage;
  let fixture: ComponentFixture<WatchColorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchColorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchColorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
