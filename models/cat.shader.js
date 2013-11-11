module.exports = catShader

function catShader(i, matrix, triangle) {
    triangle.style.borderTopColor = 'rgb(' +  2 * Math.round(i) + ',' + 2 * Math.round(i/2) + ',' + 2 * Math.round(i/5) + ')';
}
