
var ostore = require('..');

var store = ostore.createStore();

exports['aggregate with no results'] = function (test) {
    var result = store.aggregate();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['put and aggregate'] = function (test) {
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);

    var result = store.aggregate();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['put and aggregate with match'] = function (test) {
    var eve = { name: 'Eve', age: 700 };
    store.put(2, eve);
    var abel = { name: 'Abel', age: 600 };
    store.put(3, abel);

    var result = store.aggregate({ $match: { name: 'Adam' } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['aggregate with limit'] = function (test) {
    var result = store.aggregate({ $limit: 2 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
};

exports['aggregate with match and limit'] = function (test) {
    var result = store.aggregate({ $match: { age: { $gt: 100 } } }, { $limit: 2 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
};

exports['aggregate with skip'] = function (test) {
    var result = store.aggregate({ $skip: 1 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
    test.equal(result[1].name, 'Abel');
    test.equal(result[1].age, 600);
};

exports['aggregate with skip and limit'] = function (test) {
    var result = store.aggregate({ $skip: 1 }, { $limit: 1 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
};

