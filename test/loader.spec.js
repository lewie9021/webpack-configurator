var Rewire = require("rewire");
var Chai = require("chai");
var Sinon = require("sinon");
var Types = require("./helpers/types");
var Config = require("../");

var expect = Chai.expect;
var types = Types();

describe("Loader:", function() {

    beforeEach(function() {
        this.sandbox = Sinon.sandbox.create();
    });

    afterEach(function() {
        this.sandbox.restore();
    });

    // TODO: Specs for validation type checks.
    describe("merge", function() {

        it("returns the loader object to allow chaining", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            var actual = loader.merge({});
            var expected = loader;

            expect(actual).to.eq(expected);
        });

        it("throws if no arguments are passed", function() {
            var error = "You must provide either an object or function value for 'changes'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            expect(function() {
                loader.merge();
            }).to.throw(error);
        });

        it("accepts an object to merge with the current loader config", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            // Perform the merge.
            loader.merge({
                query: {
                    plugins: ["transform-runtime"]
                }
            });

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"],
                    presets: ["es2015"]
                }
            };

            expect(actual).to.eql(expected);
        });

        it("accepts a function who's return value is merged with the current loader config", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            // Perform the merge.
            loader.merge(function(config) {
                var presets = config.query.presets;

                return {
                    query: {
                        presets: presets.concat("react")
                    }
                };
            });

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'changes' doesn't return an object, given a function", function() {
            var error = "You must provide an object or function (that returns an object) for 'changes'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    loader.merge(function() {
                        return types[type];
                    });
                }).to.throw(error);
            });
        });

        // TODO: find a way to reuse the code from within main.spec.js to ensure this mirrors the same validation.
        xit("throws if 'changes' is an object but contains invalid properties", function() {

        });

        xit("throws if 'changes' is an invalid type, given a valid 'property' value", function() {

        });

        it("accepts a property string to allow direct merging on top-level properties", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            // Perform the merge.
            loader.merge("query", {
                presets: ["es2015", "react"]
            });

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'property' isn't a string", function() {
            var error = "You must provide a string value for 'property'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            Object.keys(types).forEach(function(type) {
                if (type == "string")
                    return;

                expect(function() {
                    loader.merge(types[type], {});
                }).to.throw(error);
            });
        });

        // TODO: Completed the implementaiton of helpers/concatMerge.
        xit("accepts a customizer function as a second parameter for tweaking merge behaviour", function() {
            var concatMerge = Config.helpers.concatMerge;
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            // Perform the merge.
            loader.merge({
                query: {
                    presets: ["react"]
                }
            }, concatMerge);

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            };

            expect(actual).to.eql(expected);
        });

        xit("accepts a customizer function as a third parameter for tweaking merge behaviour", function() {
            var concatMerge = Config.helpers.concatMerge;
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            // Perform the merge.
            loader.merge("query", {
                presets: ["react"]
            }, concatMerge);

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            };

            expect(actual).to.eql(expected);
        });

        // TODO: Test when 'customizer' is used as the second parameter.
        it("throws if 'customizer' isn't a function", function() {
            var error = "You must provide a function for 'customizer'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            Object.keys(types).forEach(function(type) {
                if (type == "func")
                    return;

                expect(function() {
                    loader.merge("query", {}, types[type]);
                }).to.throw(error);
            });
        });

    });

    describe("set", function() {

        it("returns the loader object to allow chaining", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            var actual = loader.set({});
            var expected = loader;

            expect(actual).to.eq(expected);
        });

        it("throws if no arguments are passed", function() {
            var error = "You must provide either an object or function value for 'changes'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            expect(function() {
                loader.set();
            }).to.throw(error);

        });

        it("accepts an object that overwrites top-level properties", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            // Perform the overwrite.
            loader.set({
                query: {
                    plugins: ["transform-runtime"]
                }
            });

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"]
                }
            };

            expect(actual).to.eql(expected);
        });

        it("accepts a function who's return value overwrites top-level properties", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            // Perform the overwrite.
            loader.set(function() {
                return {
                    query: {
                        plugins: ["transform-runtime"]
                    }
                };
            });

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"]
                }
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'changes' doesn't return an object, given a function", function() {
            var error = "You must provide an object or function (that returns an object) for 'changes'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    loader.set(function() {
                        return types[type];
                    });
                }).to.throw(error);
            });
        });

        // TODO: find a way to reuse the code from within main.spec.js to ensure this mirrors the same validation.
        xit("throws if 'changes' is an object but contains invalid properties", function() {

        });

        xit("throws if 'changes' is an invalid type, given a valid 'property' value", function() {

        });

        it("accepts a property string to allow direct overwrites on top-level properties", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            // Perform the overwrite.
            loader.set("query", {
                plugins: ["transform-runtime"]
            });

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"]
                }
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'property' isn't a string", function() {
            var error = "You must provide a string value for 'property'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });

            Object.keys(types).forEach(function(type) {
                if (type == "string")
                    return;

                expect(function() {
                    loader.set(types[type], {});
                }).to.throw(error);
            });
        });

    });

    describe("get", function() {

        it("returns a clone of the internal loader config", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });
            var state = loader.get();

            // Mutate the state.
            // If we simply return the internal reference,
            // it will effect the next call to loader.get().
            state.loader = "test";

            var actual = loader.get();
            var expected = {
                test: /\.jsx?/,
                loader: "babel"
            };

            expect(actual).to.eql(expected);
        });

    });

    describe("resolve", function() {

        it("returns a clone of the internal loader config", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });
            var state = loader.resolve();

            // Mutate the state.
            // If we simply return the internal reference,
            // it will effect the next call to loader.resolve().
            state.loader = "test";

            var actual = loader.resolve();
            var expected = {
                test: /\.jsx?/,
                loader: "babel"
            };

            expect(actual).to.eql(expected);
        });

        it("stringifies 'query' and appends the value onto 'loader'", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            var actual = loader.resolve();
            var expected = {
                test: /\.jsx?/,
                loader: 'babel?{"presets":["es2015"]}'
            };

            expect(actual).to.eql(expected);
        });

        it("stringifies and appends the respective query in 'queries' to 'loader'", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                queries: {
                    babel: {presets: ["es2015"]}
                }
            });

            var actual = loader.resolve();
            var expected = {
                test: /\.jsx?/,
                loader: 'babel?{"presets":["es2015"]}'
            };

            expect(actual).to.eql(expected);
        });

        it("maps over each loader in 'loaders' and stringifies the respective query in 'queries'", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loaders: ["babel", "test"],
                queries: {
                    babel: {presets: ["es2015"]},
                    test: {param: 5}
                }
            });

            var actual = loader.resolve();
            var expected = {
                test: /\.jsx?/,
                loaders:[
                    'babel?{"presets":["es2015"]}',
                    'test?{"param":5}'
                ]
            };

            expect(actual).to.eql(expected);
        });

        xit("throws if neither 'loader' or 'loaders' is present within the config", function() {
            var error = "A loader must have either a 'loader' or 'loaders' property to be resolved.";
            var loader = Config.loader({
                test: /\.jsx?/,
                query: {
                    presets: ["es2015"]
                }
            });

            expect(function() {
                loader.resolve();
            }).to.throw(error);
        });

        xit("throws if 'queries' contains a top-level property isn't in 'loader'", function() {
            var error = "Failed to map 'test' to a matching loader. Found 'babel'.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                queries: {
                    test: {
                        param: 5
                    }
                }
            });

            expect(function() {
                loader.resolve();
            }).to.throw(error);
        });

        xit("throws if 'queries' contains a top-level property isn't in 'loaders'", function() {
            var error = "Failed to map 'test' to a matching loader. Found 'style', 'css', 'sass'.";
            var loader = Config.loader({
                test: /\.scss/,
                loaders: ["style", "css", "sass"],
                queries: {
                    sass: {sourceMap: true},
                    css: {sourceMap: true},
                    test: {param: 5}
                }
            });

            expect(function() {
                loader.resolve();
            }).to.throw(error);
        });

        xit("throws if both 'queries' and 'query' are defined", function() {
            var error = "You cannot define 'query' and 'queries' together in a loader configuration.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                },
                queries: {
                    babel: {
                        plugins: ["transform-runtime"]
                    }
                }
            });

            expect(function() {
                loader.resolve();
            }).to.throw(error);
        });

        xit("throws if both 'loader' and 'loaders' are defined", function() {
            var error = "You cannot define 'loader' and 'loaders' together in a loader configuration.";
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                loaders: ["test"]
            });

            expect(function() {
                loader.resolve();
            }).to.throw(error);
        });

        xit("only returns the properties: 'test', 'exclude', 'include', 'loader', and 'loaders'", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                ignoredProperty: "test"
            });
            var resolved = loader.resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel"
            });
        });

    });

});
