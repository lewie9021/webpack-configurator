var Webpack = require("webpack");
var Chai = require("chai");
var Types = require("./helpers/types");
var Config = require("../");

var expect = Chai.expect;
var types = Types();

describe("Plugin:", function() {

    describe("merge", function() {

        it("merges parameters, given an array for 'changes'", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.merge([{b: 2}, 3, "merge"]);

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1, b: 2}, 3, "merge"]
            };

            expect(actual).to.eql(expected);
        });

        it("merges parameters at specific indexes, given a 'changes' object with numerical keys", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.merge({
                0: {b: 2},
                2: {c: 3}
            });

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1, b: 2}, 5, {c: 3}]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if a 'changes' object is passed with non-numerical keys", function() {
            var error = "You must provide numerical keys when defining 'changes' as an object.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
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
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5]
            });

            plugin.merge({
                0: {b: 2},
                4: "test"
            });

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1, b: 2}, 5, undefined, undefined, "test"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'changes' isn't an object or array", function() {
            var error = "You must provide either an object or array for 'changes'.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
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

        it("accepts a function who's return value is merged with the plugin's parameters", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.merge(function(parameters) {
                return [{b: 2}, 3, "merge"];
            });

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1, b: 2}, 3, "merge"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'changes' doesn't return an object or array, given a function", function() {
            var error = "You must provide either an object or array for 'changes'.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "object" || type == "array")
                    return;

                expect(function() {
                    plugin.merge(function() {
                        return types[type];
                    });
                }).to.throw(error);
            });
        });

        it("merges a parameter at a specific index, given an 'index' integer", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.merge(2, {b: 2});

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, {b: 2}]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'index' isn't an integer", function() {
            var error = "You must provide an integer for 'index'.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
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

    describe("set", function() {

        it("overwrites parameters, given an array for 'changes'", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.set([{b: 2}]);

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{b: 2}, 5, "test"]
            };

            expect(actual).to.eql(expected);
        });

        it("overwrites parameters at specific indexes, given a 'changes' object with numerical keys", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.set({
                0: {b: 2},
                2: "changed"
            });

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{b: 2}, 5, "changed"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if a 'changes' object is passed with non-numerical keys", function() {
            var error = "You must provide numerical keys when defining 'changes' as an object.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "int")
                    return;

                var key = types[type];
                var changes = {};

                changes[key] = "test";

                expect(function() {
                    plugin.set(changes);
                }).to.throw(error);
            });
        });

        it("throws if 'changes' isn't an object or array", function() {
            var error = "You must provide either an object or array for 'changes'.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "object" || type == "array")
                    return;

                expect(function() {
                    plugin.set(types[type]);
                }).to.throw(error);
            });
        });

        it("accepts a function who's return value is merged with the plugin's parameters", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.set(function(parameters) {
                return [{b: 2}, 3, "changed"];
            });

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{b: 2}, 3, "changed"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'changes' doesn't return an object or array, given a function", function() {
            var error = "You must provide either an object or array for 'changes'.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "object" || type == "array")
                    return;

                expect(function() {
                    plugin.set(function() {
                        return types[type];
                    });
                }).to.throw(error);
            });
        });

        it("overwrites a parameter at a specific index, given an 'index' integer", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            plugin.set(2, "changed");

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "changed"]
            };

            expect(actual).to.eql(expected);
        });

        it("throws if 'index' isn't an integer", function() {
            var error = "You must provide an integer for 'index'.";
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });

            Object.keys(types).forEach(function(type) {
                if (type == "int")
                    return;

                expect(function() {
                    plugin.set(types[type], {});
                }).to.throw(error);
            });
        });

    });

    describe("get", function() {

        it("returns a clone of the internal plugin config", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            });
            var state = plugin.get();

            // Mutate the state.
            // If we simply return the internal reference,
            // it will effect the next call to plugin.get().
            state.plugin = Webpack.optimize.UglifyJsPlugin;

            var actual = plugin.get();
            var expected = {
                plugin: Webpack.DefinePlugin,
                parameters: [{a: 1}, 5, "test"]
            };

            expect(actual).to.eql(expected);
        });

    });

    describe("resolve", function() {

        it("returns an instance of 'plugin'", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin
            });

            var actual = plugin.resolve();
            var expected = new Webpack.DefinePlugin();

            expect(actual).to.eql(expected);
        });

        it("applies 'parameters' upon initialisation", function() {
            var plugin = Config.plugin({
                plugin: Webpack.DefinePlugin,
                parameters: [{
                    VERSION: JSON.stringify("5fa3b9"),
                    BROWSER_SUPPORTS_HTML5: true,
                    TWO: "1+1"
                }]
            });

            var actual = plugin.resolve();
            var expected = new Webpack.DefinePlugin({
                VERSION: JSON.stringify("5fa3b9"),
                BROWSER_SUPPORTS_HTML5: true,
                TWO: "1+1"
            });

            expect(actual).to.eql(expected);
        });
    });

});
