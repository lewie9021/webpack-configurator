var Loader = require("./lib/loader");

function loaders() {

}

function merge() {

}

function resolveAll() {

}

function concatMerge() {

}

module.exports = {
    loader: Loader,
    loaders: loaders,
    utilities: {
        merge: merge,
        resolveAll: resolveAll
    },
    helpers: {
        concatMerge
    }
};
