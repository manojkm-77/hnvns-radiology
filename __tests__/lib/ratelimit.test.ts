import { checkRateLimit } from '@/lib/ratelimit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows calls within the limit', () => {
    const key = 'test-allow';
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
  });

  it('blocks calls that exceed the limit', () => {
    const key = 'test-block';
    expect(checkRateLimit(key, 2, 60_000)).toBe(true);
    expect(checkRateLimit(key, 2, 60_000)).toBe(true);
    expect(checkRateLimit(key, 2, 60_000)).toBe(false);
    expect(checkRateLimit(key, 2, 60_000)).toBe(false);
  });

  it('resets after the window expires', () => {
    const key = 'test-reset';
    expect(checkRateLimit(key, 1, 10_000)).toBe(true);
    expect(checkRateLimit(key, 1, 10_000)).toBe(false);

    jest.advanceTimersByTime(10_001);

    expect(checkRateLimit(key, 1, 10_000)).toBe(true);
  });

  it('tracks different keys independently', () => {
    expect(checkRateLimit('key-a', 1, 60_000)).toBe(true);
    expect(checkRateLimit('key-b', 1, 60_000)).toBe(true);
    expect(checkRateLimit('key-a', 1, 60_000)).toBe(false);
    expect(checkRateLimit('key-b', 1, 60_000)).toBe(false);
  });

  it('returns true for the first call with any key', () => {
    expect(checkRateLimit('fresh-key-' + Date.now(), 1, 1000)).toBe(true);
  });

  it('blocks on second call when limit is 1', () => {
    expect(checkRateLimit('limit-one', 1, 60_000)).toBe(true);
    expect(checkRateLimit('limit-one', 1, 60_000)).toBe(false);
  });
});
