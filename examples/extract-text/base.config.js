var Path = require("path");
var Webpack = require("webpack");
var Config = require("../../");

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
    loaders: Config.loaders([
        {
            test: /\.dust$/,
            loader: "dustjs-linkedin",
            query: {
                path: Path.join(__dirname, "src", "views")
            }
        },
        {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }
    ])
};
