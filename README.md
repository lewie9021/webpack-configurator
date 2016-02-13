# Webpack Configurator

## Install

```
$ npm install webpack-configurator
```

## Motivation

In a number of my old projects, I found it difficult to DRY up the configuration files. My setup often contained a number of build modes (e.g. dev, test, and production), each sharing similar parts to one another. These common chunks were placed in a 'base' build mode. I wanted to still maintain the flexibility of including build mode specific configuration, while at the same time making slight changes to things such as loader query strings. In the end, I still found that my build mode files contained repetitive boilerplate code that I really wanted to avoid.

## API

* [Loaders](#loaders)
  * [merge](#loadermerge)
  * [set](#loaderset)
  * [resolve](#loaderresolve)
* [Plugins](#plugins)
  * [merge](#pluginmerge)
  * [set](#pluginset)
  * [resolve](#pluginresolve)
* [Utilities](#utilities)
  * [merge](#utilitiesmerge)
  * [resolveAll](#utilitiesresolveall)
* [Helpers](#helpers)
  * [concatMerge](#helpersconcatmerge)

### Loaders

Complex configurations often modify the properties of loaders. This utility helps aid composabilty by providing a number of methods that cater to common use cases. The example below shows how to construct a loader:

Basic example:
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

Multi-declaration example:
```javascript
var Config = require("webpack-configurator");

var loaders = Config.loaders([
    {
        test: /\.jsx?/,
        loader: "babel",
        query: {
            presets: ["es2015"]
        }
    },
    {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
    }
]);
```

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
var Helpers = require("webpack-configurator/helpers");

babel.merge("query", {
    presets: ["react"]
}, Helpers.concatMerge);
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
var Config = require("webpack-configurator");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var sass = Config.loader({
    test: /\.scss$/,
    loaders: ["style", "css", "sass"],
    queries: {
        css: {sourceMap: true},
        sass: {sourceMap: true}
    }
});

sass.set("loaders", function(config, loader) {
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

Basic example:
```javascript
var Webpack = require("webpack");
var Config = require("webpack-configurator");

var webpackDefine = Config.plugin({
    plugin: Webpack.DefinePlugin,
    parameters: [{
        VERSION: JSON.stringify("1.0.1"),
    }]
});
```

Multi-declaration example:
```javascript
var Webpack = require("webpack");
var Config = require("webpack-configurator");

var plugins = Config.plugins([
    {
        plugin: Webpack.DefinePlugin,
        parameters: [{
            VERSION: JSON.stringify("1.0.1")
        }]
    },
    {
        plugin: Webpack.UglifyJsPlugin,
        parameters: [{
            compress: {warnings: false}
        }]
    }
]);
```

<!---
Note: all methods are chainable.
-->

#### plugin.merge

Basic example:
```javascript
webpackDefine.merge([{
    TWO: "1+1"
}]);
```

Property specific example:
```javascript
webpackDefine.merge(0, {
    TWO: "1+1"
});
```

Another property specific example:
```javascript
webpackDefine.merge({
    0: {TWO: "1+1"}
});
```

#### plugin.set

Basic example:
```javascript
webpackDefine.set([{
    TWO: "1+1"
}]);
```

Property specific example:
```javascript
webpackDefine.set(0, {
    TWO: "1+1"
});
```

Another property specific example:
```javascript
webpackDefine.set({
    0: {TWO: "1+1"}
});
```

#### plugin.resolve

<!---
Essentially does: return new Plugin(...parameters);
-->

### Utilities

#### Config.merge

A generalised merge utility. It works in a similar way to loader.merge and plugin.merge, only this function has no validation on properties.

Basic example:

```javascript
var Config = require("webpack-configurator");

var base = {
    entry: "./base.entry.js",
    output: {
        filename: "bundle.js"
    }
};

module.exports = Config.merge(base, {
    devtool: "source-map",
    entry: "./dev.entry.js",
});
```

#### Config.resolveAll

Useful when a configuration has several loaders or plugins. Each loader and plugin has a .resolve method. This utility ill call said method and return an array of resolved values.

Basic example:

```javascript
var Config = require("webpack-configurator");

var loaders = Config.loaders([
    {
        test: /\.jsx?$/,
        loader: "babel"
    },
    {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
    }
]);

module.exports = {
    entry: "./base.entry.js",
    output: {
        filename: "bundle.js"
    },
    loaders: Config.resolveAll(loaders)
};
```

### Helpers

#### concatMerge

By default, merges will overwrite arrays. This helper provides a simple implementation that overrides said behaviour.

Basic example:

```javascript
var Config = require("webpack-configurator");

var helpers = Config.helpers;
var sass = Config.loader({
    test: /\.scss$/,
    loaders: ["style", "css"]
});

sass.merge({
    loaders: ["sass"]
}, helpers.concatMerge());
```

Prepend example:

```javascript
var Config = require("webpack-configurator");

var helpers = Config.helpers;
var base = {
    entry: [
        "./main.js"
    ],
    output: {
        filename: "bundle.js"
    }
};

module.exports = Config.merge(base, {
    entry: [
        "webpack-dev-server/client?http://localhost:8080"
    ]
}, helpers.concatMerge(true));
```
