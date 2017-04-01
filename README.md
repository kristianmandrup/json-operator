# JSON Operator

[![Greenkeeper badge](https://badges.greenkeeper.io/kristianmandrup/json-operator.svg)](https://greenkeeper.io/)

Perform efficient path based operations on JSON Objects (or most Javascript data object).

Uses [jsonpath](https://github.com/kristianmandrup/jsonpath) with new `delete` option for `apply`.

## Install

`npm i json-operator --save`

## API

Note: The arguments `indent`, `path` and `opts` are always optional. 

### Constructor

- `constructor(target, {path, jsonpath, mergeFun, createMerge})`

### Setters and getters
  - `.path` : default operator path
  - `.target` : target object
  - `.jp` : jsonpath engine
  - `.createMerge` : `function(opts)`

`createMerge` can be set to factory function which returns custom `merge` function used by `merge` if present. The `opts` will be the options passed to `merge` enriched with `targetObj` and `mergeObj`

### Getters
  - `.history` : history list of `path` and `operation` made
  - `.result` : modified target object
  - `.lastPath` : last path mutation applied

### Display
- `targetAsStr(indent = 2)` : get prettified string of target obj
- `display(indent, logger)` : display prettified string of target obj using logger (default `console.log`) 

### Read values
- `query(path)` : get all match results in list
- `value(path)` : get first match result
- `parent(path)` : parent of first match

### Path operation scope*
- `with(path)` : set `withPath` used in new operations scope
- `withSame()` : use `lastPath` as `withPath` in new operations scope
- `and()` : alias to `withSame`
- `done()` : exit current operation scope

## Mutations

`opts` is an optional argument which may contain:
- `path` : to override current scope path
- `condition` : function to be called with node `value` and `context` (ie. `parent` and `key`) to decide if mutation/action should be performed.

This `condition` function has the signature:

`function(value, {parent, key}) : boolean`

### Insert
- `concat(insertObjs, opts = {})` : concatenate object(s) at the end of parent Array
- `prepend(insertObj, opts = {})` : prepend object before matching node
- `append(insertObj, opts = {})` : append object after matching node
- `insertAt(insertObj, key)` : insert object at key on target object

### Delete
- `delete(opts = {})` : delete matches
- `splice(opts = {})` : `splice` on target object (`start`, `deleteCount`, `insertObj` options)

### Set
- `overwrite(obj, opts = {})` : set match to new object

### Merge
- `merge(obj, opts = {})` : merge matches with new object
- `deepMerge(obj, opts = {})` : deep merge matches with new object
- `reverseMerge(obj, opts = {})` : merge matches with new object

### Delegation (general purpose)
- `apply(fn, path)` : delegates to `jsonpath.apply`
- `filter(fn, path)` : delegates to `jsonpath.filter`

### Flatten/Unflatten

Use the `flatten` and unflatten methods. First you must set the flattener to use, such as [flat](https://github.com/hughsk/flat)
or soon to be `flat2` (WIP)

### Mormalize

Use the `normalize` method which uses [normalizr](https://www.npmjs.com/package/normalizr)

For `flatten` and `normalize` usage examples, see the `Changelog.md` or the documentation for each module (`flat` and `normalizr`).  

*All mutators can be chained beautifully :)*

```js
let finalResult = operator
  .delete({path: delPath.x})
  .merge(obj, {path: mergePaths.a, condition: mySpecialCondition})
  .withSame() // use latest path for new scope
    .overwrite({x: 2}) // overwrite using latest scope path
    .merge(partials[0], {path: mergePaths.b}) // merge using custom path
    .and() // use latest path for new scope
      .merge(objX) // reusing latest path
      .with(specialPath) // create scope with path
        .merge(partials[1]) // merge using scope path
        .with(sweetPath) // create inner scope path
          .merge(partials[2]) // merge using current scope path
        .done() // close current scope
      .done()
    .done()
  .done()
  .result;
```

You can add your custom functions directly to the `operator` object or the class `JsonOperator.prototype`.

## Usage

Given the following book store:

```js
{
  "store": {
    "book": [ 
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      }, {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      }, {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }, {
         "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
```

Note: Books are indexed from 0 as normal, so book [2] is the 3rd book in the list.

We perform the following operations to:
- get the value of book [2]
- get the value of book [3]
- set the default opertor path to book [3]
- overwrite book 3 with book [2]
- merge `{price:100}` onto book [3]
- reverse order merge `{rating: 4}` onto book [3]
- delete book [3]
- display full target object after operations

Full API example

```js
const store = require('./store')
const operator = new JsonOperator(store)

let paths = {
  book2: '$..book[2]',
  book3: '$..book[3]'
}

// query for all matching path
let book2results = operator.query(paths.book2);
console.log('original book 2', book2results)

// get the first match for book 2
let book2val = operator.value(paths.book2);
console.log('original book 2 value', book2val)

// let book2par = operator.parent(paths.book2);
// console.log('original book 2 parent', book2par)

// get the first match for book 3 
let book3 = operator.value(paths.book3);
console.log('original book 3', book3)

// set default path to use for the following ops
operator.path = paths.book3;

// overwrite book3 with book2
operator.set(book2val)
let book3Set = operator.value(); 

console.log('original book 3', book3)
console.log('book 3 set', book3Set)

// overwrite book2 with value found at book3
operator.merge({price: 100})
let book3Merged = operator.value()

console.log('original book 3', book3)
console.log('book 3 set', book3Set)
console.log('book 3 set', book3Merged)

// operator.merge({price: 100}, {reverse: true})
operator.deepMerge({rating: 4}, {reverse: true, path: mergePath})
operator.reverseMerge({rating: 4})
operator.reverseMerge({rating: 4}, {path})

operator.delete()
let book3deleted = operator.value()
console.log('book 3 deleted', book3deleted)
console.log('store after all operations', operator.targetAsStr())
```

### Custom merge

You can define a custom merge function as follows:

```js
// return merge function dependent on option .admin setting
operator.createMerge = (opts) => {
  return (opts.admin) ? fullMerge : partialMerge; 
}

// do full merge
operator.merge({admin: true})

// return merge function dependent on whether role of target object (a User) is 'admin'
operator.createMerge = (opts) => {
  return (opts.targetObj.role === 'admin') ? fullMerge : partialMerge; 
}

operator.target = {
  name: 'kris',
  role: 'admin'
}

// do full merge
operator.merge();

operator.target = {
  name: 'sandy',
  role: 'guest'
}

// do partial merge
operator.merge();
```

The example demo (excluding use of `createMerge`) can be found in `/examples/demo.js` in the repo. 

## Set alternative jsonpath engine

You can now also set an alternative `jsonpath` engine.

```js
const fastpath = require('fastpath');
operator.jp = fastpath;
```

Note: Some `jsonpath` alternatives don't yet have a `filter` function (for `delete`) and be fully compatible. You might however be able to add `filter` (and `apply`) from jsonpath?

```js
fastpath.filter = jsonpath.prototype.filter;
```

## Advanced usage

- [through2](https://github.com/rvagg/through2)
- [stream-handbook](https://github.com/substack/stream-handbook)

Example:

```js
var all = []

fs.createReadStream('./data.json')
  .pipe(split())
  .pipe(through2.obj(function (obj, enc, callback) {
    const operator = new JsonOperator(obj)
    // some JSON operations
    // ...
    let data = operator.result;
    this.push(data)
    callback()
  }))
  .on('data', function (data) {
    all.push(data)
  })
  .on('end', function () {
    doSomethingSpecial(all)
  })
```

To operate efficiently on a folder with `json` file perhaps use [readdirp](https://github.com/thlorenz/readdirp) to read directory as a stream.
See next example for inspiration.

### Mongoose streaming example

[querystream](http://mongoosejs.com/docs/2.7.x/docs/querystream.html)

```js
const paths = {
  // ...
  userRole: '$.user.role'
};

const jsonTransformStream = new JsonTransformStream({ paths });

Model.find().stream().pipe(jsonTransformStream).pipe(ctx.body);
```

```
const Transform = require('stream').Transform

module.exports = class JsonTransformStream extends Transform {
  constructor(options = {}) {
    this.operator = new JsonOperator();
    this.paths = options.paths;
    this.objs = options.objs;
  }

  // do some user role operations!
  operateOn(obj) {
    this.operator.target = chunk;
    if (obj.user) {
      this.operator.merge(this.objs.role, {path: this.paths.userRole})
    }
    this.push(this.operator.result);
  }

  _transform(chunk, encoding, done) {
    this.operateOn(chunk)
    done();
  }

  _flush(done) {
      done();
  }
}
```

## Alternatives

Some alternative `jsonpath` transformers

- [jsonpath-plus](https://www.npmjs.com/package/jsonpath-plus)
- [jsonpath-transform](https://www.npmjs.com/package/jsonpath-transform)
- [jsonpath-object-transform](https://www.npmjs.com/package/jsonpath-object-transform)
- [jsonpath-rep](https://www.npmjs.com/package/jsonpath-rep) with replacement

Would be nice if we could combine the best of all ;)

## JSON path alternative

- [jsonave](https://www.npmjs.com/package/jsonave)
- [fastpath](https://www.npmjs.com/package/fastpath)

## Misc

- [jsonpath-to-dot](https://www.npmjs.com/package/jsonpath-to-dot)

## Licences

MIT

Kristian Mandrup <kmandrup@gmail.com> 2016