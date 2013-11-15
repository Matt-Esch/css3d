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

    var t, verts, matrix,
        tLen = triangles.length,
        vLen = vertices.length

    for (var i = 0; i < tLen; i++) {
        verts = triangles[i]
        t = []

        var v0 = verts[0], v1 = verts[1], v2 = verts[2]

        t.push(vertices[v0 > 0 ? v0 - 1 : vLen + v0].slice(0))
        t.push(vertices[v1 > 0 ? v1 - 1 : vLen + v1].slice(0))
        t.push(vertices[v2 > 0 ? v2 - 1 : vLen + v2].slice(0))

        matrix = matrices[i] = buffer.triangleMatrix(t)
        matrix.normal = buffer.matrixNormal(matrix)
    }

    return matrices
}