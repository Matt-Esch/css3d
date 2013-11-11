var numeric = require("numeric"),
    firstKey = require("firstkey"),
    generate = require("triangle-homography"),
    Emitter = require('events').EventEmitter,
    util = require("util");

module.exports = createBuffer;


var reflectXAxis = [
    [1, 0, 0, 0],
    [0,-1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];

function createBuffer(container, viewport) {
    return new TriangleBuffer(container, viewport);
}

function TriangleBuffer(container, viewport) {
    var triangle = document.createElement("div"),
        transformOriginKey = firstKey(
            triangle.style,
            "transformOrigin",
            "webkitTransformOrigin",
            "MozTransformOrigin",
            "oTransformOrigin",
            "msTransformOrigin"
        ),
        transformKey = firstKey(
            triangle.style,
            "transform",
            "webkitTransform",
            "MozTransform",
            "oTransform",
            "msTransform"
        );

    triangle.style.top = "0px";
    triangle.style.left = "0px";
    triangle.style.position = "absolute";
    triangle.style.width = "0px";
    triangle.style.height = "0px";
    triangle.style.borderTop = "256px solid #ffffff";
    triangle.style.borderRight = "256px solid transparent";
    triangle.style[transformOriginKey] = "0 0 0";

    // Should not be modified manuall
    this._buffer = [];
    this._bufferIndex = 0;
    this._color = "#ffffff";
    this._container = container;
    this._matrixBuffer = [];
    this._transform = this._identity;
    this._transformStack = [];
    this._transformKey = transformKey;
    this._transformOriginKey = transformOriginKey;
    this._triangle = triangle;
    this._viewport = viewport;

    Emitter.call(this)
}

util.inherits(TriangleBuffer, Emitter)

TriangleBuffer.prototype.begin = beginDraw;
TriangleBuffer.prototype.drawTriangle = createTriangle;
TriangleBuffer.prototype.drawMatrix = triangleFromMatrix;
TriangleBuffer.prototype.triangleMatrix = matrixFromTriangle;
TriangleBuffer.prototype.matrixNormal = matrixNormal;
TriangleBuffer.prototype.loadIdentity = loadIdentity;
TriangleBuffer.prototype.loadMatrix = loadMatrix;
TriangleBuffer.prototype.pushMatrix = pushMatrix;
TriangleBuffer.prototype.popMatrix = popMatrix;
TriangleBuffer.prototype.translate = translate;
TriangleBuffer.prototype.transform = transform;
TriangleBuffer.prototype.color = setColor;
TriangleBuffer.prototype.backfaceVisible = setBackfaceVisibility;
TriangleBuffer.prototype.end = endDraw;

TriangleBuffer.prototype._depthSort = depthSort;
TriangleBuffer.prototype._generator = generate([
    [0,0,0],
    [0, 256, 0],
    [256, 0, 0]
]);
TriangleBuffer.prototype._getTriangle = getTriangle;
TriangleBuffer.prototype._identity = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];

function beginDraw() {
    this._bufferIndex = 0;
    this._matrixBuffer.length = 0;
}

function createTriangle(t) {
    this.drawMatrix(this.triangleMatrix(t));
}

function triangleFromMatrix(m) {
    var transform = numeric.dot(this._viewport.projection, this._transform),
        matrix = numeric.dot(transform, m),
        normal;

    if (m.normal) {
        normal = numeric.dot(transform, m.normal);
        normal[0] -= transform[0][3];
        normal[1] -= transform[1][3];
        normal[2] -= transform[2][3];
        matrix.normal = normal;
    }

    this._matrixBuffer.push(matrix);
}

function matrixFromTriangle(t) {
    return numeric.dot(reflectXAxis, this._generator(t));
}

function matrixNormal(matrix) {
    var a = numeric.dot(matrix, [0,256,0,1]),
        b = numeric.dot(matrix, [256,0,0,1]);

    a[0] -= matrix[0][3];
    a[1] -= matrix[1][3];
    a[2] -= matrix[2][3];
    b[0] -= matrix[0][3];
    b[1] -= matrix[1][3];
    b[2] -= matrix[2][3];

    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0],
        1
    ];
}

function getTriangle() {
    var buffer = this._buffer,
        bufferIndex = this._bufferIndex,
        triangle = this._triangle,
        t;

    if (bufferIndex < buffer.length) {
        t = buffer[bufferIndex];
        t.style.borderTopColor = this._color;
    } else {
        t = triangle.cloneNode(true);
        buffer.push(t);
        this._container.appendChild(t);
    }

    t.style.display = "block";
    this._bufferIndex += 1;
    return t;
}

function loadIdentity() {
    this._transform = this._identity;
}

function loadMatrix(matrix) {
    this._transform = matrix;
}

function pushMatrix() {
    this._transformStack.push(this._transform);
}

function popMatrix() {
    this._transform = this._transformStack.pop() || this._identity;
}

function translate(x, y, z) {
    var transform = this._transform;

    transform[0][3] += x;
    transform[1][3] += y;
    transform[2][3] += z;
}

function transform(m) {
    this._transform = numeric.dot(m, this._transform);
}

function setColor(color) {
    this._triangle.style.borderTopColor = this._color = color;
}

function setBackfaceVisibility(enabled) {
    if (enabled === true) {
        this._triangle.style[this._backfaceKey] = this._backfaceVisible = '';
    } else if (enabled === false) {
        this._triangle.style[this._backfaceKey] = this._backfaceVisibe = 'hidden';
    }
}

function depthSort(a, b) {
    if (a.z < b.z) {
        return -1;
    } else if (a.z > b.z) {
        return 1;
    } else {
        return 0;
    }
}

function endDraw() {
    var buffer = this._buffer,
        bufferLength = buffer.length,
        matrixBuffer = this._matrixBuffer,
        matrixBufferLength = matrixBuffer.length,
        transformKey = this._transformKey,
        newTriangle, m, i;

    for (i = 0; i < matrixBufferLength; i += 1) {
        m = matrixBuffer[i];
        m.z = numeric.dot(m[2], [85,85,0,1])
    }

    matrixBuffer.sort(this._depthSort);


    for (i = 0; i < matrixBufferLength; i += 1) {
        m = matrixBuffer[i];
        newTriangle = this._getTriangle();

        // Manually unwound loop
        newTriangle.style[transformKey] = "matrix3d(" +
            m[0][0].toFixed(5) + "," +
            m[1][0].toFixed(5) + "," +
            m[2][0].toFixed(5) + "," +
            '0,' +
            m[0][1].toFixed(5) + "," +
            m[1][1].toFixed(5) + "," +
            m[2][1].toFixed(5) + "," +
            '0,0,0,1,0,' +
            m[0][3].toFixed(5) + "," +
            m[1][3].toFixed(5) + "," +
            m[2][3].toFixed(5) +
            ",1)";

        this.emit('shade', i, m, newTriangle);
    }

    for (i = this._bufferIndex; i < bufferLength; i += 1) {
        buffer[i].style.display = "none";
    }
}