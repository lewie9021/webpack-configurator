function merge(config, changes) {
    // TODO: Validate 'changes'.
}

function set(config, changes) {

}

function resolve(config) {

}

module.exports = function loader(config) {
    // TODO: Clone and validate 'config'.

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
