const jp = require('jsonpath');
const merge = require('lodash.merge');

module.exports = class JsonOperator {
  constructor(target, path) {
    this.target = target;
    this.path = path; 
  }

  get(path) {
    console.log('get', path || this.path)
    return jp.query(this.target, path || this.path);
  }

  value(path) {
    return jp.value(this.target, path || this.path);
  }

  parent(path) {
    return jp.parent(this.target, path || this.path);
  }

  delete(path) {
    this.apply((value) => {
      value = undefined;
    }, path)    
  }

  set(obj, path) {    
    this.apply((value) => {
      console.log('set', value, 'WITH', obj)
      return obj;
    }, path)    
  }

  merge(obj, opts = {}) {    
    this.apply((value) => {
      return opts.reverse ? merge({}, obj, value) : merge({}, value, obj);
    }, opts.path || opts)    
  }

  reverseMerge(obj, path) {
    this.merge(obj, { reverse: true, path: path })    
  }

  apply(fn, path) {    
    return jp.apply(this.target, path || this.path, fn);    
  }
}