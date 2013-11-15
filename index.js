var document = require("global/document")
var window = require("global/window")

var createBuffer = require("triangle-buffer")
var raf = require("request-animation-frame").requestAnimationFrame
var Viewport = require("css-viewport")


var createCamera = require("./lib/camera.js")
var createSpin = require("./lib/spin-camera.js")
var triangleModel = require("./lib/triangle-model.js")
var catModel = require("./models/cat.json")
var catShader = require("./models/cat.shader.js")
var tankModel = require("./models/tank.json")
var teapotModel = require("./models/teapot.json")

var viewport = new Viewport(Math.PI/2)
var triangleBuffer = createBuffer(document.body, viewport)


var models = [
    triangleModel(triangleBuffer, catModel),
    triangleModel(triangleBuffer, tankModel),
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
    var shader = shaders[0]
    if (shader) {
        shader.apply(null, arguments)
    }
})


// Cat icon
var catDiv = document.createElement("div")
catDiv.className = "model-button"
catDiv.style.height ="60px"
document.body.appendChild(catDiv)
var catViewport = new Viewport(Math.PI/2)
var catBuffer = createBuffer(catDiv, catViewport)
var catCamera = createSpin({
    y: 20,
    radius: 140,
    angleY: Math.PI,
    angleX: Math.PI / 4
}, -3)
catViewport.update(catDiv)
catBuffer.on("shade", function () {
    var shader = shaders[0]
    if (shader) {
        shader.apply(null, arguments)
    }
})

var tankDiv = document.createElement("div")
tankDiv.className = "model-button"
tankDiv.style.height ="60px"
tankDiv.style.left = "75px"
document.body.appendChild(tankDiv)
var tankViewport = new Viewport(Math.PI/2)
var tankBuffer = createBuffer(tankDiv, tankViewport)
var tankCamera = createSpin({
    radius: 80,
    angleY: Math.PI,
    angleX: Math.PI / 4
}, -3)
tankViewport.update(tankDiv)
tankBuffer.on("shade", function () {
    var shader = shaders[0]
    if (shader) {
        shader.apply(null, arguments)
    }
})


var now = Date.now()
var then
var delta = 0
var modelIndex = 0;
var camera = createCamera({
    x: 0,
    y: 20,
    radius: 140,
    angleY: Math.PI,
    angleX: Math.PI / 4
})

;(function animloop() {
    raf(animloop)

    now = Date.now()
    delta = then ? (now - then) / 1000 : 0

    triangleBuffer.loadMatrix(camera(delta))
    triangleBuffer.begin()
    models[modelIndex](triangleBuffer)
    triangleBuffer.end()

    // Render cat on the menu
    catBuffer.loadMatrix(catCamera(delta))
    catBuffer.begin()
    models[0](catBuffer)
    catBuffer.end()

    // Render tank on the menu
    tankBuffer.loadMatrix(tankCamera(delta))
    tankBuffer.begin()
    models[1](tankBuffer)
    tankBuffer.end()

    then = now
})()
