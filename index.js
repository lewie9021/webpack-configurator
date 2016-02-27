var Loader = require("./lib/loader");
var Loaders = require("./lib/loaders");
var Plugin = require("./lib/plugin");
var Utilities = require("./lib/utilities");
var Helpers = require("./lib/helpers");

module.exports = {
    loader: Loader,
    loaders: Loaders,
    plugin: Plugin,
    merge: Utilities.merge,
    resolveAll: Utilities.resolveAll,
    helpers: Helpers
};
