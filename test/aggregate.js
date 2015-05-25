
var ostore = require('..');

var store = ostore.createStore();

exports['aggregate with no results'] = function (test) {
    var result = store.aggregate();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['add and aggregate'] = function (test) {
    var adam = { name: 'Adam', age: 800 };
    store.add(adam);

    var result = store.aggregate();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['put and aggregate with match'] = function (test) {
    var eve = { name: 'Eve', age: 700 };
    store.add(eve);
    var abel = { name: 'Abel', age: 600 };
    store.add(abel);

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

exports['aggregate with match and limit in the same option object'] = function (test) {
    var result = store.aggregate({ $match: { age: { $gt: 100 } }, $limit: 2 });
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

exports['aggregate with skip and limit in the same option object'] = function (test) {
    var result = store.aggregate({ $skip: 1, $limit: 1 });
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

exports['aggregate with project with field equals 1'] = function (test) {
    var result = store.aggregate({ $project: { name: 1 } });
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

exports['aggregate with project excluding field using -1'] = function (test) {
    var result = store.aggregate({ $project: { age: -1 } });
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

exports['aggregate with project and new field with constant value'] = function (test) {
    var result = store.aggregate({ $project: { weight: 100 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[0].weight, 100);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.equal(result[1].weight, 100);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.equal(result[2].weight, 100);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression'] = function (test) {
    var result = store.aggregate({ $project: { has800: { $eq: [ "$age", 800 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].has800, true);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].has800, false);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].has800, false);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression value field'] = function (test) {
    var result = store.aggregate({ $project: { has800: { $eq: [ 800, "$age" ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].has800, true);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].has800, false);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].has800, false);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions'] = function (test) {
    var result = store.aggregate({ $project: { hasNot800: { $ne: [ "$age", 800 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].hasNot800, false);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].hasNot800, true);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].hasNot800, true);
    test.ok(result[2].id);
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

exports['aggregate with sort by name using 1'] = function (test) {
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

exports['aggregate with sort by name using true'] = function (test) {
    var result = store.aggregate({ $sort: { name: true } });
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

exports['aggregate with sort by name using -1'] = function (test) {
    var result = store.aggregate({ $sort: { name: -1 }});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Adam');
    test.equal(result[1].age, 800);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.ok(result[2].id);
};

exports['aggregate with sort by name using false'] = function (test) {
    var result = store.aggregate({ $sort: { name: false }});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Adam');
    test.equal(result[1].age, 800);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.ok(result[2].id);
};

