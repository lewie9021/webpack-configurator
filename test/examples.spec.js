var Path = require("path");
var Webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Chai = require("chai");

var expect = Chai.expect;

describe("Examples:", function() {

    describe("multi-configuration", function() {

        beforeEach(function() {
            var basePath = require.resolve("../examples/multi-configuration/base.config");

            // Clear the require cache for the base config. This is because
            // each mode specific config directly mutates the base.
            delete require.cache[basePath];
        });

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

        it("correctly resolves the test configuration", function() {
            var rootPath = Path.join(__dirname, "..", "examples", "multi-configuration");
            var srcPath = Path.join(rootPath, "src");
            var outputPath = Path.join(rootPath, "dist");

            var actual = require("../examples/multi-configuration/test.config");
            var expected = {
                devtool: "source-map",
                entry: Path.join(srcPath, "index.js"),
                watch: true,
                output: {
                    path: outputPath,
                    filename: "bundle.js",
                    publicPath: "/static/"
                },
                resolve: {
                    root: srcPath,
                    extensions: ["", ".jsx", ".js"],
                    alias: {
                        specs: Path.join(rootPath, "specs")
                    }
                },
                module: {
                    loaders: [
                        {
                            test: /\.jsx?$/,
                            loader: "babel",
                            include: srcPath
                        }
                    ]
                }
            };

            expect(actual).to.eql(expected);
        });

        it("correctly resolves the production configuration", function() {
            var rootPath = Path.join(__dirname, "..", "examples", "multi-configuration");
            var srcPath = Path.join(rootPath, "src");
            var outputPath = Path.join(rootPath, "dist");

            var actual = require("../examples/multi-configuration/prod.config");
            var expected = {
                devtool: "source-map",
                entry: Path.join(srcPath, "index.js"),
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
                    new Webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    })
                ]
            };

            expect(actual).to.eql(expected);
        });

    });

    describe("extract-test", function() {

        beforeEach(function() {
            var basePath = require.resolve("../examples/extract-text/base.config");

            // Clear the require cache for the base config. This is because
            // each mode specific config directly mutates the base.
            delete require.cache[basePath];
        });

        xit("correctly resolves the dev configuration", function() {
            var rootPath = Path.join(__dirname, "..", "examples", "extract-text");
            var srcPath = Path.join(rootPath, "src");

            var actual = require("../examples/extract-text/dev.config");
            var expected = {
                devtool: "source-map",
                entry: [
                    "webpack-dev-server/client?http://localhost:3000",
                    Path.join(srcPath, "index.js")
                ],
                watch: true,
                output: {
                    filename: "bundle.js"
                },
                module: {
                    loaders: [
                        {
                            test: /\.dust$/,
                            loader: "dustjs-linkedin",
                            query: {
                                path: Path.join(srcPath, "views")
                            }
                        },
                        {
                            test: /\.scss$/,
                            loaders: ExtractTextPlugin.extract([
                                "style",
                                "css?{sourceMap:true}",
                                "sass?{sourceMap:true}"
                            ])
                        }
                    ]
                },
                plugins: [
                    new ExtractTextPlugin("theme.css"),
                    new Webpack.HotModuleReplacementPlugin()
                ]
            };

            expect(actual).to.eql(expected);
        });

    });

});
