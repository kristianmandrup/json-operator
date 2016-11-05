## Changelog

### 1.3.1

- Rename `insertBefore` and `insertAfter` to `prepend` and `append`.
- Rename `push` to `concat` and make it concat
- Add `splice` method

### 1.3.0

*Add flat and normalize* 

- Added [normalizr](https://www.npmjs.com/package/normalizr)
- Added `flatten` and `unflatten` functions to flatten nested object via [flat](https://www.npmjs.com/package/flat)

Using my [flat fork](https://github.com/kristianmandrup/flat)

*Flatten example*

```js
let obj = {
  x: {
    a: {
      b: [{name: hello}]
      c: {
        name: 'hello'
        status: 'done'
      }
    }
  },
  y: [],
  v: 'hello'
}

let flatObj = operator.flatten(flattenOpts)

let obj = {
  'x.a.b': [...],
  'x.a.c': {
    name: 'hello'
    ...
  }
  y: []
  v: 'hello
}
```

*normalize*

```js
const article = new Schema('articles');
const user = new Schema('users');
 
article.define({
  author: user,
  contributors: arrayOf(user),
  meta: {
    likes: arrayOf({
      user: user
    })
  }
});
 
// ... 
 
// Normalize one article object 
const json = { id: 1, author: ... };
const normalized = normalize(json, article);
 
// Normalize an array of article objects 
const arr = [{ id: 1, author: ... }, ...]
const normalized = normalize(arr, arrayOf(article));

// with OPERATOR

let result = operator.normalize(
  arrayOf(article), 
  normalizeOpts
).value

```

### 1.2.3

Improve insert functionality

### 1.2.1

- Introduce `insert` and `insertAt` to inser objects :)

### 1.2.0

- Introduce `and` getter as alias for `withSame`
- Using `with(path)`, `.withSame` and `done()` for improved mutation scoping

### 1.1.2

- Add `.lastPath` and `.withSame` for better chaining :)
- Add history with `path` and `operation` for each modification.

### 1.1.1

Added chaining on mutator operations :)

### 1.1.0

Added `.result` and improved docs. Improved `delete`

### 1.0.1

  API changes:
  - changed `set` to `overwrite` to make it more clear and not conflict with built in `set` method
  - allow override of `mergeOp`
  - allow calling `merge` with `{type: 'deep}` otherwise using shallow merge  
  - add `deepMerge` convenience method
  - add optional `createMerge` factory function, that can be used to return custom merge function given options (and obj)
  - add `createMerge` examples

### 1.0.1

  API changes:
  - Changed `get` to `query`
  - Added `targetAsStr` and `display` methods
  - Added option to set alternative `jsonpath` engine 

  - API
    - setters/getters 
      - .path : default operator path
      - .target : target object
      - .jp : jsonpath engine      
    - targetAsStr(indent = 2) : get prettified string of target obj
    - display(indent, logger) : display prettified string of target obj using logger (default console.log) 
    - query(path) : get all match results in list
    - value(path) : get first match result
    - parent(path) : parent of first match
    - delete(path) : delete all matches
    - set(obj, path) : set matches to new object
    - merge(obj, opts) : merge matches with new object
    - reverseMerge(obj, opts) : merge matches with new object
    - apply(fn, path) : apply function matches

### 1.0.0
  - initial version
  - API
    - setters/getters 
      - .path : default operator path
      - .target : target object      

    - get(path) : get all match results in list
    - value(path) : get first match result
    - parent(path) : parent of first match
    - delete(path) : delete all matches
    - set(obj, path) : set matches to new object
    - merge(obj, opts) : merge matches with new object
    - reverseMerge(obj, opts) : merge matches with new object
