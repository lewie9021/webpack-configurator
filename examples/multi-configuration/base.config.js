var Path = require("path");
var Config = require("webpack-configurator");

var loader = Config.loader;
var srcPath = Path.join(__dirname, "src");
var outputPath = Path.join(__dirname, "dist");

module.exports = {
    // Generic Webpack configuration.
    config: {
        entry: Path.join(__dirname, "src", "index.js"),
        output: {
            path: outputPath,
            filename: "bundle.js",
            publicPath: "/static/"
        },
        resolve: {
            root: srcPath,
            extensions: ["", ".jsx", ".js"]
        },
    },
    // Our basic loaders.
    loaders: [
        // Enable ES6 & JSX syntax.
        loader({
            test: /\.jsx?$/,
            loader: "babel",
            include: srcPath
        })
    ]
};
