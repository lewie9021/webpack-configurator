var DeepClone = require("lodash.clonedeep");
var Merge = require("lodash.mergewith");
var Utils = require("./utils");

function validate(input) {
    if (!Utils.isObject(input))
        throw new Error("You must provide a plugin config object.");

    if (Utils.isDefined(input.plugin) && !Utils.isFunction(input.plugin))
        throw new Error("You must provide a function for 'plugin'.");

    if (Utils.isDefined(input.parameters) && !Utils.isArray(input.parameters))
        throw new Error("You must provide an array for 'parameters'.");

    return input;
}

function merge(config, changes, property) {
    var source = changes;

    // Handle changes as an object map where keys are parameter indexes.
    if (Utils.isObject(source)) {
        var keys = Object.keys(source);

        source = keys.reduce(function(array, key) {
            if (!Utils.isInteger(key))
                throw new Error("You must provide numerical keys when defining 'changes' as an object.");

            array[key] = source[key];

            return array;
        }, []);
    }

    if (!Utils.isArray(source))
        throw new Error("You must provide either an object or array for 'changes'.");

    Merge(config.parameters, source);
}

module.exports = function plugin(input) {
    // Validate and clone the input.
    var config = DeepClone(validate(input));

    return {
        merge: function(index, changes) {
            var argsLength = arguments.length;

            (function() {
                // Handle if no arguments are passed.
                if (!argsLength)
                    throw new Error("You must provide either an object or function value for 'changes'.");

                // Handle when just changes are passed.
                // Note: This will either be an object or a function.
                if (argsLength == 1)
                    return merge(config, index);

                // Handle when all arguments are passed.
                // Note: we ignore any other parameters.
                merge(config, changes, index);
            })();

            // Return 'this' to enable function chaining.
            return this;
        },
        set: function() {

        },
        get: function() {
            return config;
        },
        resolve: function() {

        }
    };
};
