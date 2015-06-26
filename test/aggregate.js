
var ostore = require('..');

var store = ostore.createStore();

exports['aggregate with no results'] = function (test) {
    var result = store.aggregate();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
};

exports['add and aggregate'] = function (test) {
    var adam = { name: 'Adam', age: 800 };
    store.add(adam);

    var result = store.aggregate();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['put and aggregate with match'] = function (test) {
    var eve = { name: 'Eve', age: 700 };
    store.add(eve);
    var abel = { name: 'Abel', age: 600 };
    store.add(abel);

    var result = store.aggregate({ $match: { name: 'Adam' } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
};

exports['aggregate with limit'] = function (test) {
    var result = store.aggregate({ $limit: 2 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
};

exports['aggregate with match and limit'] = function (test) {
    var result = store.aggregate({ $match: { age: { $gt: 100 } } }, { $limit: 2 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
};

exports['aggregate with match and limit in the same option object'] = function (test) {
    var result = store.aggregate({ $match: { age: { $gt: 100 } }, $limit: 2 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
};

exports['aggregate with skip'] = function (test) {
    var result = store.aggregate({ $skip: 1 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 2);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
    test.equal(result[1].name, 'Abel');
    test.equal(result[1].age, 600);
};

exports['aggregate with skip and limit'] = function (test) {
    var result = store.aggregate({ $skip: 1 }, { $limit: 1 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
};

exports['aggregate with skip and limit in the same option object'] = function (test) {
    var result = store.aggregate({ $skip: 1, $limit: 1 });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 1);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
};

exports['aggregate with project'] = function (test) {
    var result = store.aggregate({ $project: { name: true } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.strictEqual(result[0].age, undefined);
    test.equal(result[1].name, 'Eve');
    test.strictEqual(result[1].age, undefined);
    test.equal(result[2].name, 'Abel');
    test.strictEqual(result[2].age, undefined);
};

exports['aggregate with project with field equals 1'] = function (test) {
    var result = store.aggregate({ $project: { name: 1 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.strictEqual(result[0].age, undefined);
    test.equal(result[1].name, 'Eve');
    test.strictEqual(result[1].age, undefined);
    test.equal(result[2].name, 'Abel');
    test.strictEqual(result[2].age, undefined);
};

exports['aggregate with project excluding field'] = function (test) {
    var result = store.aggregate({ $project: { age: false } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.strictEqual(result[0].age, undefined);
    test.equal(result[1].name, 'Eve');
    test.strictEqual(result[1].age, undefined);
    test.equal(result[2].name, 'Abel');
    test.strictEqual(result[2].age, undefined);
};

exports['aggregate with project excluding field using -1'] = function (test) {
    var result = store.aggregate({ $project: { age: -1 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.strictEqual(result[0].age, undefined);
    test.equal(result[1].name, 'Eve');
    test.strictEqual(result[1].age, undefined);
    test.equal(result[2].name, 'Abel');
    test.strictEqual(result[2].age, undefined);
};

exports['aggregate with project and new field with constant value'] = function (test) {
    var result = store.aggregate({ $project: { weight: 100 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[0].weight, 100);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.equal(result[1].weight, 100);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.equal(result[2].weight, 100);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression'] = function (test) {
    var result = store.aggregate({ $project: { has800: { $eq: [ "$age", 800 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].has800, true);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].has800, false);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].has800, false);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression value field'] = function (test) {
    var result = store.aggregate({ $project: { has800: { $eq: [ 800, "$age" ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].has800, true);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].has800, false);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].has800, false);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions'] = function (test) {
    var result = store.aggregate({ $project: { hasNot800: { $ne: [ "$age", 800 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].hasNot800, false);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].hasNot800, true);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].hasNot800, true);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions less than'] = function (test) {
    var result = store.aggregate({ $project: { hasLessThan800: { $lt: [ "$age", 800 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].hasLessThan800, false);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].hasLessThan800, true);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].hasLessThan800, true);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions less than or equal'] = function (test) {
    var result = store.aggregate({ $project: { lessThanOrEqual700: { $lte: [ "$age", 700 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].lessThanOrEqual700, false);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].lessThanOrEqual700, true);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].lessThanOrEqual700, true);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions greater than'] = function (test) {
    var result = store.aggregate({ $project: { greaterThan700: { $gt: [ "$age", 700 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].greaterThan700, true);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].greaterThan700, false);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].greaterThan700, false);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with compare'] = function (test) {
    var result = store.aggregate({ $project: { compare: { $cmp: [ "$age", 700 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].compare, 1);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].compare, 0);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].compare, -1);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with string compare'] = function (test) {
    var result = store.aggregate({ $project: { compare: { $strcasecmp: [ "$name", "adam" ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].compare, 0);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].compare, 1);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].compare, -1);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with mod'] = function (test) {
    var result = store.aggregate({ $project: { modulus: { $mod: [ "$age", 7 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].modulus, 800 % 7);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].modulus, 700 % 7);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].modulus, 600 % 7);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions greater than or equal'] = function (test) {
    var result = store.aggregate({ $project: { greaterThanOrEqual700: { $gte: [ "$age", 700 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].greaterThanOrEqual700, true);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].greaterThanOrEqual700, true);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].greaterThanOrEqual700, false);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions substr'] = function (test) {
    var result = store.aggregate({ $project: { firstLetters: { $substr: [ "$name", 0, 2 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].firstLetters, 'Ad');
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].firstLetters, 'Ev');
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].firstLetters, 'Ab');
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions concat'] = function (test) {
    var result = store.aggregate({ $project: { fullName: { $concat: [ "$name", " Doe" ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].fullName, 'Adam Doe');
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].fullName, 'Eve Doe');
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].fullName, 'Abel Doe');
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions concat many items'] = function (test) {
    var result = store.aggregate({ $project: { fullName: { $concat: [ "Hi, ", "$name", " Doe!" ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].fullName, 'Hi, Adam Doe!');
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].fullName, 'Hi, Eve Doe!');
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].fullName, 'Hi, Abel Doe!');
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression toLower'] = function (test) {
    var result = store.aggregate({ $project: { lowerCaseName: { $toLower: "$name" }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].lowerCaseName, 'adam');
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].lowerCaseName, 'eve');
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].lowerCaseName, 'abel');
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression toUpper'] = function (test) {
    var result = store.aggregate({ $project: { upperCaseName: { $toUpper: "$name" }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].upperCaseName, 'ADAM');
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].upperCaseName, 'EVE');
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].upperCaseName, 'ABEL');
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions add and number'] = function (test) {
    var result = store.aggregate({ $project: { nextAge: { $add: [ "$age", 1 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].nextAge, 801);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].nextAge, 701);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].nextAge, 601);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions number and add'] = function (test) {
    var result = store.aggregate({ $project: { nextAge: { $add: [ 1, "$age" ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].nextAge, 801);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].nextAge, 701);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].nextAge, 601);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions add many numbers'] = function (test) {
    var result = store.aggregate({ $project: { sum: { $add: [ 1, 2, 3, 4, "$age" ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].sum, 810);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].sum, 710);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].sum, 610);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expressions subtract number'] = function (test) {
    var result = store.aggregate({ $project: { previousAge: { $subtract: [ "$age", 100 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].previousAge, 700);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].previousAge, 600);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].previousAge, 500);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression using multiply'] = function (test) {
    var result = store.aggregate({ $project: { doubleAge: { $multiply: [ "$age", 2 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].doubleAge, 1600);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].doubleAge, 1400);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].doubleAge, 1200);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression using multiply many numbers'] = function (test) {
    var result = store.aggregate({ $project: { factorial: { $multiply: [ 1, 2, 3, 4, 5 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].factorial, 120);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].factorial, 120);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].factorial, 120);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with simple expression using divide'] = function (test) {
    var result = store.aggregate({ $project: { halfAge: { $divide: [ "$age", 2 ] }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].halfAge, 800 / 2);
    test.ok(result[0].id);
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].halfAge, 700 / 2);
    test.ok(result[1].id);
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].halfAge, 600 / 2);
    test.ok(result[2].id);
};

