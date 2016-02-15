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

    return input;
}


function merge(config, changes) {
    // TODO: Validate 'changes'.
}

function set(config, changes) {

}

function resolve(config) {

}

module.exports = function loader(input) {
    // Validate and clone the input.
    var config = DeepClone(validate(input));

    return {
        merge: function(changes) {
            // Attempt to perform the merge.
            merge(config, changes);

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
