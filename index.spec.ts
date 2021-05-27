import perf = require('./')

describe('thunk', () => {
  let timer: perf.measureThunk

  it('should init test timer', () => {
    timer = perf('init');
    expect(typeof timer).toBe('function');
  });

  it('should return thunk when tracking', () => {
    const track = timer('second');
    expect(typeof track).toBe('function');
    expect(typeof track()).toBe('number');
  });

  it('completes tracking', () => {
    const timers = timer();
    expect('init:$' in timers).toBe(true);
    expect('init:second' in timers).toBe(true);
  });
});

describe('for async/await', () => {
  let timer: perf.measure

  it('should init test timer', () => {
    timer = perf('init', { thunk: false });
    expect(typeof timer).toBe('function');
  });

  it('should return thunk when tracking', () => {
    const track = timer('second');
    expect(typeof track).toBe('number');
  });

  it('completes tracking', () => {
    const timers = timer();
    expect('init:$' in timers).toBe(true);
    expect('init:second' in timers).toBe(true);
  });
});
