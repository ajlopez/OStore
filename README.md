# OStore

In-memory object store for JavaScript

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

## Inception

It was born after reading an email at Node.js list:
[Tests for a REST store generator](https://groups.google.com/forum/?hl=en?hl%3Den#!topic/nodejs/zabJWGd3MUQ)

## Contribution

Feel free to [file issues](https://github.com/ajlopez/OStore) and submit
[pull requests](https://github.com/ajlopez/OStore/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

