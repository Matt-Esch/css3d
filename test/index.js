var test = require("tape")

var css3d = require("../index")

test("css3d is a function", function (assert) {
    assert.equal(typeof css3d, "function")
    assert.end()
})
