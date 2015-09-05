var _ = require("lodash");

// Used by the resolve method to modify the loader config before appending to the module.[pre|post]loaders.
module.exports = function(name, loader) {
    var config;
    
    loader = _.clone(loader, true);
        
    if (loader.resolver)
        loader.config = loader.resolver(_.clone(loader.config, true), name);

    config = loader.config;

    /*
    if (config.query && config.queries)
        throw new Error("Use one or the other, fml");

    if (!config.loader && config.query) {
        config.loader = name + "?" + JSON.stringify(config.query);
        delete config.query;
    }
    
    // The queries object contains a map for each loader containing config specific for each one. Provided
    // config.loader is falsy, we will construct a query string for each loader.
    if (!config.loader && config.queries) {
        for (name in config.queries) {
            var query = config.queries[name];
            var string = (name + "?" + JSON.stringify(query));
            query.push(string);
        }
        
        config.loader = query.join("!");
        delete config.queries;
    }
    */     

    if (!config.loader)
        config.loader = name;

    return loader.config;
};
