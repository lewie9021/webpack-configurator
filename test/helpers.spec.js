var Chai = require("chai");
var Sinon = require("sinon");
var Helpers = require("../lib/helpers");
var Merge = require("lodash.mergewith");

var expect = Chai.expect;

describe("Helpers:", function() {

    describe("concatMerge", function() {

        it("is a function", function() {
            expect(Helpers.concatMerge).to.be.a("function");
        });

        it("concatenates arrays when merging", function() {
            var object = {
                a: ["test"]
            };
            var source = {
                a: ["xyz"]
            };

            var actual = Merge(object, source, Helpers.concatMerge);
            var expected = {
                a: ["test", "xyz"]
            };

            expect(actual).to.eql(expected);
        });

        it("concatenates nested arrays when merging", function() {
            var object = {
                a: {
                    b: ["test"]
                }
            };
            var source = {
                a: {
                    b: ["abc"]
                }
            };

            var actual = Merge(object, source, Helpers.concatMerge);
            var expected = {
                a: {
                    b: ["test", "abc"]
                }
            };

            expect(actual).to.eql(expected);
        });

    });

});
