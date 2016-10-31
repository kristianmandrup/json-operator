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

  set(obj, path) {    
    this.apply((value) => {
      return obj;
    }, path)    
  }

  merge(obj, opts = {}) {
    this.apply((value) => {
      return opts.reverse ? merge({}, obj, value) : merge({}, value, obj);
    }, extractPath(opts))    
  }

  reverseMerge(obj, path) {
    this.merge(obj, { reverse: true, path: path })    
  }

  apply(fn, path) {    
    return this.jp.apply(this.target, path || this.path, fn);    
  }
}