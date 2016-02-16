var Rewire = require("rewire");
var expect = require("chai").expect;
var Sinon = require("sinon");
var Config = require("../");

describe("Loader:", function() {

    // TODO: Specs for validation type checks.
    describe("merge", function() {

        beforeEach(function() {
            this.loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });
        });

        it("returns the loader object to allow chaining", function() {
            var loader = this.loader.merge({});

            expect(loader).to.eq(this.loader);
        });

        it("throws if no arguments are passed", function() {
            var error = "You must provide either an object or function value for 'changes'.";
            var loader = this.loader;

            expect(function() {
                loader.merge();
            }).to.throw(error);
        });

        it("accepts an object to merge with the current loader config", function() {
            var resolved = this.loader
                .merge({
                    query: {
                        plugins: ["transform-runtime"],
                        presets: ["es2015", "react"]
                    }
                })
                .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"],
                    presets: ["es2015", "react"]
                }
            });
        });

        it("accepts a function who's return value is merged with the current loader config", function() {
            var resolved = this.loader
                    .merge(function(config) {
                        var presets = config.query.presets;

                        return {
                            query: {
                                presets: presets.concat("react")
                            }
                        };
                    })
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            });
        });

        xit("throws if a 'changes' function doesn't return an object", function() {

        });

        xit("throws if 'changes' is invalid", function() {

        });

        it("accepts a property string to allow direct merging on top-level properties", function() {
            var resolved = this.loader
                    .merge("query", {
                        presets: ["es2015", "react"]
                    })
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            });
        });

        xit("throws if 'property' isn't a string", function() {

        });

        // TODO: Completed the implementaiton of helpers/concatMerge.
        xit("accepts a customizer function as a second parameter for tweaking merge behaviour", function() {
            var concatMerge = Config.helpers.concatMerge;
            var resolved = this.loader
                    .merge({
                        query: {
                            presets: ["react"]
                        }
                    }, concatMerge)
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            });
        });

        xit("accepts a customizer function as a third parameter for tweaking merge behaviour", function() {
            var concatMerge = Config.helpers.concatMerge;
            var resolved = this.loader
                    .merge("query", {
                            presets: ["react"]
                    }, concatMerge)
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"]
                }
            });
        });

        xit("throws if 'customizer' isn't a function", function() {

        });

    });

    describe("set", function() {

    });

    describe("resolve", function() {

        beforeEach(function() {
            this.sandbox = Sinon.sandbox.create();
        });

        afterEach(function() {
            this.sandbox.restore();
        });

        it("returns a clone of the internal loader config", function() {
            var Loader = Rewire("../lib/loader");
            var DeepClone = Loader.__get__("DeepClone");

            var spy = this.sandbox.spy();
            var revert = Loader.__set__("DeepClone", function(config) {
                spy(config);

                return DeepClone(config);
            });
            var state = {
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            };
            var resolved = Loader(state).resolve();

            expect(spy.secondCall.args).to.eql([state]);

            expect(resolved).to.eql(state);
        });

    });

});