exports['aggregate with project and new field with literal string'] = function (test) {
    var result = store.aggregate({ $project: { literal: { $literal: '$literal' }}});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.equal(result[0].literal, '$literal');
    
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.equal(result[1].literal, '$literal');
    
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.equal(result[2].literal, '$literal');
};

exports['aggregate with project excluding id field'] = function (test) {
    var result = store.aggregate({ $project: { id: false } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Adam');
    test.equal(result[0].age, 800);
    test.strictEqual(result[0].id, undefined);
    test.equal(result[1].name, 'Eve');
    test.equal(result[1].age, 700);
    test.strictEqual(result[1].id, undefined);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.strictEqual(result[2].id, undefined);
};

exports['aggregate with sort by name using 1'] = function (test) {
    var result = store.aggregate({ $sort: { name: 1 } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Abel');
    test.equal(result[0].age, 600);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Adam');
    test.equal(result[1].age, 800);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Eve');
    test.equal(result[2].age, 700);
    test.ok(result[2].id);
};

exports['aggregate with sort by name using true'] = function (test) {
    var result = store.aggregate({ $sort: { name: true } });
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Abel');
    test.equal(result[0].age, 600);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Adam');
    test.equal(result[1].age, 800);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Eve');
    test.equal(result[2].age, 700);
    test.ok(result[2].id);
};

exports['aggregate with sort by name using -1'] = function (test) {
    var result = store.aggregate({ $sort: { name: -1 }});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Adam');
    test.equal(result[1].age, 800);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.ok(result[2].id);
};

exports['aggregate with sort by name using false'] = function (test) {
    var result = store.aggregate({ $sort: { name: false }});
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 3);
    test.equal(result[0].name, 'Eve');
    test.equal(result[0].age, 700);
    test.ok(result[0].id);
    test.equal(result[1].name, 'Adam');
    test.equal(result[1].age, 800);
    test.ok(result[1].id);
    test.equal(result[2].name, 'Abel');
    test.equal(result[2].age, 600);
    test.ok(result[2].id);
};

