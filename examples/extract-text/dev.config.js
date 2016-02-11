var Path = require("path");
var Webpack = require("webpack");
var Config = require("webpack-configurator");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Base = require("./base.config");

// Helpers
var merge = Config.merge;
var resolveAll = Config.resolveAll;

// Loaders
var dust = Base.loaders[0];
var sass = Base.loaders[1];

sass
    // Set the query options.
    .set("queries", {
        css: {sourceMap: true},
        sass: {sourceMap: true}
    })
    // Apply extract text plugin.
    .set("loaders", function(config, loader) {
        var resolved = loader.resolve();

        return ExtractTextPlugin.extract(resolved.loaders);
    });

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
        new ExtractTextPlugin("theme.css"),
        new Webpack.HotModuleReplacementPlugin()
    ]
});
