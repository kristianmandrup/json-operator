const JsonOperator = require('../index');
const store = require('./store');

// second book
const operator = new JsonOperator(store)

let paths = {
  book2: '$..book[2]',
  book3: '$..book[3]'
}

let book2 = operator.query(paths.book2);
console.log('original book 2', book2)

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
operator.overwrite(book2val)
let book3Set = operator.value(); 

console.log('original book 3', book3)
console.log('book 3 set', book3Set)

// overwrite book2 with value found at book3
operator.merge({price: 100})
let book3Merged = operator.value()

console.log('original book 3', book3)
console.log('book 3 set', book3Set)
console.log('book 3 merged', book3Merged)

// for reverse merge, use any of:  
// operator.merge({price: 100}, {reverse: true})
// operator.merge({price: 100}, {reverse: true, path: mergePath})
// operator.reverseMerge({price: 100})
// operator.reverseMerge({price: 100}, {path})

operator.delete()
let book3deleted = operator.value()
console.log('book 3 deleted', book3deleted)
console.log('store after all operations', operator.targetAsStr())