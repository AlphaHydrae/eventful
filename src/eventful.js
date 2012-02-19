/**
 * Event-based javascript.
 * 
 * @author Alpha Hydrae (hydrae.alpha@gmail.com)
 */

(function(exports){
  
  function EventEmitter() {
    this._callbacks = {};
  };

  EventEmitter.prototype.on = function(eventName, callback, options) {
    _checkEventName(eventName);

    if (typeof(callback) == 'undefined' && typeof(options) == 'undefined') {
      var callbacks = [];
      this._eachCallback(eventName, function(c) {
        callbacks.push(c.callback);
      });
      return callbacks;
    }

    if (!this._callbacks[eventName]) {
      this._callbacks[eventName] = [];
    }
    this._callbacks[eventName].push(this._wrapCallback(callback, eventName, options));
    return this;
  };

  EventEmitter.prototype.off = function(eventName, callbackToRemove) {

    if (typeof(eventName) == 'undefined') {
      for (var eventName in this._callbacks) {
        this._removeAllCallbacks(eventName);
      }
      return this;
    }

    if (!this._callbacks[eventName]) {
      return this;
    }

    if (typeof(callbackToRemove) == 'undefined') {
      this._removeAllCallbacks(eventName);
      return this;
    }

    this._eachCallback(eventName, function(callback, index) {
      if (callback.callback === callbackToRemove) {
        this._callbacks[eventName].splice(index, 1);
        return false;
      }
    });

    if (this._callbacks[eventName].length <= 0) {
      this._removeAllCallbacks(eventName);
    }

    return this;
  };

  EventEmitter.prototype.emit = function(eventName) {
    var args = Array.prototype.slice.call(arguments, 1)
    this._fireCallbacks(this._wrapEvent(eventName), args);
    return this;
  };

  EventEmitter.prototype.withNamespace = function(namespace) {
    return new EventfulNamespace(this, namespace);
  };

  EventEmitter.prototype.withoutNamespace = function() {
    return this;
  };

  EventEmitter.prototype._fireCallbacks = function(eventObject, args) {
    this._eachCallback(eventObject.eventName, function(callback, index) {
      if (eventObject.shouldFire(callback) && callback.shouldBeFired(eventObject)) {
        callback.callIt.apply(callback, args);
      }
    });
  };

  EventEmitter.prototype._eachCallback = function(eventName, callback) {

    if (!this._callbacks[eventName]) {
      return this;
    }

    var result = null;

    var n = this._callbacks[eventName].length;
    for (var i = 0; i < n; i++) {
      
      result = callback.call(this, this._callbacks[eventName][i], i);

      if (result === false) {
        i -= 1;
        n -= 1;
      } else if (result === true) {
        break;
      }

      if (this._callbacks[eventName].length <= 0) {
        return this;
      }
    }

    return this;
  };

  EventEmitter.prototype._removeAllCallbacks = function(eventName) {
    delete this._callbacks[eventName];
  };

  EventEmitter.prototype._removeCallback = function(eventName, callbackToRemove) {
    this._eachCallback(eventName, function(callback, index) {
      if (callback === callbackToRemove) {
        this._callbacks[eventName].splice(index, 1);
        return true;
      }
    });
  };

  EventEmitter.prototype._wrapCallback = function(callback, eventName, options) {
    return new EventfulCallback(this, callback, eventName, options);
  };

  EventEmitter.prototype._wrapEvent = function(eventName) {
    return new EventfulEvent(this, eventName);
  };

  function EventfulCallback(emitter, callback, eventName, options) {

    _checkCallback(callback);

    this.emitter = emitter;
    this.callback = callback;
    this.eventName = eventName;
    this.scope = options && options.scope ? options.scope : undefined;
    this.once = options ? !!options.once : undefined;
    this.klass = options ? !!options.klass : undefined;
  };

  EventfulCallback.prototype.callIt = function() {
    var args = Array.prototype.slice.call(arguments);
    if (this.klass) {
      this.callAsClass(args);
    } else {
      this.callAsFunction(args);
    }
    if (this.once) {
      this.emitter._removeCallback(this.eventName, this);
    }
  };

  EventfulCallback.prototype.callAsFunction = function(args) {
    this.callback.apply(this.scope, args);
  };

  EventfulCallback.prototype.callAsClass = function(args) {
    var tmp = function(){};
    tmp.prototype = this.callback.prototype;
    var instance = new tmp;
    this.callback.apply(instance, args);
  };

  EventfulCallback.prototype.shouldBeFired = function(ev) {
    return true;
  };

  function EventfulEvent(emitter, eventName) {
    this.emitter = emitter;
    this.eventName = eventName;
  };

  EventfulEvent.prototype.shouldFire = function(callback) {
    return true;
  };
  
  function fubarFunction() {
    console.log('fubar');
  };

  function _checkEventName(eventName) {
    if (typeof(eventName) != 'string' || !eventName.match(/^\w+$/i)) {
      throw new Error('Event names must be non-empty word strings.');
    }
  };

  function _checkCallback(callback) {
    if (typeof(callback) != 'function') {
      throw new Error('Event callbacks must be functions.');
    }
  };

  function _extend(parentClass, childClass) {
    for (var method in parentClass.prototype) {
      if (method.match(/^_?[a-z]/)) {
        childClass.prototype[method] = parentClass.prototype[method];
      }
    }
  };

  function EventfulNamespace(emitter, namespace) {
    this._emitter = emitter;
    this._namespace = namespace;
    this._callbacks = this._emitter._callbacks;
  };

  _extend(EventEmitter, EventfulNamespace);

  EventfulNamespace.prototype.withNamespace = function(namespace) {
    return new EventfulNamespace(this._emitter, namespace);
  };

  EventfulNamespace.prototype.withoutNamespace = function() {
    return this._emitter;
  };

  EventfulNamespace.prototype._wrapCallback = function(callback, eventName, options) {
    return new EventfulNamespacedCallback(this._namespace, this, callback, eventName, options);
  };

  EventfulNamespace.prototype._wrapEvent = function(eventName) {
    return new EventfulNamespacedEvent(this._namespace, this, eventName);
  };

  function EventfulNamespacedCallback(namespace, emitter, callback, eventName, options) {
    EventfulCallback.call(this, emitter, callback, eventName, options);
    this.namespace = namespace;
  }

  _extend(EventfulCallback, EventfulNamespacedCallback);

  EventfulNamespacedCallback.prototype.shouldBeFired = function(ev) {
    return this.namespace == ev.namespace;
  };

  function EventfulNamespacedEvent(namespace, emitter, eventName) {
    EventfulEvent.call(this, emitter, eventName);
    this.namespace = namespace;
  }

  _extend(EventfulEvent, EventfulNamespacedEvent);

  exports.EventEmitter = EventEmitter;

})(this);
