var Path = require("path");
var Webpack = require("webpack");
var Config = require("webpack-configurator");
var Base = require("./base.config");

var merge = Config.merge;
var resolve = Config.resolve;

module.exports = merge(Base, {
    devtool: "source-map",
    watch: true,
    entry: [
        "webpack-dev-server/client?http://localhost:3000",
        Path.join(__dirname, "src", "index.js")
    ],
    loaders: resolve(Base.loaders),
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]
});
