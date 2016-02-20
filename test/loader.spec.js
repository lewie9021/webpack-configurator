var Rewire = require("rewire");
var Chai = require("chai");
var Sinon = require("sinon");
var Types = require("./helpers/types");
var Config = require("../");

var expect = Chai.expect;
var types = Types();

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

        it("throws if 'changes' doesn't return an object, given a function", function() {
            var loader = this.loader;
            var error = "You must provide an object or function (that returns an object) for 'changes'.";

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

        it("throws if 'property' isn't a string", function() {
            var loader = this.loader;
            var error = "You must provide a string value for 'property'.";

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

        // TODO: Test when 'customizer' is used as the second parameter.
        it("throws if 'customizer' isn't a function", function() {
            var loader = this.loader;
            var error = "You must provide a function for 'customizer'.";

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
            var loader = this.loader.set({});

            expect(loader).to.eq(this.loader);
        });

        it("throws if no arguments are passed", function() {
            var error = "You must provide either an object or function value for 'changes'.";
            var loader = this.loader;

            expect(function() {
                loader.set();
            }).to.throw(error);

        });

        it("accepts an object that overwrites top-level properties", function() {
            var resolved = this.loader
                    .set({
                        query: {
                            plugins: ["transform-runtime"]
                        }
                    })
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"]
                }
            });
        });

        it("accepts a function who's return value overwrites top-level properties", function() {
            var resolved = this.loader
                    .set(function() {
                        return {
                            query: {
                                plugins: ["transform-runtime"]
                            }
                        };
                    })
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"]
                }
            });
        });

        it("throws if 'changes' doesn't return an object, given a function", function() {
            var loader = this.loader;
            var error = "You must provide an object or function (that returns an object) for 'changes'.";

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
            var resolved = this.loader
                    .set("query", {
                        plugins: ["transform-runtime"]
                    })
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    plugins: ["transform-runtime"]
                }
            });

        });

        it("throws if 'property' isn't a string", function() {
            var loader = this.loader;
            var error = "You must provide a string value for 'property'.";

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
            var resolved = Loader(state).get();

            expect(spy.secondCall.args).to.eql([state]);

            expect(resolved).to.eql(state);
        });

    });

    describe("resolve", function() {

        beforeEach(function() {
            this.loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel"
            });
        });

        it("returns a clone of the internal loader config", function() {
            var Loader = Rewire("../lib/loader");
            var DeepClone = Loader.__get__("DeepClone");

            var sandbox = Sinon.sandbox.create();
            var spy = sandbox.spy();
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

            // Revert environment changes.
            sandbox.restore();
            revert();
        });

        it("stringifies 'query' and appends the value onto 'loader'", function() {
            var resolved = this.loader
                    .set("query", {
                        presets: ["es2015"]
                    })
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loader: 'babel?{"presets": ["es2015"]}'
            });
        });

        it("maps over 'queries' and stringifies each property appending to each loader in 'loaders'", function() {
            var resolved = this.loader
                    .set("queries", {
                        babel: {presets: ["es2015"]},
                        test: {param: 5}
                    })
                    .resolve();

            expect(resolved).to.eql({
                test: /\.jsx?/,
                loaders: ['babel?{"presets":["es2015"]}', 'test?{"param":5}']
            });
        });

        xit("throws if neither 'loader' or 'loaders' is present within the config", function() {

        });

        xit("throws if 'queries' contains a top-level property isn't in 'loader' or 'loaders'", function() {

        });

        xit("throws if both 'queries' and 'query' are defined", function() {

        });

        xit("throws if both 'loader' and 'loaders' are defined", function() {

        });

        xit("only returns the properties: 'test', 'exclude', 'include', 'loader', and 'loaders'", function() {

        });

    });

});
