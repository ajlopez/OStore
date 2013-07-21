
function Store() {
    var values = {};
    
    this.get = function (id) {
        return values[id];
    };
    
    this.put = function (id, item) {
        values[id] = item;
    };
    
    this.update = function (id, newvalues) {
        var item = values[id];
        
        for (var n in newvalues)
            item[n] = newvalues[n];
    };
}

function createStore() {
    return new Store();
}

module.exports = {
    createStore: createStore
}

