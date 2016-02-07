var Path = require("path");
var Webpack = require("webpack");
var Config = require("../../");

// Factory functions
var loader = Config.loader;
var plugin = Config.pluign;

// Helper functions
// Takes an array/object of factories such as plugins and loaders
// and calls their resolve method.
var resolve = Config.resolve;
var defaults = Config.defaults;

var dust = loader({
    test: /\.dust$/,
    query: {
        path: Path.join(__dirname, "views")
    }
});

var sass = loader({
    test: /\.scss$/,
    loaders: ["style", "css"]
});

var webpackDefine = plugin(Webpack.DefinePlugin, {
    VERSION: "1.0.0"
});

// Extend sass loaders property
// The default customizer behaviour will use ../../lib/default/merge.js.
// Also accepts a function.
sass.merge({
    loaders: ["sass?indentedSyntax"]
}, defaults.merge);

module.exports = {
    entry: "./main.js",
    output: {
        filename: "bundle.js"
    },
    loaders: resolve([
        dust,
        sass
    ]),
    plugins: resolve([
        webpackDefine
    ])
};
