
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

