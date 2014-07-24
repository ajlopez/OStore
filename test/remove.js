
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
