## Changelog

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
