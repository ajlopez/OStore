
var ostore = require('..'),
    assert = require('assert');

var store = ostore.createStore();

// find with no results

var result = store.find({ name: 'Abel' });
assert.ok(result);
assert.ok(Array.isArray(result));
assert.equal(result.length, 0);

