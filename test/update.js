
var ostore = require('..');
    
exports['update age'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);

    store.update(1, { age: 801 });

    var result = store.get(1);
    test.ok(result);
    test.equal(result.name, 'Adam');
    test.equal(result.age, 801);
}

exports['update age using criteria'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    var eve = { name: 'Eve', age: 700 };
    
    store.add(adam);
    store.add(eve);

    store.update({ name: 'Adam' }, { age: 801 });

    var result = store.find({ name: 'Adam' });
    test.ok(result);
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 801);

    var result = store.find({ name: 'Eve' });
    test.ok(result);
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
}
