
var ostore = require('..');

exports['add and get an item'] = function (test) {
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
};

exports['add and get two items'] = function (test) {
    var store = ostore.createStore();
    var item1 = { name: 'Adam', age: 800 };
    var item2 = { name: 'Eve', age: 600 };
    
    var result1 = store.add(item1);
    var result2 = store.add(item2);
    
    test.ok(result1);
    test.equal(result1, 1);
    test.equal(item1.id, null);

    test.ok(result2);
    test.equal(result2, 2);
    test.equal(item2.id, null);
    
    var newitem1 = store.get(result1);
    
    test.ok(newitem1);
    test.equal(newitem1.id, result1);
    test.equal(newitem1.name, item1.name);
    test.equal(newitem1.age, item1.age);
    
    var newitem2 = store.get(result2);
    
    test.ok(newitem2);
    test.equal(newitem2.id, result2);
    test.equal(newitem2.name, item2.name);
    test.equal(newitem2.age, item2.age);
};

