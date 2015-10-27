var Config = require("../");
var expect = require("chai").expect;

describe("plugin", function() {

    beforeEach(function() {
        this.config = new Config();
    });

    it("should require a name (that's a string) to enable referencing when merging", function() {
        var config = this.config;
        var invalid = [5, function() {}, [], null, undefined, {}];

        invalid.forEach(function(invalidParameter) {
            expect(function() {
                config.plugin(invalidParameter);
            }).to.throw("Invalid 'name' parameter. You must provide a string.");
        });
        
        expect(function() {
            config.plugin("my-plugin", function() {});
        }).to.not.throw();
    });

    it("should accept a constructor that's either a function or null", function() {
        var config = this.config;
        var valid = [function() {}, null];
        var invalid = ["", [], {}, true, false, 5, undefined];
        
        valid.forEach(function(validParameter) {
            expect(function() {
                config.plugin("my-plugin", validParameter);
            }).not.to.throw();
        });
        
        invalid.forEach(function(invalidParameter) {
            expect(function() {
                config.plugin("my-plugin", invalidParameter);
            }).to.throw("Invalid 'constructor' parameter. You must provide either a function or null.");
        });
    });
    
    it("should accept an optional 'parameters' argument that's either a function or an array", function() {
        var config = this.config;
        var constructor = function() {};
        var valid = [function() { return []; }, [], "", null, undefined, false];
        var invalid = ["test", {}, true, 5];
        
        valid.forEach(function(validParameter) {
            expect(function() {
                config.plugin("my-plugin", constructor, validParameter);
            }).not.to.throw();
        });
        
        invalid.forEach(function(invalidParameter) {
            expect(function() {
                config.plugin("my-plugin", constructor, invalidParameter);
            }).to.throw("The optional 'parameters' argument must be an array or a function.");
        });
    });

    it("should throw if 'parameters' is passed a function that doesn't return an array", function() {
        var config = this.config;
        var constructor = function() {};
        var invalid = ["", {}, true, 5, null, undefined, false, function() {}];

        expect(function() {
            config.plugin("my-plugin", constructor, function() {
                return [];
            });
        }).to.not.throw();
        
        invalid.forEach(function(invalidReturnValue, i) {
            expect(function() {
                config.plugin("my-plugin", constructor, function() {
                    return invalidReturnValue;
                });
            }).to.throw("The 'parameters' argument must return an array.");
        });
    });

    it("should enable function chaining by returning the config instance", function() {
        var config = this.config.plugin("my-plugin", function() {});

        // Reference equality.
        expect(config).to.eq(this.config);
    });

    it("should create a 'plugins' array property on the resolved config object", function() {
        var result;
        
        this.config.plugin("my-plugin", function() {});

        result = this.config.resolve();

        expect(result).to.have.property("plugins");
        expect(result.plugins).to.be.an.instanceof(Array);
        expect(result.plugins.length).to.eq(1);
    });

});
