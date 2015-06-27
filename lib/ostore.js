
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

var exproperators = {
    $eq: function (values) { return values[0] == values[1]; },
    $ne: function (values) { return values[0] != values[1]; },
    $lt: function (values) { return values[0] < values[1]; },
    $lte: function (values) { return values[0] <= values[1]; },
    $gt: function (values) { return values[0] > values[1]; },
    $gte: function (values) { return values[0] >= values[1]; },
    $substr: function (values) { return values[0].substring(values[1], values[2]); },
    $concat: function (values) { var result = ''; for (var n in values) result += values[n]; return result; },
    $toLower: function (value) { return value.toLowerCase(); },
    $toUpper: function (value) { return value.toUpperCase(); },
    $subtract: function (values) { return values[0] - values[1]; },
    $divide: function (values) { return values[0] / values[1]; },
    $mod: function (values) { return values[0] % values[1]; },
    $add: function (values) { var result = 0; for (var n in values) result += values[n]; return result; },
    $multiply: function (values) { var result = 1; for (var n in values) result *= values[n]; return result; },
    $cmp: function (values) { if (values[0] < values[1]) return -1; if (values[0] > values[1]) return 1; return 0; },
    $strcasecmp: function (values) { 
        var value1 = values[0].toLowerCase();
        var value2 = values[1].toLowerCase();
        
        if (value1 < value2) return -1;
        if (value1 > value2) return 1;
        return 0;
    },
    $literal: function (value) { return value; },
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
    for (var n in expr)
        if (exproperators[n]) {
            var vals = expr[n];
            var values;

            if (n == '$literal')
                values = vals;
            else if (Array.isArray(vals))
                values = getValues(data, vals);
            else
                values = getValue(data, vals);
            
            return exproperators[n](values);
        }
}

function getValues(data, values) {
    var newvalues = [];
    
    values.forEach(function (value) {
        newvalues.push(getValue(data, value));
    });
    
    return newvalues;
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

