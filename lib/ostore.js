
function Store() {
    var values = {};
    
    this.get = function (id) {
        return values[id];
    };
    
    this.put = function (id, item) {
        values[id] = clone(item);
    };
    
    this.update = function (id, newvalues) {
        var item = values[id];
        
        for (var n in newvalues)
            item[n] = newvalues[n];
    };
}

function clone(item) {
    var cloned = {};
    
    for (var n in item)
        cloned[n] = item[n];

    return cloned;
}

function createStore() {
    return new Store();
}

module.exports = {
    createStore: createStore
}

