function isDefined(value) {
    return typeof value !== "undefined";
}

function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
};

function isRegex(value) {
    return Object.prototype.toString.call(value) === "[object RegExp]";
};

function isFunction(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
};

function isNumber(value) {
    return Object.prototype.toString.call(value) === "[object Number]";
};

function isString(value) {
    return typeof value === "string";
};

function isArray(value) {
    return Array.isArray(value);
};

function isInteger(value, strict) {
    // Handle empty strings. With type conversion, this will become 0.
    if (value === "")
        return false;

    // Check if we care 'value' is actually a number (e.g. not string 5).
    if (strict && !isNumber(value))
        return false;

    return value % 1 === 0;
};

module.exports = {
    isDefined: isDefined,
    isObject: isObject,
    isRegex: isRegex,
    isFunction: isFunction,
    isNumber: isNumber,
    isString: isString,
    isArray: isArray,
    isInteger: isInteger
};
