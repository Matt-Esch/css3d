module.exports = triangleModel

function triangleModel(buffer, model) {
    var matrices = triangleMatrices(buffer, model)

    return function render(buffer) {
        for (var i = 0; i < matrices.length; i++) {
            buffer.drawMatrix(matrices[i])
        }
    }
}

function triangleMatrices(buffer, model) {
    var triangles = model.triangles
    var vertices = model.vertices
    var matrices = new Array(triangles.length)

    var t, verts, matrix

    for (var i = 0; i < triangles.length; i++) {
        verts = triangles[i]
        t = []

        t.push(vertices[verts[0]-1].slice(0))
        t.push(vertices[verts[1]-1].slice(0))
        t.push(vertices[verts[2]-1].slice(0))

        matrix = matrices[i] = buffer.triangleMatrix(t)
        matrix.normal = buffer.matrixNormal(matrix)
    }

    return matrices
}