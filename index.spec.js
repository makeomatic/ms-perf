const perf = require('./index');

describe('perf', () => {
  it('should init test timer', () => {
    const timer = this.timer = perf('init');
    expect(typeof timer).toBe('function');
  });

  it('should return thunk when tracking', () => {
    const track = this.timer('second');
    expect(typeof track).toBe('function');
    expect(typeof track()).toBe('number');
  });

  it('completes tracking', () => {
    const timers = this.timer();
    expect('init:$' in timers).toBe(true);
    expect('init:second' in timers).toBe(true);
  });
});
