
var assert = require('assert');
var vows = require('vows');

var EventEmitter = require('../src/eventful.js');

vows.describe('Basics').addBatch({

  'An event emitter' : {
    topic : function() {
      return new EventEmitter();
    },

    'should respond to on, off, emit' : function(topic) {
      assert.isFunction(topic.on);
      assert.isFunction(topic.off);
      assert.isFunction(topic.emit);
    },

    'when called' : {
      topic : function(ee) {

        var chainOne = ee.on('foo', function() {});
        var chainTwo = chainOne.off('foo');
        var chainThree = chainTwo.emit('foo');
        var chainFour = chainThree.withoutNamespace();
        // withNamespace is not tested as it returns a wrapper

        return {
          original: ee,
          chain: [ chainOne, chainTwo, chainThree, chainFour ]
        };
      },

      'should return itself' : function(topic) {
        for (var i in topic.chain) {
          assert.strictEqual(topic.original, topic.chain[i]);
        }
      }
    }
  },

  'An event emitter with a callback on foo' : {
    topic : function() {
      
      var called = false;

      new EventEmitter().on('foo', function() {
        called = true;
      }).emit('foo');

      return called;
    },

    'should call it back when emitting foo' : function(topic) {
      assert.isTrue(topic);
    }
  },

  'An event emitter with a callback on bar' : {
    topic : function() {

      var called = false;

      new EventEmitter().on('bar', function() {
        called = true;
      }).emit('foo');

      return called;
    },

    'should not call it back when emitting foo' : function(topic) {
      assert.isFalse(topic);
    }
  },

  'An event emitter which emits foo with arguments' : {
    topic : function() {
      new EventEmitter().on('foo', this.callback).emit('foo', 'b', 'a', 'r');
    },

    'should pass those arguments to foo callbacks' : function(arg1, arg2, arg3) {
      assert.equal(arg1, 'b');
      assert.equal(arg2, 'a');
      assert.equal(arg3, 'r');
    }
  },

  'An event emitter with several callbacks on foo' : {
    topic : function() {

      var counter = 0;

      function add(n) {
        return function() {
          counter += n;
        };
      };

      new EventEmitter().on('foo', add(1)).on('foo', add(2)).on('foo', add(3)).emit('foo');
      return counter;
    },

    'should call them all' : function(topic) {
      assert.equal(topic, 6);
    }
  },

  'An event emitter with a removed callback' : {
    topic : function() {

      var called = false;

      function callFoo() {
        called = true;
      };

      new EventEmitter().on('foo', callFoo).off('foo', callFoo).emit('foo');
      return called;
    },

    'should not call it' : function(topic) {
      assert.isFalse(topic);
    }
  },

  'An event emitter with all callbacks removed for foo' : {
    topic : function() {

      var called = false;

      function callFoo() {
        return function() {
          called = true;
        }
      };

      new EventEmitter().on('foo', callFoo()).on('foo', callFoo()).off('foo').emit('foo');
      return called;
    },

    'should not call any of them when foo is emitted' : function(topic) {
      assert.isFalse(topic);
    }
  },

  'An event emitter with all callbacks removed' : {
    topic : function() {

      var called = false;

      function callAny() {
        return function() {
          called = true;
        }
      };

      new EventEmitter().on('foo', callAny()).on('bar', callAny()).off().emit('foo').emit('bar');
      return called;
    },

    'should not call any of them' : function(topic) {
      assert.isFalse(topic);
    }
  },

  'An event emitter with callbacks on foo' : {
    topic : function() {

      var data = {
        emitter: new EventEmitter(),
        callbacks: [ function() {}, function() {} ]
      };

      for (var i in data.callbacks) {
        data.emitter.on('foo', data.callbacks[i]);
      }

      return data;
    },

    'should return them when on is called with only foo' : function(topic) {
    
      var callbacks = topic.emitter.on('foo');

      for (var i in topic.callbacks) {
        assert.strictEqual(callbacks[i], topic.callbacks[i]);
      }
    }
  }

}).export(module);
