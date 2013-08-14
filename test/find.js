
var ostore = require('..'),
    assert = require('assert');

var store = ostore.createStore();

// find with no results

var result = store.find({ name: 'Abel' });
assert.ok(result);
assert.ok(Array.isArray(result));
assert.equal(result.length, 0);

// put and find

var adam = { name: 'Adam', age: 800 };
store.put(1, adam);

var result = store.find({ name: 'Adam' });
assert.ok(result);
assert.ok(Array.isArray(result));
assert.equal(result.length, 1);
assert.equal(result[0].name, 'Adam');
assert.equal(result[0].age, 800);

// find using two properties at criteria

var result = store.find({ name: 'Adam', age: 800 });
assert.ok(result);
assert.ok(Array.isArray(result));
assert.equal(result.length, 1);
assert.equal(result[0].name, 'Adam');
assert.equal(result[0].age, 800);


// find using two properties at criteria, failing

var result = store.find({ name: 'Adam', age: 600 });
assert.ok(result);
assert.ok(Array.isArray(result));
assert.equal(result.length, 0);

