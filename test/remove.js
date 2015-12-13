
var ostore = require('..');

exports['add and remove an item'] = function (test) {
    var store = ostore.createStore();
    var item = { name: 'Adam', age: 800 };
    
    var result = store.add(item);
    
    test.ok(result);
    test.equal(result, 1);
    test.equal(item.id, null);
    
    var newitem = store.get(result);
    
    test.ok(newitem);
    test.equal(newitem.id, result);
    test.equal(newitem.name, item.name);
    test.equal(newitem.age, item.age);
    
    store.remove(result);
    
    test.equal(store.get(result), null);
};

exports['remove item using criteria'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    var eve = { name: 'Eve', age: 700 };
    
    store.add(adam);
    store.add(eve);
    
    store.remove({ name: 'Adam' });
    
    var result = store.find();
    
    test.ok(result);
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
};

exports['remove item using criteria with operator'] = function (test) {
    var store = ostore.createStore();
    var adam = { name: 'Adam', age: 800 };
    var eve = { name: 'Eve', age: 700 };
    
    store.add(adam);
    store.add(eve);
    
    store.remove({ age: { $gt: 100 } });
    
    var result = store.find();
    
    test.ok(result);
    test.equal(result.length, 0);
};
