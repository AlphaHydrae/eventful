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

For an overview of features, read <a href="#features">Features</a> below. Detailed API documentation will be coming soon.

## Installation

In a browser:

    <script type='text/javascript' src='/assets/js/eventful.min.js'></script>

In node:

    var EventEmitter = require('./lib/eventful.js');

<a name="features"></a>
## Features

Jump to <a href="#feature_chaining">chaining</a>, <a href="#feature_off">removing callbacks</a>, <a href="#feature_arguments">passing arguments</a>.

<a name="feature_chaining"></a>
All methods can be **chained**.

```js
ee.on('foo', function() {
  console.log('The foo event was emitted.');
}).on('bar', function() {
  console.log('The bar event was emitted.');
}).emit('foo').emit('bar');;
```

<a name="feature_off"></a>
You can **remove callbacks** with the off method.

```js
var fooCallback = function() {
  console.log('The foo event was emitted.');
};

var barCallback = function() {
  console.log('The bar event was emitted.');
};

// register both callbacks
ee.on('foo', fooCallback).on('bar', barCallback);

// you can remove a specific callback
ee.off('foo', fooCallback);

// or you can remove all callbacks for the foo event
ee.off('foo');

// nothing happens any more with the foo event
ee.emit('foo');

// the bar callback is still registered
ee.emit('bar'); // #=> "The bar event was emitted."

// finally, you can also remove all callbacks like this
ee.off();

// nothing happens with any event
ee.emit('bar');

```

<a name="feature_arguments"></a>
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
