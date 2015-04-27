
var ostore = require('..');

var store = ostore.createStore();

exports['find with no results'] = function (test) {
    var result = store.find({ name: 'Abel' });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['put and find'] = function (test) {
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);

    var result = store.find({ name: 'Adam' });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['find using two properties at criteria'] = function (test) {
    var result = store.find({ name: 'Adam', age: 800 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['find using $gt operator'] = function (test) {
    var result = store.find({ age: { $gt: 600 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['find using $gt and $lt operators'] = function (test) {
    var result = store.find({ age: { $gt: 600, $lt: 700 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['find using two properties at criteria, failing'] = function (test) {
    var result = store.find({ name: 'Adam', age: 600 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['find without criteria'] = function (test) {
    var result = store.find();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['find with empty criteria'] = function (test) {
    var result = store.find({ });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['find with empty criteria and fields'] = function (test) {
    var result = store.find({ }, { name: true });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, null);
};

exports['clear and find'] = function (test) {
    store.clear();
    var result = store.find();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

