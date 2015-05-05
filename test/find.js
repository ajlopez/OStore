
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

exports['find using $gte and $lte operators'] = function (test) {
    var result = store.find({ age: { $gte: 600, $lte: 700 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);

    var result = store.find({ age: { $gte: 600, $lte: 800 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);

    var result = store.find({ age: { $gte: 800, $lte: 900 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['find using $eq operator'] = function (test) {
    var result = store.find({ age: { $eq: 800 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].age, 800);

    var result = store.find({ age: { $eq: 700 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['find using $ne operator'] = function (test) {
    var result = store.find({ age: { $ne: 700 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].age, 800);

    var result = store.find({ age: { $ne: 800 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['find using invalid operator $foo'] = function (test) {
    test.throws(
        function () {
            store.find({ age: { $foo: 600 } });
        },
        "Invalid operator '$foo'"
    );
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

exports['put and find using $in'] = function (test) {
    var abel = { name: 'Abel', age: 600 };
    store.put(2, abel);
    var caine = { name: 'Caine', age: 500 };
    store.put(3, caine);

    var result = store.find({ name: { $in: ['Adam', 'Caine'] }});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[1].name, 'Caine');
    test.equal(result[1].age, 500);
};

exports['find using $or'] = function (test) {
    var result = store.find({ $or: [ { name: 'Adam' }, { age: 500 } ] });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[1].name, 'Caine');
    test.equal(result[1].age, 500);
};

exports['clear and find'] = function (test) {
    store.clear();
    var result = store.find();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};
