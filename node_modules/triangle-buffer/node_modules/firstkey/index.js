module.exports = firstKey

function firstKey(object) {
    var key, i;

    if (typeof object === 'object') {
        for (i = 1; i < arguments.length; i += 1) {
            key = arguments[i];
        
            if (key in object) {
                return key;
            }
        }
    }

    return null;
}
