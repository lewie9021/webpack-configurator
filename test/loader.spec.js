var Config = require("../");
var expect = require("chai").expect;

describe("loader", function() {

    beforeEach(function() {
        this.config = new Config();
    });

    it("should require a name (that's a string) to enable referencing when merging", function() {
        var config = this.config;
        var invalid = [5, function() {}, [], null, undefined, {}];

        invalid.forEach(function(invalidParameter) {
            expect(function() {
                config.loader(invalidParameter);
            }).to.throw("Invalid 'name' parameter. You must provide a string.");
        });
        
        expect(function() {
            config.loader("my-loader", {});
        }).to.not.throw();
    });

    it("should accept a config parameter that's an object, function, or null", function() {
        var config = this.config;
        var valid = [{}, function() {}, null];
        var invalid = ["", [], true, false, 5, undefined];
        
        valid.forEach(function(validParameter) {
            expect(function() {
                config.loader("my-loader", validParameter);
            }).not.to.throw();
        });
        
        invalid.forEach(function(invalidParameter) {
            expect(function() {
                config.loader("my-loader", invalidParameter);
            }).to.throw("Invalid 'config' parameter. You must provide either an object, function, or null.");
        });
    });

    it("should, when resolving, create a module.loaders array if not already created", function() {
        var resolved;
        
        this.config.loader("my-loader", {
            test: /\.myldr/
        });

        resolved = this.config.resolve();
        
        expect(resolved).to.have.property("module");
        expect(resolved.module).to.have.property("loaders");
        expect(resolved.module.loaders).to.be.an.instanceof(Array);
        expect(resolved.module.loaders[0]).to.be.an.instanceof(Object);
    });

    it("should use the value of 'name' for the 'loader' property when resolving if no loader is defined", function() {
        var loaders;

        this.config.loader("my-loader", {
            test: /\.myldr/
        });

        loaders = this.config.resolve().module.loaders;

        expect(loaders[0]).to.have.property("loader", "my-loader");
    });
    
    it("should not assign the 'loader' property if a 'loader' property already exists", function() {
        var loaders;

        // This should cancel out the auto 'loader' assign.
        this.config.loader("my-loader", {
            test: /\.myldr/,
            loader: "some-other-loader"
        });

        loaders = this.config.resolve().module.loaders;

        expect(loaders[0].loader).to.eq("some-other-loader");
    });

    it("should not assign the 'loader' property if a 'loaders' property already exists", function() {
        var loaders;

        // This should cancel out the auto 'loader' assign.
        this.config.loader("my-loader", {
            test: /\.myldr/,
            loaders: ["my-loader", "some-other-loader"]
        });

        loaders = this.config.resolve().module.loaders;

        expect(loaders[0]).to.not.have.property("loader");
    });
    
});
