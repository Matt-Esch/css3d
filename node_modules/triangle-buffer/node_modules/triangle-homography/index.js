module.exports = createMatrixGenerator;

var system = [
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ],

    numeric = require("numeric"),

    push = Array.prototype.push;

function append(to, array) {
    push.apply(to, array);
    return to;
}

function centroid(t) {
    var centroid = [0, 0, 0],
        n = t.length,
        i, p;

    for (i = 0; i < t.length; i += 1) {
        p = t[i];
        centroid[0] += p[0];
        centroid[1] += p[1];
        centroid[2] += p[2];
    }

    centroid[0] /= n;
    centroid[1] /= n;
    centroid[2] /= n;

    return centroid;
}

function createLinearSystem(t) {
    var constraints = append([centroid(t)], t),
        linearSystem = [],
        i, j, linearBlock;

    for (i = 0; i < constraints.length; i += 1) {
        for (j = 0; j < 4; j += 1) {
            linearBlock = system[j].slice(0);
            linearBlock[(4 * j)    ] = constraints[i][0];
            linearBlock[(4 * j) + 1] = constraints[i][1];
            linearBlock[(4 * j) + 2] = constraints[i][2];
            linearSystem.push(linearBlock);
        }
    }

    return linearSystem;
}

function bindSVD(U, S, V) {
    var Ut = numeric.transpose(U);
    U = null;

    function resolveTransform(t) {
        var c = centroid(t),
            result, i;

        // Make c a homogenous coordinate
        c.push(1);

        // Join the points into a single homogeneous row vector
        for (i = 0; i < t.length; i += 1) {
            Array.prototype.push.apply(c, t[i]);
            c.push(1);
        }

        result = numeric.dot(Ut, c);

        for (i = 0; i < 16; i += 1) {
            if (S[i] === 0) {
                result[i] = 0;
            } else {
                result[i] /= S[i];
            }

        }

        result = numeric.dot(V, result);

        return [
            result.slice(0, 4),
            result.slice(4, 8),
            result.slice(8, 12),
            [0, 0, 0, 1]
        ];

    }

    return resolveTransform;
}

function createMatrixGenerator(t) {
    var linearSystem = createLinearSystem(t),
        svd = numeric.svd(linearSystem);

    return bindSVD(svd.U, svd.S, svd.V);
}