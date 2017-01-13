# ms-perf

Node.js inline function performance measurement tool.
Provides simple way to understand how much relative time your functions/promises are being executed for

## install

`npm i ms-perf -S`

## usage

Module generally consists of a single function with different use

1. start timer instance

  ```js
  const perf = require('ms-perf');

  // pass in timer name
  const timer = perf('timer-name');
  ```

2. register timer triggers

  ```js
  // returns Function
  timer('trigger')
  ```

3. retrieve timers

  ```js
  // returns reference to timers object
  // and cleans up internal context
  timer()
  ```

### Example

```js
// bluebird has many useful utilities...
const Promise = require('bluebird');
const perf = require('ms-perf');
const rethrow = e => {
  throw e
};

function asyncExecutionFlow(input) {
  const timer = perf('async');

  return Promise
    .resolve(input)
    .then(doHTTPRequest)
    // please do not use '$' as this is a reserved character for total
    // for performance reasons there is no check on the input argument
    .tap(timer('http'))
    .then(processHTTPRequest)
    .tap(timer('parse'))
    .then(parsed => ({
      meta: {},
      data: parsed
    }))
    .catch(e => {
      // ensure that in-case of errors timer is cancelled
      const timers = timer();
      // do something with error timers / handle errors
      throw e;
    })
    .tap((data) => {
      data.meta.timers = timer();
    })
    .tap(console.log)

  // when promise is completed, output will look like this:
  //
  // {
  //   meta: {
  //     timers: {
  //       'async:http': 321,
  //       'async:parse': 1.21,
  //       'async:$': 323.30
  //     }
  //   },
  //   data: {
  //     ...whatever was inside parsed
  //   }
  // }
}
```