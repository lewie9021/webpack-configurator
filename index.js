var Loader = require("./lib/loader");
var Loaders = require("./lib/loaders");
var Helpers = require("./lib/helpers");

function merge() {

}

function resolveAll() {

}

module.exports = {
    loader: Loader,
    loaders: Loaders,
    utilities: {
        merge: merge,
        resolveAll: resolveAll
    },
    helpers: Helpers
};
