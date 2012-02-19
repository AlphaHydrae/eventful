
var assert = require('assert');
var vows = require('vows');

var EventEmitter = require('../src/eventful.js').EventEmitter;

vows.describe('EventEmitter').addBatch({

  'An event emitter' : {
    topic : function() {
      return new EventEmitter();
    },

    'should respond to on, off, emit, withNamespace' : function(topic) {
      assert.isFunction(topic.on);
      assert.isFunction(topic.off);
      assert.isFunction(topic.emit);
      assert.isFunction(topic.withNamespace);
    }
  },

  'An event emitter with a callback on foo' : {
    topic : function() {
      new EventEmitter().on('foo', this.callback).emit('foo');
    },

    'should call it back when emitting foo' : function() {}
  },

  'An event emitter with a callback on bar' : {
    topic : function() {
      var ee = new EventEmitter();
      ee.barCalled = false;
      ee.on('bar', function() {
        ee.barCalled = true;
      }).emit('foo');
      return ee;
    },

    'should not call it back when emitting foo' : function(topic) {
      assert.isFalse(topic.barCalled);
    }
  }

}).export(module);
