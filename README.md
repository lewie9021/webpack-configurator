# Webpack Configurator

## Install

```
$ npm install webpack-configurator
```

## Motivation

In a number of my old projects, I found it difficult to DRY up the configuration files. My setup often contained a number of build modes (e.g. dev, test, and production), each sharing similar parts to one another. These common chunks were placed in a 'base' build mode. I wanted to still maintain the flexibility of including build mode specific configuration, while at the same time making slight changes to things such as loader query strings. In the end, I still found that my build mode files contained repetitive boilerplate code that I really wanted to avoid.

## API

### Loaders

Complex configurations often modify the properties of loaders. This utility helps aid composabilty by providing a number of methods that cater to common use cases. The example below shows how to construct a loader:

```javascript
var Config = require("webpack-configurator");

var babel = Config.loader({
    test: /\.jsx?/,
    loader: "babel",
    query: {
        presets: ["es2015"]
    }
});
```

The returned value is a loader object that has the following methods:

<!---
Note: all methods are chainable.
-->

#### loader.merge

<!---
http://webpack.github.io/docs/configuration.html#module-loaders
Default valid properties:
- test [Regex]
- exclude [Regex]
- include [Regex]
- loader [String]
- loaders [Array -> String]

Additional valid properties:
- query [Object]
- queries [Object -> Object]

Property constraints:
- loader -> query
- loaders -> queries
-->

Basic example:
```javascript
babel.merge({
    query: {
        presets: ["es2015", "react"]
    }
});
```

Property specific example:
```javascript
babel.merge("query", {
    presets: ["es2015", "react"]
});
```

Function example:
```javascript
babel.merge("query", function(config) {
    var presets = config.query.presets;

    return {
        presets: presets.concat(["react"])
    };
});
```

Resolve merge example:
```javascript
babel.merge("loaders", function(config, loader) {
    var resolved = loader.resolve();

    return ExtractTextPlugin.extract(resolved.loaders);
});
```

Define merge behaviour example:
```javascript
var Defaults = require("webpack-configurator/defaults");

babel.merge("query", {
    presets: ["react"]
}, Defaults.concatMerge);
```

#### loader.set

<!---
http://webpack.github.io/docs/configuration.html#module-loaders
Default valid properties:
- test [Regex]
- exclude [Regex]
- include [Regex]
- loader [String]
- loaders [Array -> String]

Additional valid properties:
- query [Object]
- queries [Object -> Object]

Property constraints:
- loader -> query
- loaders -> queries
-->

Basic example:
```javascript
babel.set({
    query: {
        presets: ["es2015", "react"]
    }
});
```

Property specific example:
```javascript
babel.set("query", {
    presets: ["es2015", "react"]
});
```

Resolve set example:
```javascript
babel.set("loaders", function(config, loader) {
    var resolved = loader.resolve();

    return ExtractTextPlugin.extract(resolved.loaders);
});
```

#### loader.resolve

<!---
http://webpack.github.io/docs/configuration.html#module-loaders
Can only return the following properties (note: either 'loader' and 'loaders'):
- test [Regex]
- exclude [Regex]
- include [Regex]
- loader [String]
- loaders [Array -> String]

Minimum requirements for a loader:
- test [Regex]
- loader [String] | loaders [Array -> String]
-->

### Plugins

### Merging

### Resolving

### Defaults
