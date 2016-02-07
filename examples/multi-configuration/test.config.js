var Path = require("path");
var Webpack = require("webpack");
var Config = require("webpack-configurator");
var Base = require("./base.config");

var merge = Config.merge;
var resolve = Config.resolve;

module.exports = merge(Base, {
    devtool: "source-map",
    watch: true,
    resolve: {
        alias: {
            specs: Path.join(__dirname, "specs")
        }
    },
    loaders: resolve(Base.loaders)
});
