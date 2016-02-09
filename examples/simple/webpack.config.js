var Path = require("path");
var Webpack = require("webpack");

// If this is as complex as your Webpack configuration will get, I wouldn't recommend this
// library. The purpose of this library is to help aid composability with multiple configurations.
module.exports = {
    entry: "./main.js",
    output: {
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.dust$/,
                loader: "dustjs-linkedin",
                query: {
                    path: Path.join(__dirname, "views")
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass?indentedSyntax"]
            }
        ]
    },
    plugins: [
        new Webpack.DefinePlugin({
            VERSION: "1.0.0"
        })
    ]
};
