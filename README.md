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

## Copyright

Copyright (c) 2011 AlphaHydrae. See LICENSE.txt for
further details.

