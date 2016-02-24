var Webpack = require("webpack");
var Chai = require("chai");
var Types = require("./helpers/types");
var Config = require("../");

var expect = Chai.expect;
var types = Types();

describe("Plugin:", function() {

    xdescribe("merge", function() {

        it("merges parameters, given an array for 'changes'", function() {
            var plugin = Config.plugin({
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.merge([{b: 2}, 3, "merge"]);

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.definePlugin,
                parameters: [{a: 1, b: 2}, 3, "merge"]
            };

            expect(actual).to.eql(expected);
        });

        it("merges parameters at specific indexes, given a 'changes' object with numerical keys", function() {
            var plugin = Config.plugin({
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.merge({
                0: {b: 2},
                2: {c: 3}
            });

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.definePlugin,
                parameters: [{a: 1, b: 2}, 3, {c: 3}]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if a 'changes' object is passed with non-numerical keys", function() {
            var error = "You must provide numerical keys when defining 'changes' as an object.";
            var plugin = Config.plugin({
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "int")
                    return;

                var key = types[type];
                var changes = {};

                changes[key] = "test";

                expect(function() {
                    plugin.merge(changes);
                }).to.throw(error);
            });
        });

        it("fills empty parameter indexes with 'undefined', given out of range keys", function() {
            var plugin = Config.plugin({
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5]
            });

            plugin.merge({
                0: {b: 2},
                4: "test"
            });

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, undefined, undefined, "test"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'changes' isn't an object or array", function() {
            var error = "You must provide either an object or array for 'changes'.";
            var plugin = Config.plugin({
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "object" || type == "array")
                    return;

                expect(function() {
                    plugin.merge(types[type]);
                }).to.throw(error);
            });
        });

        it("merges a parameter at a specific index, given an 'index' integer", function() {
            var plugin = Config.plugin({
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.merge(2, "merge");

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, "merge"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'index' isn't an integer", function() {
            var error = "You must provide an integer for 'index'.";
            var plugin = Config.plugin({
                plugin: Webpack.definePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "int")
                    return;

                expect(function() {
                    plugin.merge(types[type], {});
                }).to.throw(error);
            });
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

        it("returns an instance of 'plugin'", function() {

        });

        it("applies 'parameters' upon initialisation", function() {

        });

        it("throws if 'plugin' isn't a function", function() {

        });

    });

});
