
var ostore = require('..');

exports['get null if not exists'] = function (test) {
    var store = ostore.createStore();
    var result = store.get(1);

    test.equal(result, null);
};

exports['put and get'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);
    var result = store.get(1);
    test.ok(result);
    test.equal(result.name, 'Adam');
    test.equal(result.age, 800);
};

exports['put and get two values'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);
    var eve = { name: 'Eve', age: 700 };
    store.put(2, eve);
    var result = store.get(1);
    test.ok(result);
    test.equal(result.name, 'Adam');
    test.equal(result.age, 800);
    var result = store.get(2);
    test.ok(result);
    test.equal(result.name, 'Eve');
    test.equal(result.age, 700);
};
