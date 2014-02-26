
function Store() {
    var values = {};
    var maxid = 0;
    
    this.get = function (id) {
        if (!values[id])
            return null;
            
        return clone(values[id]);
    };
    
    this.put = function (id, item) {
        values[id] = clone(item);
    };
    
    this.add = function (item) {
        var newitem = clone(item);
        newitem.id = ++maxid;
        values[newitem.id] = newitem;
        return newitem.id;
    };
    
    this.update = function (id, newvalues) {
        var item = values[id];
        
        for (var n in newvalues)
            item[n] = newvalues[n];
    };
    
    this.find = function (criteria) {
        var result = [];
        
        for (var n in values) {
            var value = values[n];
            
            if (match(criteria, value))
                result.push(clone(value));
        }
        
        return result;
    };
}

function match(criteria, value)
{
    for (var n in criteria)
        if (criteria[n] !== value[n])
            return false;
            
    return true;
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

