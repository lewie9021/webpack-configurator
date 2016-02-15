var Utils = require("./utilities");
var DeepClone = require("lodash.clonedeep");

function validate(input) {
    // Check it's an object.
    if (!Utils.isObject(input))
        throw new Error("You must provide a loader config object.");

    // Ensure 'test', 'exclude', and 'include' properties are regex values.
    ["test", "exclude", "include"].forEach(function(property) {
        var value = input[property];

        if (Utils.isDefined(value) && !Utils.isRegex(value))
            throw new Error("You must provide a regex value for '" + property + "'.");
    });

    // Ensure the 'loader' property is a string.
    if (Utils.isDefined(input.loader) && !Utils.isString(input.loader))
        throw new Error("You must provide a string value for 'loader'.");

    // Ensure the 'loaders' property is an array of strings.
    if (Utils.isDefined(input.loaders)) {
        if (!Utils.isArray(input.loaders))
            throw new Error("You must provide an array of string values for 'loaders'.");

        // Check each array item is a string.
        input.loaders.forEach(function(loader) {
            if (!Utils.isString(loader))
                throw new Error("You must provide an array of string values for 'loaders'.");
        });
    }

    // Ensure the 'query' property is an object.
    if (Utils.isDefined(input.query) && !Utils.isObject(input.query))
        throw new Error("You must provide an object for 'query'.");

    // Ensure the 'queries' property is an object of objects.
    if (Utils.isDefined(input.queries)) {
        if (!Utils.isObject(input.queries))
            throw new Error("You must provide an object of objects for 'queries'.");

        // Check each array item is a string.
        Object.keys(input.queries).forEach(function(key) {
            if (!Utils.isObject(input.queries[key]))
                throw new Error("You must provide an object of objects for 'queries'.");
        });
    }

    return input;
}


function merge(config, changes, property, customizer) {
    // TODO: Handle 'changes' as a function and object.
    // TODO: If 'property' is defined, wrap 'changes' in it: e.g. {[property]: changes}.
    // TODO: Validate the resolved value of 'changes'
}

function set(config, changes, property) {

}

function resolve(config) {

}

module.exports = function loader(input) {
    // Validate and clone the input.
    var config = DeepClone(validate(input));

    return {
        merge: function(property, changes, customizer) {
            var args = Array.prototype.slice.call(arguments);

            switch (args.length) {
                case 1: merge(config, property); break;
                case 2: merge(config, changes, property); break;
                case 3: merge(config, changes, property, customizer); break;
                default: throw new Error("You must provide either an object or function value.");
            }

            return this;
        },
        set: function(changes) {
            set(config, changes);

            return this;
        },
        resolve: function() {
            return resolve(config);
        }
    };
};
