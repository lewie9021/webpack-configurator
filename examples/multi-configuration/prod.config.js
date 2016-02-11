var Path = require("path");
var Webpack = require("webpack");
var Config = require("webpack-configurator");
var Base = require("./base.config");

var merge = Config.merge;
var resolveAll = Config.resolveAll;

module.exports = merge(Base.config, {
    devtool: "source-map",
    watch: true,
    module: {
        loaders: resolveAll(Base.loaders)
    },
    plugins: [
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});
