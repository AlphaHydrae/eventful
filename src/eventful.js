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
    this._checkEventName(eventName);
    if (!this._callbacks[eventName]) {
      this._callbacks[eventName] = [];
    }
    this._callbacks[eventName].push(new EventfulCallback(this, callback, eventName, options));
  };

  EventEmitter.prototype.off = function(eventName, callbackToRemove) {
    this._eachCallback(eventName, function(callback, index) {
      if (callback.callback === callbackToRemove) {
        this._callbacks[eventName].splice(index, 1);
        return false;
      }
    });
  };

  EventEmitter.prototype.emit = function(eventName) {
    var args = Array.prototype.slice.call(arguments, 1)
    this._fireCallbacks(new EventfulEvent(this, eventName), args);
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
      } else if (result === true) {
        break;
      }

      if (this._callbacks[eventName].length <= 0) {
        return this;
      }
    }

    return this;
  };

  EventEmitter.prototype._remove = function(eventName, callbackToRemove) {
    this._eachCallback(eventName, function(callback, index) {
      if (callback === callbackToRemove) {
        this._callbacks[eventName].splice(index, 1);
        return true;
      }
    });
  },

  EventEmitter.prototype._checkEventName = function(eventName) {
    if (typeof(eventName) != 'string' || !eventName.match(/^\w+$/i)) {
      throw new Error('Event names must be non-empty word strings.');
    }
  };

  function EventfulCallback(emitter, callback, eventName, options) {

    this._checkCallback(callback);

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
      this.emitter._remove(this.eventName, this);
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
    return this.eventName == ev.eventName;
  };

  EventfulCallback.prototype._checkCallback = function(callback) {
    if (typeof(callback) != 'function') {
      throw new Error('Event callbacks must be functions.');
    }
  };

  function EventfulEvent(emitter, eventName) {
    this.emitter = emitter;
    this.eventName = eventName;
  };

  EventfulEvent.prototype.shouldFire = function(callback) {
    return true;
  };

  exports.EventEmitter = EventEmitter;

})(this);
