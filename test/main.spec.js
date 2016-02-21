var Rewire = require("rewire");
var Chai = require("chai");
var Sinon = require("sinon");
var Types = require("./helpers/types");
var Config = require("../");

var expect = Chai.expect;
var types = Types();

describe("Top-Level Exports:", function() {

    beforeEach(function() {
        this.sandbox = Sinon.sandbox.create();
    });

    afterEach(function() {
        this.sandbox.restore();
    });

    describe("loader", function() {

        it("is a function", function() {
            expect(Config.loader).to.be.a("function");
        });

        it("accepts a single object as a parameter", function() {
            var error = "You must provide a loader config object.";

            // Check the 'happy' path.
            expect(function() {
                Config.loader({});
            }).not.to.throw();

            // Ensure it only accepts an object.
            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    Config.loader(types[type]);
                }).to.throw(error);
            });
        });

        it("returns a loader object", function() {
            var loader = Config.loader({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            expect(loader).to.be.an("object");
            expect(loader).to.have.all.keys([
                "merge",
                "get",
                "set",
                "resolve"
            ]);
        });

        it("throws if 'test', 'exclude', or 'include' aren't regex values", function() {
            function test(property) {
                var error = "You must provide a regex value for '" + property + "'.";

                // Check the 'happy' path.
                expect(function() {
                    var parameter = {};

                    // Assign a regex value to the given property.
                    parameter[property] = /\.jsx?$/;

                    Config.loader(parameter);
                }).not.to.throw();

                // Ensure it only accepts a regular expression.
                Object.keys(types).forEach(function(type) {
                    if (type == "regex")
                        return;

                    var parameter = {};

                    // Assign the invalid value to the given property.
                    parameter[property] = types[type];

                    expect(function() {
                        Config.loader(parameter);
                    }).to.throw(error);
                });
            }

            test("test");
            test("exclude");
            test("include");
        });

        it("throws if 'loader' isn't a string value", function() {
            var error = "You must provide a string value for 'loader'.";

            // Check the 'happy' path.
            expect(function() {
                Config.loader({loader: "babel"});
            }).not.to.throw();

            // Ensure it only accepts a string.
            Object.keys(types).forEach(function(type) {
                if (type == "string")
                    return;

                expect(function() {
                    Config.loader({
                        loader: types[type]
                    });
                }).to.throw(error);
            });
        });

        it("throws if 'loaders' isn't an array of string values", function() {
            var error = "You must provide an array of string values for 'loaders'.";

            // Check the 'happy' path.
            expect(function() {
                Config.loader({
                    loaders: ["style", "css", "sass"]
                });
            }).not.to.throw();

            // Ensure it only accepts an array.
            Object.keys(types).forEach(function(type) {
                if (type == "array")
                    return;

                expect(function() {
                    Config.loader({
                        loaders: types[type]
                    });
                }).to.throw(error);
            });

            // Ensure it only accepts an array of strings.
            Object.keys(types).forEach(function(type) {
                if (type == "string")
                    return;

                expect(function() {
                    Config.loader({
                        loaders: [types[type]]
                    });
                }).to.throw(error);
            });
        });

        it("throws if 'query' isn't an object", function() {
            var error = "You must provide an object for 'query'.";

            // Check the 'happy' path.
            expect(function() {
                Config.loader({
                    query: {
                        presets: ["es2015"]
                    }
                });
            }).not.to.throw();

            // Ensure it only accepts an object.
            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    Config.loader({
                        query: types[type]
                    });
                }).to.throw(error);
            });
        });

        it("throws if 'queries' isn't an object of objects", function() {
            var error = "You must provide an object of objects for 'queries'.";

            // Check the 'happy' path.
            expect(function() {
                Config.loader({
                    queries: {
                        css: {sourceMap: true},
                        sass: {sourceMap: true}
                    }
                });
            }).not.to.throw();

            // Ensure it only accepts an object of objects.
            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    Config.loader({
                        queries: types[type]
                    });
                }).to.throw(error);

                expect(function() {
                    Config.loader({
                        queries: {
                            css: types[type]
                        }
                    });
                }).to.throw(error);
            });
        });

    });

    describe("loaders", function() {

        it("is a function", function() {
            expect(Config.loader).to.be.a("function");
        });

        it("accepts an array of loader configurations", function() {
            var configs = [
                {
                    test: /\.jsx?/,
                    loader: "babel"
                },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }
            ];

            expect(function() {
                Config.loaders(configs);
            }).not.to.throw();
        });

        it("throws if an array of loader configurations isn't passed", function() {
            var error = "You must provide an array of loader configurations.";

            // Ensure it only accepts an array.
            Object.keys(types).forEach(function(type) {
                if (type == "array")
                    return;

                expect(function() {
                    Config.loaders(types[type]);
                }).to.throw(error);
            });

            // Ensure it only accepts an array of loader configurations.
            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    Config.loaders([types[type]]);
                }).to.throw(error);
            });
        });

        it("calls the loader function for each configuration", function() {
            var Loaders = Rewire("../lib/loaders");

            var spy = this.sandbox.spy();
            var revert = Loaders.__set__("Loader", spy);
            var configs = [
                {
                    test: /\.jsx?/,
                    loader: "babel"
                },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }
            ];

            Loaders(configs);

            expect(spy.callCount).to.eq(configs.length);
            expect(spy.firstCall.args[0]).to.eq(configs[0]);
            expect(spy.secondCall.args[0]).to.eq(configs[1]);

            revert();
        });

        it("returns an array of loader objects", function() {
            var loaders = Config.loaders([
                {
                    test: /\.jsx?/,
                    loader: "babel"
                },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                }
            ]);

            loaders.forEach(function(loader) {
                expect(loader).to.be.an("object");
                expect(loader).to.have.all.keys([
                        "merge",
                        "get",
                        "set",
                        "resolve"
                    ]);
            });
       });

    });

    describe("plugin", function() {

        it("is a function", function() {
            expect(Config.plugin).to.be.a("function");
        });

        xit("accepts a single object as a parameter", function() {

        });

        xit("returns a plugin object", function() {

        });

    });

    xdescribe("plugins", function() {

        it("is a function", function() {
            expect(Config.plugins).to.be.a("function");
        });

        it("accepts an array of plugin configurations", function() {

        });

        it("calls the plugin function for each configuration", function() {

        });

        it("returns an array of plugin objects", function() {

        });

    });

    describe("utilities", function() {

        it("is an object", function() {
            expect(Config.utilities).to.be.an("object");
        });

        it("exposes 'merge' and 'resolveAll'", function() {
            expect(Config.utilities).to.have.all.keys([
                "merge",
                "resolveAll"
            ]);
        });

    });

    describe("helpers", function() {

        it("is an object", function() {
            expect(Config.helpers).to.be.an("object");
        });

        it("exposes 'concatMerge'", function() {
            expect(Config.helpers).to.have.all.keys([
                "concatMerge"
            ]);
        });

    });

});
