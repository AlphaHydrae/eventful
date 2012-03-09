
var assert = require('assert');
var vows = require('vows');

var EventEmitter = require('../src/eventful.js');

vows.describe('Validations').addBatch({

  'An event emitter' : {
    topic : function() {
      return new EventEmitter();
    },

    'should only accept functions as callbacks' : function(topic) {
      // undefined is not tested as calling on with only an event name is allowed
      var invalid = [ null, true, false, 2, 'string', [], {} ];
      for (var i in invalid) {
        assert.throws(function() { topic.on('foo', invalid[i]); }, Error);
      }
    },

    'should only accept non-empty word strings as events' : function(topic) {
      var invalid = [ undefined, null, true, false, 2, [], {}, '', '%/&' ];
      var callback = function() {};
      for (var i in invalid) {
        assert.throws(function() { topic.on(invalid[i], callback); }, Error);
      }
    },

    'should only accept strings as a namespace' : function(topic) {
      var invalid = [ null, true, false, 2, [], {} ];
      for (var i in invalid) {
        assert.throws(function() { topic.namespace(invalid[i])}, Error);
      }
    }
  }
}).export(module);
