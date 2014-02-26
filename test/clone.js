
var ostore = require('..');

exports['put, change and get'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);
    adam.name = 'Adam Smith';
    adam.age = 60;

    var result = store.get(1);
    test.ok(result);
    test.equal(result.name, 'Adam');
    test.equal(result.age, 800);
}

exports['get, change, get'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);

    var newadam = store.get(1);
    newadam.name = 'Adam Smith';
    newadam.age = 60;

    var result = store.get(1);
    test.ok(result);
    test.equal(result.name, 'Adam');
    test.equal(result.age, 800);
}

exports['put, find, change and find again'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);
    adam.name = 'Adam Smith';
    adam.age = 60;

    var result = store.find(1);
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    
    result[0].name = 'Adam Smith';
    result[0].age = 60;

    var result = store.find(1);
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
}

