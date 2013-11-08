var first = require('../index.js'),
    assert = require('assert')

// 1. No arguments
var test1 = first()
assert.equal(null, test1, 'firstKey() should return null')


// 2. Single object with no keys
var test2 = first({})
assert.equal(null, test2, 'firstKey(obj) should return null')


// 3. Single object with keys
var test3 = first({ foo: 'oof', bar: 'rab' })
assert.equal(null, test3, 'firstKey(obj) should return null')


// 4. Find a single key
var test4 = first({ foo: 'bar' }, 'foo')
assert.equal('foo', test4, 'expecting to find key "foo"')


// 5. Find the text property for innerHTML only
var test5 = first({ 
    style: {}, 
    innerHTML: 'cat' 
}, 'textContent', 'innerText', 'innerHTML')
assert.equal('innerHTML', test5, 'expecting to find key "innerHTML"')


// 6. Find the text property for innerText and innerHTML
var test6 = first({ 
    style: {},
    innerText: 'cat', 
    innerHTML: 'cat' 
}, 'textContent', 'innerText', 'innerHTML')
assert.equal('innerText', test6, 'expecting to find key "innerText"')

// 7. Find the text proeprty for textContent, innerText and innerHTML
var test6 = first({ 
    style: {},
    textContent: 'cat',
    innerText: 'cat', 
    innerHTML: 'cat' 
}, 'textContent', 'innerText', 'innerHTML')
assert.equal('textContent', test6, 'expecting to find key "textContent"')


