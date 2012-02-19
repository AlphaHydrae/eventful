
var assert = require('assert');
var vows = require('vows');

var EventEmitter = require('../src/eventful.js').EventEmitter;

vows.describe('Basics').addBatch({

  'An event emitter' : {
    topic : function() {
      return new EventEmitter();
    },

    'should respond to on, off, emit, withNamespace, withoutNamespace' : function(topic) {
      assert.isFunction(topic.on);
      assert.isFunction(topic.off);
      assert.isFunction(topic.emit);
      assert.isFunction(topic.withNamespace);
      assert.isFunction(topic.withoutNamespace);
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
      new EventEmitter().on('foo', this.callback).emit('foo');
    },

    'should call it back when emitting foo' : function() {}
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
  }

  // MISSING SPECS
  // - off
  // - options (once, scope, klass)

}).export(module);
