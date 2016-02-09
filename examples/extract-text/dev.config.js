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

sass
    // Set the query options.
    .queries({
        css: {sourceMap: true},
        sass: {sourceMap: true}
    })
    // Apply extract text plugin.
    // We use resolveMerge as this will return the queries set above.
    // You can provide a property to directly merge to.
    .resolveMerge("loaders", function(config) {
        return ExtractTextPlugin.extract(config.loaders);
    });

module.exports = merge(Base.config, {
    devtool: "source-map",
    watch: true,
    entry: [
        "webpack-dev-server/client?http://localhost:3000",
        Path.join(__dirname, "src", "index.js")
    ],
    module: {
        loaders: resolve([
            dust,
            sass
        ])
    },
    plugins: [
        new ExtractTextPlugin("theme.css"),
        new Webpack.HotModuleReplacementPlugin()
    ]
});
