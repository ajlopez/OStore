
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
        values = find(values, spec.$match);
        
    var nv = 0;
    
    for (var n in values) {
        var value = values[n];
        nv++;
        
        if (spec && spec.$skip)
            if (nv <= spec.$skip)
                continue;

        if (spec && spec.$project)
            result.push(clone(value, spec.$project));
        else
            result.push(clone(value));
        
        if (spec && spec.$limit)
            if (result.length >= spec.$limit)
                break;
    }
	
	if (spec && spec.$sort) {
		var name = Object.keys(spec.$sort)[0];
		var descending = spec.$sort[name] !== 1 && spec.$sort[name] !== true;
        
		result.sort(function (a, b) {
            var aval = a[name];
            var bval = b[name];
            
            if (aval < bval)
                if (descending)
                    return 1;
                else
                    return -1;
                
            if (aval > bval)
                if (descending)
                    return -1;
                else
                    return 1;
                
            return 0;
        });		
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
    else {
        var docopy = true;
        
        for (var n in fields)
            if (fields[n] === 1 || fields[n] === true)
                docopy = false;
        
        for (var n in item) {
            if (fields[n] === 0 || fields[n] === false)
                continue;
            else if ((fields[n] === 1 || fields[n] === true) || (docopy && fields[n] === undefined))
                cloned[n] = item[n];
        }
        
        for (var n in fields) {
            var fldvalue = fields[n];
            
            if (fldvalue === 1 || fldvalue === -1 || fldvalue === true || fldvalue === false)
                continue;

            if (typeof fldvalue === 'object')
                cloned[n] = evaluate(item, fldvalue);
            else
                cloned[n] = fldvalue;
        }
    }

    return cloned;
}

function evaluate(data, expr) {
    if (expr.$eq)
        return getValue(data, expr.$eq[0]) == getValue(data, expr.$eq[1]);
    if (expr.$ne)
        return getValue(data, expr.$ne[0]) != getValue(data, expr.$ne[1]);
    if (expr.$lt)
        return getValue(data, expr.$lt[0]) < getValue(data, expr.$lt[1]);
    if (expr.$gt)
        return getValue(data, expr.$gt[0]) > getValue(data, expr.$gt[1]);
    if (expr.$gte)
        return getValue(data, expr.$gte[0]) >= getValue(data, expr.$gte[1]);
}

function getValue(data, value) {
    if (typeof value == 'string')
        if (value[0] == '$')
            return data[value.substring(1)];
            
    return value;
}

function createStore() {
    return new Store();
}

module.exports = {
    createStore: createStore
}

