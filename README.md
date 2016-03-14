# Webpack Configurator

## Install

```
$ npm install webpack-configurator
```

## Motivation

In a number of my old projects, I found it difficult to DRY up the configuration files. My setup often contained a number of build modes (e.g. dev, test, and production), each sharing similar parts to one another. These common chunks were placed in a 'base' build mode. I wanted to still maintain the flexibility of including build mode specific configuration, while at the same time making slight changes to things such as loader query strings. In the end, I still found that my build mode files contained repetitive boilerplate code that I really wanted to avoid.

## API

* [Top-Level Exports](#top-level-exports)
  * [loader](#loaderconfig)
  * [loaders](#loadersconfigs)
  * [plugin](#pluginconfig)
  * [plugins](#pluginsconfigs)
  * [merge](#mergeobject-source-customizer)
  * [resolveAll](#resolveallwrappers)
  * [helpers](#helpers)
* [Loader](#loader)
  * [merge](#loadermergeproperty-changes-customizer)
  * [set](#loadersetproperty-changes)
  * [get](#loaderget)
  * [resolve](#loaderresolve)
* [Plugin](#plugin)
  * [merge](#pluginmergeindex-changes)
  * [set](#pluginsetindex-changes)
  * [get](#pluginget)
  * [resolve](#pluginresolve)
* [Helpers](#helpers-1)
  * [concatMerge](#concatmerge)

### Top-Level Exports

Below is a list of properties that are accessible at the top level of the module. Simply require the module into your script:

```javascript
// Note: I use Pascal case when referencing external modules.
var Config = require("webpack-configurator");
```

#### loader(config)

Complex configurations often modify the properties of loaders. This utility helps aid composabilty by providing a number of methods that cater to common use cases. The example below shows how to construct a loader:

```javascript
// The contents of 'babel' is a loader object wrapper.
var babel = Config.loader({
    test: /\.jsx?/,
    loader: "babel",
    query: {
        presets: ["es2015"]
    }
});
```

#### loaders(configs)

It's common to find configurations with multiple loaders. This utility provides a way to define several loaders at once, returning an array of loader object wrappers. Below is an example of its usage:

```javascript
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

#### plugin(config)

It's sometimes difficult to customise plugins because of the way they differ from loaders. This utility makes it easier by splitting out the parameters. The plugin isn't created until the `resolve` method is called. Below is an example of its usage:

```javascript
var Webpack = require("webpack");

var webpackDefine = Config.plugin({
    plugin: Webpack.DefinePlugin,
    parameters: [{
        VERSION: JSON.stringify("1.0.1"),
    }]
});
```

#### plugins(configs)

You may wish to define several plugins at once. This utility accepts an array of plugin configurations and returns an array of plugin object wrappers. Below is an example of its usage:

```javascript
var Webpack = require("webpack");

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
            compress: {
                warnings: false
            }
        }]
    }
]);
```

#### merge(object, source, [customizer])

A generalised merge utility. It works in a similar way to loader.merge and plugin.merge, only this function has no validation on properties.

```javascript
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

#### resolveAll(wrappers)

Useful when a configuration has several loaders or plugins. Each loader and plugin has a `resolve` method. This utility will call said method and return an array of resolved values.

```javascript
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
    module: {
        loaders: Config.resolveAll(loaders)
    }
};
```

#### helpers

This object contains miscellaneous functions that help resolve common problems when creating Webpack configurations. Right now, there is only one helper available 'concatMerge'. However, this number will likely increase in the future.

### Loader

<!---
Note: all methods are chainable.
-->

#### loader.merge([property], changes, [customizer])

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
babel.merge("query", {
    presets: ["react"]
}, Config.helpers.concatMerge);
```

#### loader.set([property], changes)

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

#### loader.resolve()

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

### Plugin

<!---
Note: all methods are chainable.
-->

#### plugin.merge([index], changes)

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

#### plugin.set([index], changes)

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

#### plugin.resolve()

<!---
Essentially does: return new Plugin(...parameters);
-->

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
