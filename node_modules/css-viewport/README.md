# cssViewport

Computes the perspective for a containefied field of view

## Example

```js
// Create a viewport with fovy PI/2
// and update body on window resize

var Viewport = require('css-viewport'),
    v = new Viewport(Math.PI/2);
window.onresize = updatePerspective;
updatePerspective();

function updatePerspective() {
    v.update(document.body);
};
```

## Installation

`npm install css-viewport`

## Contributors

 - Matt-Esch

## MIT Licenced

