
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

exports['aggregate with project'] = function (test) {
    var result = store.aggregate({ $project: { name: true } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.strictEqual(result[0].age, undefined);
    test.equal(result[1].name, 'Eve');
    test.strictEqual(result[1].age, undefined);
    test.equal(result[2].name, 'Abel');
    test.strictEqual(result[2].age, undefined);
};

exports['aggregate with project excluding field'] = function (test) {
    var result = store.aggregate({ $project: { age: false } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.strictEqual(result[0].age, undefined);
    test.equal(result[1].name, 'Eve');
    test.strictEqual(result[1].age, undefined);
    test.equal(result[2].name, 'Abel');
    test.strictEqual(result[2].age, undefined);
};

exports['aggregate with project excluding id field'] = function (test) {
    var result = store.aggregate({ $project: { id: false } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].id, undefined);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].id, undefined);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].id, undefined);
};

exports['aggregate with sort by name'] = function (test) {
    var result = store.aggregate({ $sort: { name: 1 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Abel');
    test.equal(result[0].age, 600);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Adam');
    test.equal(result[1].age, 800);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Eve');
    test.equal(result[2].age, 700);
    test.ok(result[2].id);
};
