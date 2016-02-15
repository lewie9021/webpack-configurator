var Loader = require("./lib/loader");
var Loaders = require("./lib/loaders");

function merge() {

}

function resolveAll() {

}

function concatMerge() {

}

module.exports = {
    loader: Loader,
    loaders: Loaders,
    utilities: {
        merge: merge,
        resolveAll: resolveAll
    },
    helpers: {
        concatMerge
    }
};
