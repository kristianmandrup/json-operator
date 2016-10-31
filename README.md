# JSON Operator

Perform efficient path based operations on JSON Objects (or most Javascript data object)

## Install

`npm i json-operator --save`

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

Full API example

```js
const operator = new JsonOperator(store)

let paths = {
  book2: '$..book[2]',
  book3: '$..book[3]'
}

let book2 = operator.get(paths.book2);
console.log('original book 2', book2)

let book2val = operator.value(paths.book2);
console.log('original book 2 value', book2val)

// let book2par = operator.parent(paths.book2);
// console.log('original book 2 parent', book2par)

let book3 = operator.get(paths.book3);
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
operator.merge({rating: 4}, {reverse: true, path: mergePath})
operator.reverseMerge({rating: 4})
operator.reverseMerge({rating: 4}, path)
```

The example can be found in `/examples/demo.js` in the repo. 

## Alternative

Some of the jsonpath alternative transformers

- [jsonpath-plus](https://www.npmjs.com/package/jsonpath-plus)
- [jsonpath-transform](https://www.npmjs.com/package/jsonpath-transform)

Would be nice if we could combine the best of all ;)

## Licences

MIT 

Kristian Mandrup <kmandrup@gmail.com> 2016