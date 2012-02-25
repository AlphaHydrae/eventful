
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
    }
  }
}).export(module);
