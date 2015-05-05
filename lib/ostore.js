
var operators = {
    $lt: function (value, criterium) { return value < criterium; },
    $gt: function (value, criterium) { return value > criterium; },
    $lte: function (value, criterium) { return value <= criterium; },
    $gte: function (value, criterium) { return value >= criterium; },
    $ne: function (value, criterium) { return value != criterium; },
    $eq: function (value, criterium) { return value == criterium; },
    $in: function (value, criterium) { return criterium.indexOf(value) >= 0; },
    $or: function (value, criteria) {
        for (var n in criteria) {
            var criterium = criteria[n];
            
            if (match(criterium, value))
                return true;
        }
        
        return false;
    }
}

function Store() {
    var values = {};
    var maxid = 0;
    
    this.clear = function() {
        values = {};
        maxid = 0;
    };
    
    this.get = function (id) {
        if (!values[id])
            return null;
            
        return clone(values[id]);
    };
    
    this.put = function (id, item) {
        values[id] = clone(item);
    };
    
    this.remove = function (id) {
        delete values[id];
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
    
    this.find = function (criteria, fields) {
        var result = [];
        
        for (var n in values) {
            var value = values[n];
            
            if (match(criteria, value))
                result.push(clone(value, fields));
        }
        
        return result;
    };
}

function match(criteria, value)
{
    for (var n in criteria) {
        var criterium = criteria[n];
        
        if (typeof criterium == 'object' && !Array.isArray(criterium))
            return match(criterium, value[n]);
        
        if (n[0] == '$') {
            if (operators[n])
                if (operators[n](value, criterium))
                    continue;
                else
                    return false;
                    
            throw new Error("Invalid operator '" + n + "'");
        }
        
        if (criterium !== value[n])
            return false;
    }
            
    return true;
}

function clone(item, fields) {
    var cloned = {};
    var keys = null;
    
    if (fields)
        keys = Object.keys(fields);
    
    if (!keys || keys.length == 0)
        for (var n in item)
            cloned[n] = item[n];
    else     
        for (var n in fields) {
            if (fields[n])
                cloned[n] = item[n];
        }

    return cloned;
}

function createStore() {
    return new Store();
}

module.exports = {
    createStore: createStore
}

