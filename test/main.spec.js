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

        xit("clones 'input'", function() {

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

        // Conditions are as stated in the docs:
        // - Regular expressions
        // - Strings
        // - Functions (returning a Boolean).
        it("throws if 'test', 'exclude', or 'include' aren't conditions", function() {
            function test(property) {
                var error = "You must provide either a condition or array of conditions for '" + property + "'.";

                Object.keys(types).forEach(function(type) {
                    var parameter = {};

                    // Assign the valid value to the given property.
                    parameter[property] = types[type];

                    var subject = function() {
                        Config.loader(parameter);
                    };

                    // Check the 'happy' paths.
                    if (type == "regex" || type == "string" || type == "func" || type == "array")
                        return expect(subject).not.to.throw(error);

                    // Ensure it only accepts conditions.
                    expect(subject).to.throw(error);
                });
            }

            test("test");
            test("exclude");
            test("include");
        });

        it("accepts an array of conditions for 'test', 'exclude', and 'include'", function() {
            function test(property) {
                var error = "You must provide either a condition or array of conditions for '" + property + "'.";

                Object.keys(types).forEach(function(type) {
                    var parameter = {};

                    // Assign the valid value to the given property.
                    parameter[property] = [types[type]];

                    var subject = function() {
                        Config.loader(parameter);
                    };

                    // Check the 'happy' paths.
                    if (type == "regex" || type == "string" || type == "func")
                        return expect(subject).not.to.throw(error);

                    // Ensure it throws for arrays of invalid conditions.
                    expect(subject).to.throw(error);
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

        xit("clones 'input'", function() {

        });

        it("accepts a single object as a parameter", function() {
            var error = "You must provide a plugin config object.";

            // Check the 'happy' path.
            expect(function() {
                Config.plugin({});
            }).not.to.throw();

            // Ensure it only accepts an object.
            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    Config.plugin(types[type]);
                }).to.throw(error);
            });
        });

        it("returns a plugin object", function() {
            var plugin = Config.plugin({
                test: /\.jsx?/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            });

            expect(plugin).to.be.an("object");
            expect(plugin).to.have.all.keys([
                "merge",
                "get",
                "set",
                "resolve"
            ]);
        });

        xit("throws if 'plugin' isn't provided", function() {

        });

        it("throws if 'plugin' isn't a function", function() {
            var error = "You must provide a function for 'plugin'.";

            // Check the 'happy' path.
            expect(function() {
                Config.plugin({
                    plugin: function() {}
                });
            }).not.to.throw();

            // Ensure it only accepts a function.
            Object.keys(types).forEach(function(type) {
                if (type == "func")
                    return;

                expect(function() {
                    Config.plugin({
                        plugin: types[type]
                    });
                }).to.throw(error);
            });
        });

        it("throws if 'parameters' isn't an array", function() {
            var error = "You must provide an array for 'parameters'.";

            // Check the 'happy' path.
            expect(function() {
                Config.plugin({
                    parameters: []
                });
            }).not.to.throw();

            // Ensure it only accepts an array.
            Object.keys(types).forEach(function(type) {
                if (type == "array")
                    return;

                expect(function() {
                    Config.plugin({
                        parameters: types[type]
                    });
                }).to.throw(error);
            });
        });

        xit("defaults 'parameters' to an empty array, if not given", function() {

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

    describe("merge", function() {

        it("is a function", function() {
            expect(Config.merge).to.be.a("function");
        });

        it("throws if 'object' 'source' aren't objects", function() {
            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                // Invalid 'object' values.
                expect(function() {
                    Config.merge(types[type], {});
                }).to.throw("You must provide an object value for 'object'.");

                // Invalid 'source' values.
                expect(function() {
                    Config.merge({}, types[type]);
                }).to.throw("You must provide an object value for 'source'.");
            });
        });

        it("returns a merge of 'source' into 'object'", function() {
            var object = {
                a: "test",
                b: ["abc"],
                c: {
                    d: 1
                }
            };
            var source = {
                b: ["xyz"],
                c: {
                    e: 4
                }
            };

            var actual = Config.merge(object, source);
            var expected = {
                a: "test",
                b: ["xyz"],
                c: {
                    d: 1,
                    e: 4
                }
            };

            expect(actual).to.eql(expected);
        });

        it("accepts a 'customizer' function for tweaking merge behaviour", function() {
            var object = {
                a: ["test"]
            };
            var source = {
                a: ["abc"]
            };

            var actual = Config.merge(object, source, Config.helpers.concatMerge);
            var expected = {
                a: ["test", "abc"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'customizer' isn't a function", function() {
            var error = "You must provide a function for 'customizer'.";

            Object.keys(types).forEach(function(type) {
                if (type == "func")
                    return;

                expect(function() {
                    Config.merge({}, {}, types[type]);
                }).to.throw(error);
            });
        });

    });

    describe("resolveAll", function() {

        it("is a function", function() {
            expect(Config.resolveAll).to.be.a("function");
        });

        it("accepts an array of values that contain a 'resolve' property", function() {
            var loader = {
                resolve: function() {
                    return "loader";
                }
            };
            var plugin = {
                resolve: function() {
                    return "plugin";
                }
            };

            var actual = Config.resolveAll([loader, plugin]);
            var expected = ["loader", "plugin"];

            expect(actual).to.eql(expected);
        });

        it("throws if an array isn't passed", function() {
            var error = "You must provide an array of values.";

            Object.keys(types).forEach(function(type) {
                if (type == "array")
                    return;

                expect(function() {
                    Config.resolveAll(types[type]);
                }).to.throw(error);
            });
        });

        it("throws if objects in the passed array don't contain a resolve function", function() {
            var error = "You must provide values that contain a 'resolve' function.";

            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    Config.resolveAll([types[type]]);
                }).to.throw(error);
            });

            Object.keys(types).forEach(function(type) {
                if (type == "func")
                    return;

                expect(function() {
                    Config.resolveAll([
                        {resolve: types[type]}
                    ]);
                }).to.throw(error);
            });
        });

        it("calls the 'resolve' property of object passed", function() {
            var loader = {
                resolve: this.sandbox.spy()
            };
            var plugin = {
                resolve: this.sandbox.spy()
            };

            Config.resolveAll([loader, plugin]);

            expect(loader.resolve.callCount).to.eq(1);
            expect(plugin.resolve.callCount).to.eq(1);
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
