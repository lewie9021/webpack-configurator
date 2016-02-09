var Path = require("path");
var Webpack = require("webpack");
var Config = require("webpack-configurator");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Base = require("./base.config");

// Helpers
var merge = Config.merge;
var resolve = Config.resolve;

// Loaders
var dust = Base.loaders[0];
var sass = Base.loaders[1];

module.exports = merge(Base, {
    devtool: "source-map",
    watch: true,
    entry: [
        "webpack-dev-server/client?http://localhost:3000",
        Path.join(__dirname, "src", "index.js")
    ],
    loaders: resolve([
        dust,
        sass.merge(function(config) {
            // Apply the dev queries.
            var loaders = config.loader.map(function(loader) {
                if (loader === "style")
                    return loader;

                return loader + "?" + JSON.stringify({sourceMap: true});
            });

            // Return only what we want to merge.
            return {
                loader: ExtractTextPlugin.extract(loaders)
            };
        })
    ]),
    plugins: [
        new ExtractTextPlugin("theme.css"),
        new Webpack.HotModuleReplacementPlugin()
    ]
});
