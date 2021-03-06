
var ostore = require('..');
    
exports['create a store'] = function (test) {
    var store = ostore.createStore();
    test.ok(store);
    test.strictEqual(store.name(), null);
}

exports['create a store with name'] = function (test) {
    var store = ostore.createStore('persons');
    test.ok(store);
    test.equal(store.name(), 'persons');
}