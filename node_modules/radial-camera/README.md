# radial-camera

Compute the camera model view matrix based on a given radius and two angles of rotation about a point in 3D space

## Example

```js
var RadialCamera = require('radial-camera');

var camera = new RadialCamera({
    radius: 240,
    angleY: Math.PI,
    angleX: Math.PI / 4
});

// Contains the transformation matrix
var transform = camera.transform;


// Update the transform
camera.angleX = 0;
var updatedTransform = camera.computeTransform();
```

## Installation

`npm install radial-camera`

## Contributors

 - Matt-Esch

## MIT Licenced
