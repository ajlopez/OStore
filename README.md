# OStore

In-memory object store for JavaScript, with some MongoDB operators

## Installation

Via npm on Node:

```
npm install ostore
```

In your browser:
TBD

## Usage

Reference in your program
```javascript
var ostore = require('ostore');
```

Create an store
```javascript
var store = ostore.createStore();
```

Put an item with a key
```javascript
var item = { name: 'Adam', age: 800 };
store.put(1, item);
```
The key is NOT added to the item.

Add an item
```javascript
var item = { name: 'Adam', age: 800 };
var id = store.add(item);
```
The key is NOT added to the original item, but the saved item (a clone) has a new field `id`.

Retrieve item by key
```javascript
var item = store.get(id);
```

Remove item by key
```javascript
store.remove(id);
```

Retrieve items
```javascript
var items = store.find(id);
```

Retrieve items with criteria
```javascript
var items = store.find({ name: 'Adam' });
```

Retrieve items with criteria and fields
```javascript
var items = store.find({ name: 'Adam' }, { age: true });
```
In this example, only the `age` is retrieved.

Retrieve all items using empty criteria and fields
```javascript
var items = store.find({ }, { age: true });
```

You can also `null` criteria
```javascript
var items = store.find(null, { age: true });
```

Update fields in an item
```javascript
store.update(1, { age: 700 });
```

## Samples

TBD

## Versions

- 0.0.1 Published
- 0.0.2 Published, fixing package.json
- 0.0.3 Published, remove added
- 0.0.4 Published, store.clear

## To Do

- Remove item
- Browser support
- Dog fooding in a project

## Inception

It was born after reading an email at Node.js list:
[Tests for a REST store generator](https://groups.google.com/forum/?hl=en?hl%3Den#!topic/nodejs/zabJWGd3MUQ)

There are some recorded videos showing my TDD workflow (before switching to use simpleunit framework):

[TDD Rocks! (7) OStore With JavaScript/Node.Js](http://ajlopez.wordpress.com/2013/12/21/tdd-rocks-7-ostore-with-javascriptnode-js/)
[TDD Rocks! (2) OStore With JavaScript/Node.Js](http://ajlopez.wordpress.com/2013/11/11/tdd-rocks-2-ostore-with-javascriptnode-js/)

And one video about JavaScript and TDD:

[TDD Rocks! (9) JavaScript And Node.Js](http://ajlopez.wordpress.com/2014/01/16/tdd-rocks-9-javascript-and-node-js/)

## Contribution

Feel free to [file issues](https://github.com/ajlopez/OStore) and submit
[pull requests](https://github.com/ajlopez/OStore/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

