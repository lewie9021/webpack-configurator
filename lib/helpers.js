var Utils = require("./utils");

function concatMerge(a, b) {
    if (Utils.isArray(a))
        return a.concat(b);
}

module.exports = {
    concatMerge: concatMerge
};
