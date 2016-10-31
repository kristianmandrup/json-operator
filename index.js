const jp = require('jsonpath');
const merge = require('lodash.merge');

function extractPath(opts) {
  switch (typeof opts) {
    case 'string':
      return opts
    case 'object':
      return opts.path
    default:
      return undefined
  }
}

function isObject(obj) {
  return obj === Object(obj);
}

module.exports = class JsonOperator {
  constructor(target, opts = {}) {
    const { path, jsonpath, mergeFun, createMerge } = opts;
    this.target = target;
    this.path = path;
    this.jp = jsonpath || jp;
    this.createMerge = createMerge;
    this.mergeOp = mergeFun || merge; // by default use lodash merge
  }

  get result() {
    return this.target;
  }

  targetAsStr(indent = 2) {
    return JSON.stringify(this.target, null, indent);
  }

  display(indent = 2, logger = console.log) {
    logger(this.targetAsStr(indent))
  }

  query(path) {
    return this.jp.query(this.target, path || this.path);
  }

  value(path) {
    return this.jp.value(this.target, path || this.path);
  }

  parent(path) {
    return this.jp.parent(this.target, path || this.path);
  }

  // returning ':delete:' causes node to be deleted from parent obj by key :)
  // If parent is Array, use special remove object:
  //
  // - https://github.com/kristianmandrup/jsonpath/blob/master/test/sugar.js#L43
  // - https://github.com/kristianmandrup/jsonpath/blob/master/test/sugar.js#L69

  delete(path, removeObj) {
    return this.apply((value) => {

      // TODO: refactor
      if (removeObj && isObject(removeObj)) {
        if (!isObject(removeObj.removeItem)) {
          var key = removeObj.removeItem || removeObj.removeItemMatching;
          if (key) {
            removeObj = {
              removeItem: {
                id: String(key)
              }
            }
          }
        }

        if (removeObj.removeItem) {
          removeObj.removeItem.match = value;
        }
      }
      if (!removeObj || !removeObj.removeItem) {
        removeObj = null;
      }

      return removeObj || ':delete:';
    }, path)
  }

  deleteItem(removeObj, path) {
    return this.delete(path, removeObj)
  }

  overwrite(obj, path) {
    return this.apply((value) => {
      return obj;
    }, path)
  }

  deepMerge(obj, opts = {}) {
    opts.deep = true
    return this.merge(obj, opts)
  }

  merge(obj, opts = {}) {
    let mergeOp;
    mergeOp = mergeOp || (opts || opts.type == 'deep' || opts.deep) ? this.mergeOp : Object.assign;

    return this.apply((value) => {
      if (this.createMerge) {
        opts.mergeObj = obj;
        opts.targetObj = value;
        mergeOp = this.createMerge(opts);
      }

      return opts.reverse ? mergeOp({}, obj, value) : mergeOp({}, value, obj);
    }, extractPath(opts))
  }

  reverseMerge(obj, path) {
    return this.merge(obj, { reverse: true, path: path })
  }

  apply(fn, path) {
    this.jp.apply(this.target, path || this.path, fn);
    return this;
  }
}