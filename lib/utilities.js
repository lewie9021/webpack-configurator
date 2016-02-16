module.exports.isDefined = function(value) {
    return typeof value !== "undefined";
};

module.exports.isObject = function(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
};

module.exports.isRegex = function(value) {
    return Object.prototype.toString.call(value) === "[object RegExp]";
};

module.exports.isFunction = function(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
};

module.exports.isString = function(value) {
    return typeof value === "string";
};

module.exports.isArray = function(value) {
    return Array.isArray(value);
};
