var Path = require("path");
var Webpack = require("webpack");
var Config = require("webpack-configurator");

// Factory function.
var loader = Config.loader;

module.exports = {
    // Generic Webpack configuration.
    config: {
        entry: "./main.js",
        output: {
            filename: "bundle.js"
        }
    },
    // Our basic loaders.
    loaders: [
        loader({
            test: /\.dust$/,
            query: {
                path: Path.join(__dirname, "views")
            }
        }),
        loader({
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        })
    ]
};
