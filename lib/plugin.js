var DeepClone = require("lodash.clonedeep");
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

module.exports = function plugin(input) {
    // Validate and clone the input.
    var config = DeepClone(validate(input));

    return {
        merge: function() {

        },
        set: function() {

        },
        get: function() {

        },
        resolve: function() {

        }
    };
};
