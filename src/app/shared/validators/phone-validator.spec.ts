import { PhoneValidator } from './phone-validator';

describe('PhoneValidator', () => {
  it('should create an instance', () => {
    const directive = new PhoneValidator();
    expect(directive).toBeTruthy();
  });
});
