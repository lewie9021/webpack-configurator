module.exports.isDefined = function(value) {
    return typeof value !== "undefined";
};

module.exports.isObject = function(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
};

module.exports.isRegex = function(value) {
    return Object.prototype.toString.call(value) === "[object RegExp]";
};

module.exports.isString = function(value) {
    return typeof value === "string";
};
