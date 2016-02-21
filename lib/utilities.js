var Utils = require("../lib/utils");

function resolveAll(input) {
    if (!Utils.isArray(input))
        throw new Error("You must provide an array of values.");

    return input.map(function(value) {
        if (!Utils.isObject(value) || !Utils.isFunction(value.resolve))
            throw new Error("You must provide values that contain a 'resolve' function.");

        return value.resolve();
    });
}

module.exports = {
    resolveAll: resolveAll
};
