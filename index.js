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

module.exports = class JsonOperator {
  constructor(target, path, altJp) {
    this.target = target;
    this.path = path;
    this.jp = jp || altJp;
    this.mergeOp = merge; // by default use lodash merge
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

  delete(path) {
    this.apply((value) => {
      return undefined;
    }, path)    
  }

  overwrite(obj, path) {    
    this.apply((value) => {
      return obj;
    }, path)    
  }

  deepMerge(obj, opts = {}) {
    opts.deep = true
    this.merge(obj, opts)
  }

  merge(obj, opts = {}) {
    let mergeOp;      
    mergeOp = mergeOp || (opts || opts.type == 'deep' || opts.deep) ? this.mergeOp : Object.assign;  

    this.apply((value) => {
      if (this.createMerge) {
        opts.mergeObj = obj;
        opts.targetObj = value;
        mergeOp = this.createMerge(opts);
      }

      return opts.reverse ? mergeOp({}, obj, value) : mergeOp({}, value, obj);
    }, extractPath(opts))    
  }

  reverseMerge(obj, path) {
    this.merge(obj, { reverse: true, path: path })    
  }

  apply(fn, path) {    
    return this.jp.apply(this.target, path || this.path, fn);    
  }
}