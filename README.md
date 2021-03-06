# eventful

**Event-based javascript.**

My personal flavor of a javascript event emitter. It can be used to listen to and emit events for event-based behavior in the browser or in <a href="http://nodejs.org/">node.js</a>. This readme contains <a href="#installation">installation</a> instructions and an overview of <a href="#features">features</a>.

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

Eventful is tested with <a href="http://vowsjs.org/">Vows</a> and <a href="http://travis-ci.org/#!/AlphaHydrae/eventful">Travis CI</a>.

* master [![Build Status](https://secure.travis-ci.org/AlphaHydrae/eventful.png?branch=master)](http://travis-ci.org/AlphaHydrae/eventful)
* develop [![Build Status](https://secure.travis-ci.org/AlphaHydrae/eventful.png?branch=develop)](http://travis-ci.org/AlphaHydrae/eventful)

<a name="installation"></a>
## Installation

Downloads:

* <a href="https://raw.github.com/AlphaHydrae/eventful/master/src/eventful.min.js">Compressed</a>
* <a href="https://raw.github.com/AlphaHydrae/eventful/master/src/eventful.js">Uncompressed</a>
* <a href="https://github.com/AlphaHydrae/eventful/zipball/master">Full Project Zip</a>

How to use in a browser:

    <!-- direct link -->
    <script type='text/javascript' src='https://raw.github.com/AlphaHydrae/eventful/master/src/eventful.min.js'></script>

    <!-- with downloaded file -->
    <script type='text/javascript' src='/assets/js/eventful.min.js'></script>

How to install with <a href="http://npmjs.org/">npm</a>:

    npm install eventful-ah

How to use in node:

    // if installed with npm
    var EventEmitter = require('eventful-ah');

    // if downloaded
    var EventEmitter = require('./lib/eventful.js');

<a name="features"></a>
## Features

Jump to:

* <a href="#feature_chaining">chaining</a>
* <a href="#feature_off">removing callbacks</a>
* <a href="#feature_arguments">passing arguments</a>
* <a href="#feature_listing">listing callbacks</a>
* <a href="#feature_namespaces">namespaces</a>

<a name="feature_chaining"></a>
All methods can be **chained**.

```js
ee.on('foo', function() {
  console.log('The foo event was emitted.');
}).on('bar', function() {
  console.log('The bar event was emitted.');
}).emit('foo').emit('bar');
```

<a name="feature_off"></a>
You can **remove callbacks** with the `off` method.

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

<a name="feature_listing"></a>
The `on` method can be used to retrieve the **list of callbacks** registered for a given event.

```js
// register your callbacks
ee.on('fubar', fooCallback).on('fubar', barCallback);

// get the list of registered callbacks
var callbacks = ee.on('fubar');

// check its contents
console.log(callbacks.length); // #=> 2
```

<a name="feature_namespaces"></a>
You can register callback functions in a **namespace**, so that only events emitted with the same namespace will call them.

```js
// create an event emitter
var nee = new EventEmitter();

// register a callback in a namespace
nee.namespace('foo').on('bar', function() {
  console.log('The bar event was emitted in the foo namespace.');
});

// the callback is not called if you emit bar in another namespace or with no namespace
nee.namespace('zoo').emit('bar');
nee.emit('bar');

// it is only called if you emit bar within the same namespace
nee.namespace('foo').emit('bar'); // #=> "The bar event was emitted in the foo namespace."
```

Note that callbacks registered with no namespace will be called when emitting an event in any namespace.

```js
// register a callback on kung in no namespace
nee.on('kung', function() {
  console.log('The kung event was emitted.');
});

// the callback with be called by emitting kung in any namespace
nee.namespace('foo').emit('kung'); // #=> "The kung event was emitted."
nee.namespace('bar').emit('kung'); // #=> "The kung event was emitted."
```

## License (MIT)

Copyright (c) 2011 Alpha Hydrae

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
