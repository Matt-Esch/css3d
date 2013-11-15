var RadialCamera = require("radial-camera")

var TWOPI = Math.PI * 2

module.exports = spinCamera


function spinCamera(initial, speed) {
    var camera = new RadialCamera(initial)

    return nextMatrix

    function nextMatrix(delta) {
        camera.angleY += speed * delta
        camera.angleY %= TWOPI
        camera.computeTransform()
        return camera.transform
    }
}
