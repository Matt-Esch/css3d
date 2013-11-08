module.exports = Viewport;

var firstKey = require('firstkey');
    div = document.createElement('div'),
    perspective = firstKey(div.style,
        'perspective',
        'webkitPerspective',
        'mzPerspective',
        'msPerspective',
        'oPerspective');

    function Viewport(fovy) {
        this.fovy = fovy;
        this.perspective = 0;
        this.cx = 0;
        this.cy = 0;
        this.projection = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
    }

    function update(container) {
        var width = container.clientWidth,
            height = container.clientHeight,
            perspective = (height/2) / Math.tan(this.fovy/2),
            projection = this.projection;

        container.style[this.perspectiveKey] = perspective + 'px';
        this.perspective = projection[2][3] = perspective;
        this.cx = projection[0][3] = width/2;
        this.cy = projection[1][3] = height/2;
    }

    Viewport.prototype.perspectiveKey = perspective;
    Viewport.prototype.update = update;