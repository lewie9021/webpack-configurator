var Merge = require("lodash.mergewith");
var Utils = require("../lib/utils");

function merge(object, source, customizer) {
    if (!Utils.isObject(object))
        throw new Error("You must provide an object value for 'object'.");

    if (!Utils.isObject(source))
        throw new Error("You must provide an object value for 'source'.");

    if (Utils.isDefined(customizer) && !Utils.isFunction(customizer))
        throw new Error("You must provide a function for 'customizer'.");

    return Merge(object, source, customizer);
}

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
    merge: merge,
    resolveAll: resolveAll
};
