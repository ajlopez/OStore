
var ostore = require('..');
    
exports['update age'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    store.put(1, adam);

    store.update(1, { age: 801 });

    var result = store.get(1);
    assert.ok(result);
    assert.equal(result.name, 'Adam');
    assert.equal(result.age, 801);
}
