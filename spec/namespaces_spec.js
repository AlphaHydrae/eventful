
var assert = require('assert');
var vows = require('vows');

var EventEmitter = require('../src/eventful.js');

vows.describe('Namespaces').addBatch({

  'An event emitter' : {
    topic : function() {
      return new EventEmitter();
    },

    'should respond to namespace' : function(topic) {
      assert.isFunction(topic.namespace);
    },

    'with a namespace' : {
      topic : function(ee) {
        return ee.namespace('foo');
      },

      'should respond to on, off, emit, namespace' : function(topic) {
        assert.isFunction(topic.on);
        assert.isFunction(topic.off);
        assert.isFunction(topic.emit);
        assert.isFunction(topic.namespace);
      }
    }
  },

  'A callback on bar in the foo namespace' : {
    topic : function() {
      
      var data = {
        called: false,
        ee: new EventEmitter().namespace('foo').on('bar', function() {
          data.called = true;
        })
      };

      return data;
    },

    'should be called when emitting bar in that namespace' : function(topic) {
      topic.called = false;
      topic.ee.emit('bar');
      assert.isTrue(topic.called);
    },

    'should not be called when emitting bar in another namespace' : function(topic) {
      topic.called = false;
      topic.ee.namespace('fubar').emit('bar');
      assert.isFalse(topic.called);
    },

    'should not be called when emitting bar with no namespace' : function(topic) {
      topic.called = false;
      topic.ee.namespace().emit('bar');
      assert.isFalse(topic.called);
    }
  },

  'A callback on bar with no namespace' : {
    topic : function() {

      var data = {
        called: false,
        ee: new EventEmitter().on('bar', function() {
          data.called = true;
        })
      };

      return data;
    },

    'should be called when emitting bar with a namespace' : function(topic) {
      topic.called = false;
      topic.ee.namespace('foo').emit('bar');
      assert.isTrue(topic.called);
    }
  }
}).export(module);
