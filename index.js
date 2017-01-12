const debug = require('debug')('ms-perf');

const hasOwnProperty = Object.prototype.hasOwnProperty;
const hrtime = process.hrtime;
const TOTAL = '$';

function getMiliseconds(diff) {
  return ((diff[0] * 1e3) + (diff[1] / 1e6));
}

function addStep(step) {
  const name = this.name;
  const namespace = `${name}:${step || TOTAL}`;
  const timers = this.timers;

  // fail-safe
  if (!timers) return undefined;

  // prepare object map
  if (hasOwnProperty.call(timers, namespace) !== true && step) {
    timers[namespace] = '0';
    // can create a closure, but this is supposed to run fast on node 7+
    return addStep.bind(this, step);
  }

  const time = getMiliseconds(hrtime(this.timer));

  if (step) {
    debug('[%s] %s ms', namespace, time);
    // write down new time entry
    // and increase total counter
    timers[namespace] = time;
    this.total += time;
    this.timer = hrtime();
    return time;
  }

  timers[namespace] = (this.total + time).toFixed(2);
  debug('[%s] %j', name, timers);
  debug('[%s] total: %s ms', name, timers[namespace]);

  // force gc on the props with refs to obj and array
  this.timers = null;
  this.timer = null;

  return timers;
}

module.exports = (name) => {
  // generates context and bound function
  const ctx = addStep.bind({
    name,
    total: 0,
    timers: {},
    timer: hrtime(),
  });

  // in-case somebody wants to manually call it
  return ctx;
};
