
var ostore = require('..'),
    assert = require('assert');

// put, change and get

var store = ostore.createStore();
var adam = { name: 'Adam', age: 800 };
store.put(1, adam);
adam.name = 'Adam Smith';
adam.age = 60;

var result = store.get(1);
assert.ok(result);
assert.equal(result.name, 'Adam');
assert.equal(result.age, 800);
