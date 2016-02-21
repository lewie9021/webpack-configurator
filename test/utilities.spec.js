var Chai = require("chai");
var Sinon = require("sinon");
var Types = require("./helpers/types");
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
