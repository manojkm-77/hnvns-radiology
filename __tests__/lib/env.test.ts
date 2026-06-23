import { hasRequiredEnv } from '@/lib/env';

describe('hasRequiredEnv', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns true when the env var is set to a non-empty value', () => {
    process.env.TEST_VAR = 'some-value';
    expect(hasRequiredEnv('TEST_VAR')).toBe(true);
  });

  it('returns false when the env var is not set', () => {
    delete process.env.MISSING_VAR;
    expect(hasRequiredEnv('MISSING_VAR')).toBe(false);
  });

  it('returns false when the env var is an empty string', () => {
    process.env.EMPTY_VAR = '';
    expect(hasRequiredEnv('EMPTY_VAR')).toBe(false);
  });

  it('returns false when the env var is whitespace only', () => {
    process.env.WHITESPACE_VAR = '   ';
    expect(hasRequiredEnv('WHITESPACE_VAR')).toBe(false);
  });

  it('returns true when the env var has leading/trailing whitespace around a value', () => {
    process.env.PADDED_VAR = '  value  ';
    expect(hasRequiredEnv('PADDED_VAR')).toBe(true);
  });
});
