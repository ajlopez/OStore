
var ostore = require('..');
    
exports['create a store'] = function (test) {
    var store = ostore.createStore();
    test.ok(store);
}