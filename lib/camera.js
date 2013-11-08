var window = require("global/window")
var RadialCamera = require("radial-camera")

var TWOPI = Math.PI * 2
var LEFT = 37
var UP = 38
var RIGHT = 39
var DOWN = 40
var SHIFT = 16

var keys = {}

module.exports = createCamera

window.addEventListener("keydown", function (e) {
    if (e && typeof e.keyCode === "number") {
        keys[e.keyCode] = true;
    }
})

window.addEventListener("keyup", function (e) {
    if (e && typeof e.keyCode === "number") {
        keys[e.keyCode] = false;
    }
})

function createCamera(initial) {
    var camera = new RadialCamera(initial)

    return nextMatrix

    function nextMatrix(delta) {
        if (keys[RIGHT] && !keys[LEFT]) {
            camera.angleY += 3 * delta
        }

        if (keys[LEFT] && !keys[RIGHT]) {
            camera.angleY -= 3 * delta
        }

        if (keys[SHIFT]) {
            if (keys[UP] && !keys[DOWN]) {
                camera.radius -= 75 * delta
            }

            if (keys[DOWN] && !keys[UP]) {
                camera.radius += 75 * delta
            }
        } else {
            if (keys[UP] && !keys[DOWN]) {
                camera.angleX += 3 * delta
            }

            if (keys[DOWN] && !keys[UP]) {
                camera.angleX -= 3 * delta
            }
        }

        camera.angleX %= TWOPI
        camera.angleY %= TWOPI
        camera.angleZ %= TWOPI

        camera.computeTransform()

        return camera.transform
    }
}
