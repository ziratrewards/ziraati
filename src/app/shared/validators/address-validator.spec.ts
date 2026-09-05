import { AddressValidator } from './address-validator';

describe('AddressValidator', () => {
  it('should create an instance', () => {
    const directive = new AddressValidator();
    expect(directive).toBeTruthy();
  });
});
