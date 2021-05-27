const assert = require('assert');
const debug = require('debug')('ms-perf');

const { hasOwnProperty } = Object.prototype;
const { hrtime } = process;
const TOTAL = '$';

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e6;

/**
* Get duration in milliseconds from two process.hrtime()
* @function hrTimeDurationInMs
* @param {Array} startTime - [seconds, nanoseconds]
* @param {Array} endTime - [seconds, nanoseconds]
* @returns {number} durationInMs
*/
const hrTimeDurationInMs = (startTime, endTime) => {
  if (!Array.isArray(startTime) || !Array.isArray(endTime)) {
    return 0;
  }

  const secondDiff = endTime[0] - startTime[0];
  const nanoSecondDiff = endTime[1] - startTime[1];
  const diffInNanoSecond = secondDiff * NS_PER_SEC + nanoSecondDiff;
  return Math.round(diffInNanoSecond / MS_PER_NS);
};

function addStep(step) {
  const { name, timers, thunk } = this;
  const namespace = `${name}:${step || TOTAL}`;

  // fail-safe
  if (!timers) return undefined;

  // prepare object map
  if (hasOwnProperty.call(timers, namespace) !== true && step) {
    timers[namespace] = '0';

    // can create a closure, but this is supposed to run fast on node 7+
    if (thunk) {
      return addStep.bind(this, step);
    }
  }

  const next = hrtime();
  const time = hrTimeDurationInMs(this.timer, next);

  if (step) {
    debug('[%s] %s ms', namespace, time);
    // write down new time entry
    // and increase total counter
    timers[namespace] = time;
    this.total += time;
    this.timer = next;
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

module.exports = (name, opts = { thunk: true }) => {
  assert(opts !== null && typeof opts === 'object');

  // generates context and bound function
  const ctx = addStep.bind({
    name,
    total: 0,
    timers: Object.create(null),
    timer: hrtime(),
    thunk: opts.thunk,
  });

  // in-case somebody wants to manually call it
  return ctx;
};
