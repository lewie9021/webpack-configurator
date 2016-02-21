var Chai = require("chai");
var Sinon = require("sinon");
var Types = require("./helpers/types");
var Helpers = require("../lib/helpers");
var Utilities = require("../lib/utilities");

var expect = Chai.expect;
var types = Types();

describe("Utilities:", function() {

    beforeEach(function() {
        this.sandbox = Sinon.sandbox.create();
    });

    afterEach(function() {
        this.sandbox.restore();
    });

    describe("merge", function() {

        it("is a function", function() {
            expect(Utilities.merge).to.be.a("function");
        });

        it("throws if 'object' 'source' aren't objects", function() {
            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                // Invalid 'object' values.
                expect(function() {
                    Utilities.merge(types[type], {});
                }).to.throw("You must provide an object value for 'object'.");

                // Invalid 'source' values.
                expect(function() {
                    Utilities.merge({}, types[type]);
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

            var actual = Utilities.merge(object, source);
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

            var actual = Utilities.merge(object, source, Helpers.concatMerge);
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
                    Utilities.merge({}, {}, types[type]);
                }).to.throw(error);
            });
        });

    });

    describe("resolveAll", function() {

        it("is a function", function() {
            expect(Utilities.resolveAll).to.be.a("function");
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

            var actual = Utilities.resolveAll([loader, plugin]);
            var expected = ["loader", "plugin"];

            expect(actual).to.eql(expected);
        });

        it("throws if an array isn't passed", function() {
            var error = "You must provide an array of values.";

            Object.keys(types).forEach(function(type) {
                if (type == "array")
                    return;

                expect(function() {
                    Utilities.resolveAll(types[type]);
                }).to.throw(error);
            });
        });

        it("throws if objects in the passed array don't contain a resolve function", function() {
            var error = "You must provide values that contain a 'resolve' function.";

            Object.keys(types).forEach(function(type) {
                if (type == "object")
                    return;

                expect(function() {
                    Utilities.resolveAll([types[type]]);
                }).to.throw(error);
            });

            Object.keys(types).forEach(function(type) {
                if (type == "func")
                    return;

                expect(function() {
                    Utilities.resolveAll([
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

            Utilities.resolveAll([loader, plugin]);

            expect(loader.resolve.callCount).to.eq(1);
            expect(plugin.resolve.callCount).to.eq(1);
        });

    });

});
