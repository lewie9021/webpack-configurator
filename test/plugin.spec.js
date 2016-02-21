var Webpack = require("webpack");
var Chai = require("chai");
var Config = require("../");

var expect = Chai.expect;

describe("Plugin:", function() {

    xdescribe("merge", function() {

        it("merges parameters, given an array for 'changes'", function() {

        });

        it("merges parameters at specific indexes, given a 'changes' object with numerical keys", function() {

        });

        it("throws if a 'changes' object is passed with non-numerical keys", function() {

        });

        it("throws if 'changes' isn't an object or array", function() {

        });

        it("merges a parameter at a specific index, given an 'index' integer", function() {

        });

        it("throws if 'index' isn't an integer", function() {

        });

    });

    xdescribe("set", function() {

        it("overwrites parameters, given an array for 'changes'", function() {

        });

        it("overwrites parameters at specific indexes, given a 'changes' object with numerical keys", function() {

        });

        it("throws if a 'changes' object is passed with non-numerical keys", function() {

        });

        it("overwrites a parameter at a specific index, given an 'index' integer", function() {

        });

        it("throws if 'index' isn't an integer", function() {

        });

    });

    xdescribe("get", function() {

        it("returns a clone of the internal plugin config", function() {

        });

    });

    xdescribe("resolve", function() {

    });

});
