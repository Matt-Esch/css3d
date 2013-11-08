var numeric = require('numeric');

module.exports = RadialCamera;

var identityMatrix = [
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,1]
];

var defaultOptions = {
    x: 0,
    y: 0,
    z: 0,
    radius: 0,
    angleX: 0,
    angleY: 0,
    angleZ: 0
};

function RadialCamera(opts) {
    this.transform = identityMatrix.slice(0);
    this.x = opts.x || defaultOptions.x;
    this.y = opts.y || defaultOptions.y;
    this.z = opts.z || defaultOptions.z;
    this.radius = opts.radius || defaultOptions.radius;
    this.angleX = opts.angleX || defaultOptions.angleY;
    this.angleY = opts.angleY || defaultOptions.angleY;
    this.angleZ = opts.angleZ || defaultOptions.angleZ;
    this.computeTransform();
}

RadialCamera.prototype.computeTransform = computeTransform;

function computeTransform() {

    var cosx = Math.cos(this.angleX),
        sinx = Math.sin(this.angleX),
        cosy = Math.cos(this.angleY),
        siny = Math.sin(this.angleY),
        cosz = Math.cos(this.angleZ),
        sinz = Math.sin(this.angleZ);


    this.transform = numeric.dot(


        // Translate
        [
            [1, 0, 0,           0],
            [0, 1, 0,           0],
            [0, 0, 1, -this.radius],
            [0, 0, 0,           1]
        ],

        numeric.dot(
            // Rotate Z
            [
                [ cosz, sinz, 0, 0],
                [-sinz, cosz, 0, 0],
                [    0,    0, 1, 0],
                [    0,    0, 0, 1]
            ],

            numeric.dot(

                // Rotate X
                [
                    [1,     0,    0, 0],
                    [0,  cosx, sinx, 0],
                    [0, -sinx, cosx, 0],
                    [0,     0,    0, 1]
                ],

                numeric.dot(

                    // Rotate Y
                    [
                        [cosy,  0, -siny, 0],
                        [    0, 1,     0, 0],
                        [siny,  0,  cosy, 0],
                        [    0, 0,     0, 1]
                    ],

                    // Translate
                    [
                        [1, 0, 0, this.x],
                        [0, 1, 0, this.y],
                        [0, 0, 1, this.z],
                        [0, 0, 0,      1]
                    ]
                )
            )
        )
    );

    return this.transform;
}