var Path = require("path");
var Webpack = require("webpack");
var Config = require("webpack-configurator");
var Base = require("./base.config");

var merge = Config.merge;
var resolve = Config.resolve;

module.exports = merge(Base, {
    devtool: "source-map",
    watch: true,
    loaders: resolve(Base.loaders),
    plugins: [
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
});
