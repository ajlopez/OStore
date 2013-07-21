
var ostore = require('..'),
    assert = require('assert');

// get null if not exists

var store = ostore.createStore();
var result = store.get(1);

assert.equal(result, null);

// put and get

var store = ostore.createStore();
var adam = { name: 'Adam', age: 800 };
store.put(1, adam);
var result = store.get(1);
assert.ok(result);
assert.equal(result.name, 'Adam');
assert.equal(result.age, 800);

