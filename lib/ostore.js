
function Store() {
    var values = {};
    
    this.get = function (id) {
        return values[id];
    };
    
    this.put = function (id, item) {
        values[id] = item;
    };
}

function createStore() {
    return new Store();
}

module.exports = {
    createStore: createStore
}

