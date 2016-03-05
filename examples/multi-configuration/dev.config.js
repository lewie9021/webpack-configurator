var Path = require("path");
var Webpack = require("webpack");
var Config = require("../../");
var Base = require("./base.config");

var merge = Config.merge;
var resolveAll = Config.resolveAll;

module.exports = merge(Base.config, {
    devtool: "source-map",
    watch: true,
    entry: [
        "webpack-dev-server/client?http://localhost:3000",
        Path.join(__dirname, "src", "index.js")
    ],
    module: {
        loaders: resolveAll(Base.loaders)
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]
});
