// Used by the resolve method to execute the plugin constructor with the parameters provided.
module.exports = function(name, plugin) {
    return (function() {
        function F(args) {
            return plugin.constructor.apply(this, args);
        }

        F.prototype = plugin.constructor.prototype;

        return new F(arguments);
    }).apply(this, plugin.parameters);
};
