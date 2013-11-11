var document = require("global/document")
var window = require("global/window")

var createBuffer = require("triangle-buffer")
var raf = require("request-animation-frame").requestAnimationFrame
var Viewport = require("css-viewport")


var createCamera = require("./lib/camera.js")
var triangleModel = require("./lib/triangle-model.js")
var catModel = require("./models/cat.json")
var catShader = require("./models/cat.shader.js")
var teapotModel = require("./models/teapot.json")

var viewport = new Viewport(Math.PI/2)
var triangleBuffer = createBuffer(document.body, viewport)


var models = [
    triangleModel(triangleBuffer, catModel),
    triangleModel(triangleBuffer, teapotModel)
]

var shaders = [
    catShader
]

// Update the viewport perspective on window resize
window.addEventListener("resize", updatePerspective)
updatePerspective();

function updatePerspective() {
    viewport.update(document.body)
}

triangleBuffer.backfaceVisible(false)
triangleBuffer.on("shade", function () {
    var shader = shaders[modelIndex]
    if (shader) {
        shader.apply(null, arguments)
    }
})

var now = Date.now()
var then
var delta = 0
var modelIndex = 0;
var camera = createCamera({
    radius: 140,
    angleY: Math.PI,
    angleX: Math.PI / 4
})

;(function animloop() {
    raf(animloop)

    now = Date.now()
    delta = then ? (now - then) / 1000 : 0

    triangleBuffer.loadMatrix(camera(delta))
    triangleBuffer.color("rgb(0,50,90)")
    triangleBuffer.begin()
    models[modelIndex](triangleBuffer)
    triangleBuffer.end()
    then = now
})()
