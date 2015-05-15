
function whenthen(value, criteria, when, then) {
        for (var n in criteria) {
            var criterium = criteria[n];
            
            if (match(criterium, value) == when)
                return then;
        }
        
        return !then;
}

var operators = {
    $lt: function (value, criterium) { return value < criterium; },
    $gt: function (value, criterium) { return value > criterium; },
    $lte: function (value, criterium) { return value <= criterium; },
    $gte: function (value, criterium) { return value >= criterium; },
    $ne: function (value, criterium) { return value != criterium; },
    $eq: function (value, criterium) { return value == criterium; },
    $in: function (value, criterium) { return criterium.indexOf(value) >= 0; },
    $nin: function (value, criterium) { return criterium.indexOf(value) < 0; },
    $not: function (value, criterium) { return !match(criterium, value); },
    $or: function (value, criteria) { return whenthen(value, criteria, true, true); },
    $nor: function (value, criteria) { return whenthen(value, criteria, true, false); },
    $and: function (value, criteria) { return whenthen(value, criteria, false, false); },
    $exists: function (value, criteria) {
        var exists = (value !== undefined);
        return exists == criteria;
    },
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
        return find(values, criteria, fields);
    };
    
    this.aggregate = function () {
        return aggregate(values, Array.prototype.slice.call(arguments));
    }
}

function find(values, criteria, fields) {
    var result = [];
    
    for (var n in values) {
        var value = values[n];
        
        if (match(criteria, value))
            result.push(clone(value, fields));
    }
    
    return result;
}

function aggregate(values, specs) {
    if (!specs || !specs.length) {
        if (Array.isArray(values))
            return values;
            
        var result = [];
        
        for (var n in values)
            result.push(clone(values[n]));
        
        return result;
    }

    var spec = specs.shift();
    
    var result = [];
    
    if (spec && spec.$match)
        return aggregate(find(values, spec.$match), specs);
        
    var nv = 0;
    
    for (var n in values) {
        var value = values[n];
        nv++;
        
        if (spec && spec.$skip)
            if (nv <= spec.$skip)
                continue;
        
        result.push(clone(value));
        
        if (spec && spec.$limit)
            if (result.length >= spec.$limit)
                break;
    }
    
    return aggregate(result, specs);
}

function match(criteria, value)
{
    for (var n in criteria) {
        var criterium = criteria[n];
        
        if (n[0] == '$') {
            if (operators[n])
                if (operators[n](value, criterium))
                    continue;
                else
                    return false;
                    
            throw new Error("Invalid operator '" + n + "'");
        }
        
        if (typeof criterium == 'object' && !Array.isArray(criterium))
            return match(criterium, value[n]);
        
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

