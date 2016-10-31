## Changelog

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
