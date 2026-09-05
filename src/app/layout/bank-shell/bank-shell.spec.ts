import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankShell } from './bank-shell';

describe('BankShell', () => {
  let component: BankShell;
  let fixture: ComponentFixture<BankShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankShell],
    }).compileComponents();

    fixture = TestBed.createComponent(BankShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
