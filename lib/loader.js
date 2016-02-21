var Utils = require("./utilities");
var DeepClone = require("lodash.clonedeep");
var Merge = require("lodash.mergewith");

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
    var source = changes;

    // Handle 'changes' as a function.
    if (Utils.isFunction(changes))
        source = changes(config);

    // Ensure 'changes' resolves to an object.
    if (!Utils.isObject(source))
        throw new Error("You must provide an object or function (that returns an object) for 'changes'.");

    if (Utils.isDefined(property)) {
        if (!Utils.isString(property))
            throw new Error("You must provide a string value for 'property'.");

        // Wrap 'changes' within the property: e.g. {[property]: changes}.
        var wrapper = {};
        wrapper[property] = source;
        source = wrapper;
    }

    // Validate the resolved value of 'changes'.
    try {
        validate(source);
    } catch(err) {
        throw new Error("Invalid 'changes' value. " + err.message);
    }

    if (Utils.isDefined(customizer) && !Utils.isFunction(customizer))
        throw new Error("You must provide a function for 'customizer'.");

    Merge(config, source, customizer);
}

function set(config, changes, property) {
    var source = changes;

    // Handle 'changes' as a function.
    if (Utils.isFunction(changes))
        source = changes(config);

    // Ensure 'changes' resolves to an object.
    if (!Utils.isObject(source))
        throw new Error("You must provide an object or function (that returns an object) for 'changes'.");

    if (Utils.isDefined(property)) {
        if (!Utils.isString(property))
            throw new Error("You must provide a string value for 'property'.");

        // Wrap 'changes' within the property: e.g. {[property]: changes}.
        var wrapper = {};
        wrapper[property] = source;
        source = wrapper;
    }

    // Validate the resolved value of 'changes'.
    try {
        validate(source);
    } catch(err) {
        throw new Error("Invalid 'changes' value. " + err.message);
    }

    // Assign top-level properties in 'config' with properties in 'source'.
    Object.keys(source).forEach(function(key) {
        config[key] = source[key];
    });
}

function resolve(config) {
    return DeepClone(config);
}

module.exports = function loader(input) {
    // Validate and clone the input.
    var config = DeepClone(validate(input));

    return {
        merge: function(property, changes, customizer) {
            var argsLength = arguments.length;

            (function() {
                // Handle if no arguments are passed.
                if (!argsLength)
                    throw new Error("You must provide either an object or function value for 'changes'.");

                // Handle when just changes are passed.
                // Note: This will either be an object or a function.
                if (argsLength == 1)
                    return merge(config, property);

                // Handle when a property or customizer is passed.
                if (argsLength == 2) {
                    // If the second parameter is a function, we assume they
                    // passed 'changes' and 'customizer'.
                    if (Utils.isFunction(changes))
                        return merge(config, property, undefined, changes);

                    // Assume they passed a 'property' and 'changes'.
                    return merge(config, changes, property);
                }

                // Handle when all arguments are passed.
                // Note: we ignore any other parameters.
                return merge(config, changes, property, customizer);
            })();

            // Return 'this' to enable function chaining.
            return this;
        },
        set: function(property, changes) {
            var argsLength = arguments.length;

            (function() {
                // Handle if no arguments are passed.
                if (!argsLength)
                    throw new Error("You must provide either an object or function value for 'changes'.");

                // Handle when just changes are passed.
                // Note: This will either be an object or a function.
                if (argsLength == 1)
                    return set(config, property);

                // Handle when all arguments are passed.
                // Note: we ignore any other parameters.
                return set(config, changes, property);
            })();

            // Return 'this' to enable function chaining.
            return this;
        },
        get: function() {
            return DeepClone(config);
        },
        resolve: function() {
            return resolve(config);
        }
    };
};
