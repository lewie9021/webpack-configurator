var Path = require("path");
var Webpack = require("webpack");
var Chai = require("chai");

var expect = Chai.expect;

describe("Examples:", function() {

    describe("multi-configuration", function() {

        it("correctly resolves the dev configuration", function() {
            var rootPath = Path.join(__dirname, "..", "examples", "multi-configuration");
            var srcPath = Path.join(rootPath, "src");
            var outputPath = Path.join(rootPath, "dist");

            var actual = require("../examples/multi-configuration/dev.config");
            var expected = {
                devtool: "source-map",
                entry: [
                    "webpack-dev-server/client?http://localhost:3000",
                    Path.join(srcPath, "index.js")
                ],
                watch: true,
                output: {
                    path: outputPath,
                    filename: "bundle.js",
                    publicPath: "/static/"
                },
                resolve: {
                    root: srcPath,
                    extensions: ["", ".jsx", ".js"]
                },
                module: {
                    loaders: [
                        {
                            test: /\.jsx?$/,
                            loader: "babel",
                            include: srcPath
                        }
                    ]
                },
                plugins: [
                    new Webpack.HotModuleReplacementPlugin()
                ]
            };

            expect(actual).to.eql(expected);
        });

    });

});
