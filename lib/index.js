const jp = require('jsonpath');
const merge = require('lodash.merge');
// const flat = require('flat')

function isObject(obj) {
  return obj === Object(obj);
}

module.exports = class JsonOperator {
  constructor(target, opts = {}) {
    const { path, jsonpath, mergeFun, createMerge } = opts;
    this.target = target;
    this.path = path;
    this.paths = [];
    this.flat = opts.flat
    this.jp = jsonpath || jp;
    this.createMerge = createMerge;
    this.mergeOp = mergeFun || merge; // by default use lodash merge

    this.withPaths = []; // scope stack
    // aliases
    this.and = this.withSame;
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

  with(path) {
    // only create new scope if new path
    if (path !== this.withPaths[this.withPaths.length]) {
      this.withPaths.push(path);
    }
    return this;
  }

  get withSame() {
    return this.with(this.lastPath);
  }

  normalize(schema, opts = {}) {
    return this._apply((value, ctx) => {
      return normalizr(value, schema, opts)
    })        
  }

  // uses flat
  // https://github.com/hughsk/flat
  flatten(opts = {}) {
    return this._apply((value, ctx) => {
      return flat(value, opts)
    })    
  }

  unflatten(opts = {}) {
    return this._apply((value, ctx) => {
      return flat.unflatten(value, opts)
    })    
  }

  done() {
    this.withPaths.pop();
    return this;
  }


  get history() {
    return this.paths;
  }

  // MUTATIONS

  // returning ':delete:' causes node to be deleted from parent obj by key :)
  // If parent is Array, use special remove object:
  //
  // - https://github.com/kristianmandrup/jsonpath/blob/master/test/sugar.js#L43
  // - https://github.com/kristianmandrup/jsonpath/blob/master/test/sugar.js#L69


  concat(insertObj, opts = {}) {
    var { path, condition } = opts;
    return this.apply((value, ctx) => {
      if (condition && !condition(value, ctx)) {
        return value;
      }

      let parent = ctx.parent;
      if (Array.isArray(parent) && insertObj) {        
        parent = parent.concat(insertObj);
      }
      return value;
    }, path, 'concat')
  }

  splice(opts = {}) {
    var { path, condition } = opts;
    return this.apply((value, ctx) => {
      if (condition && !condition(value, ctx)) {
        return value;
      }

      let start = opts.start || 1
      let deleteCount = opts.deleteCount || 0
      let insertObj = opts.insertObj

      let parent = ctx.parent;
      if (Array.isArray(parent)) {
        if (insertObj) {
          parent.splice(start, deleteCount, insertObj);
        } else {
          parent.splice(start, deleteCount);
        }        
      }
      return value;
    }, path, 'splice')
  }

  prepend(insertObj, path, opts = {}) {
    var { path, condition } = opts;
    return this.apply((value, ctx) => {
      if (condition && !condition(value, ctx)) {
        return value;
      }

      let parent = ctx.parent;
      if (Array.isArray(parent) && insertObj) {
        parent.splice(ctx.key, 0, insertObj);
      }
      return value;
    }, path, 'prepend')
  }

  append(insertObj, path, opts = {}) {
    var { path, condition } = opts;
    return this.apply((value, ctx) => {
      if (condition && !condition(value, ctx)) {
        return value;
      }

      let parent = ctx.parent;
      if (Array.isArray(parent) && insertObj) {
        parent.splice(ctx.key + 1, 0, insertObj);
      }
      return value;
    }, path, 'append')
  }

  insertAt(insertObj, key, opts = {}) {
    var { path, condition } = opts;
    return this.apply((value, ctx) => {
      if (condition && !condition(value, ctx)) {
        return value;
      }

      if (isObject(value) && insertObj && key) {
        value[key] = insertObj;
      }
      return value;
    }, path, 'insertAt')
  }

  delete(opts = {}) {
    var { path, condition } = opts;
    return this.filter((value, ctx) => {
      if (condition) {
        return condition(value, ctx)
      }
      // by default always delete it
      return true;
    }, path, 'delete')
  }

  overwrite(obj, opts = {}) {
    var { path, condition } = opts;
    return this.apply((value, ctx) => {
      if (condition) {
        return condition(value, ctx) ? obj : value;
      }
      return obj;
    }, path, 'overwrite')
  }

  deepMerge(obj, opts = {}) {
    opts.deep = true
    return this.merge(obj, opts, 'deepMerge')
  }

  merge(obj, opts = {}, operation) {
    var { path, condition } = opts;
    let mergeOp;
    mergeOp = mergeOp || (opts || opts.type == 'deep' || opts.deep) ? this.mergeOp : Object.assign;

    return this.apply((value, ctx) => {
      if (condition && !condition(value, ctx)) {
        return value;
      }

      if (this.createMerge) {
        opts.mergeObj = obj;
        opts.targetObj = value;
        mergeOp = this.createMerge(opts);
      }

      return opts.reverse ? mergeOp({}, obj, value) : mergeOp({}, value, obj);
    }, path, operation || 'merge')
  }

  reverseMerge(obj, path) {
    return this.merge(obj, { reverse: true, path: path }, 'reverseMerge')
  }

  filter(fn, path, operation) {
    return this._run('filter', fn, path, operation)
  }

  apply(fn, path, operation) {
    return this._run('apply', fn, path, operation)
  }

  // protected
  _run(jpFun, fn, path, operation) {
    let latestWithPath = this.withPaths[this.withPaths.length];

    this.lastPath = path || latestWithPath || this.lastPath || this.path;

    // build history
    this.paths.push({
      path: this.lastPath,
      operation: operation
    });

    this.jp[jpFun](this.target, this.lastPath, fn);
    return this;
  }
}