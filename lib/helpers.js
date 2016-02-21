var Utils = require("./utilities");

function concatMerge(a, b) {
    if (Utils.isArray(a))
        return a.concat(b);
}

module.exports = {
    concatMerge: concatMerge
};
