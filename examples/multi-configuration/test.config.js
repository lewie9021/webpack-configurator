var Path = require("path");
var Webpack = require("webpack");
var Config = require("../../");
var Base = require("./base.config");

var merge = Config.merge;
var resolveAll = Config.resolveAll;

module.exports = merge(Base.config, {
    devtool: "source-map",
    watch: true,
    resolve: {
        alias: {
            specs: Path.join(__dirname, "specs")
        }
    },
    module: {
        loaders: resolveAll(Base.loaders)
    }
});
