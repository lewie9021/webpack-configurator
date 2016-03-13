var Utils = require("./utils");
var Plugin = require("./plugin");

function validate(input) {
    // Check it's an array.
    if (!Utils.isArray(input))
        throw new Error("You must provide an array of plugin configurations.");

    // Check each array item is an object.
    input.forEach(function(config) {
        if (!Utils.isObject(config))
            throw new Error("You must provide an array of plugin configurations.");
    });

    return input;
}

module.exports = function plugins(input) {
    // Validate the input.
    var configs = validate(input);

    return configs.map(Plugin);
};
