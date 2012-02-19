# eventful

Event-based javascript.

```js
// initialize an event emitter
var ee = new EventEmitter();

// create a callback function
var fooCallback = function() {
  console.log('The foo event was emitted.');
};

// register the callback
ee.on('foo', fooCallback);

// emit the event
ee.emit('foo'); // #=> "The foo event was emitted."
```

## Installation

In a browser:

    <script type='text/javascript' src='/assets/js/eventful.min.js'></script>

In node:

    var EventEmitter = require('./lib/eventful.js');

## Features

When emitting events, any additional **arguments** after the event name are passed to registered callbacks.

```js
ee.on('foo', function(arg) {
  console.log('I was called with ' + arg + '.');
});

ee.emit('foo', 'bar'); // #=> "I was called with bar."
```

## License (MIT)

Copyright (c) 2011 Alpha Hydrae

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
