var Config = require("../");
var expect = require("chai").expect;

describe("merge", function() {

    beforeEach(function() {
        this.config = new Config();
    });

    it("should accept either an object or a function", function() {
        var config = this.config;
        var valid = [{}, function() {}, []];
        var invalid = ["", true, false, 5, undefined, null];

        valid.forEach(function(validParameter) {
            expect(function() {
                config.merge(validParameter);
            }).not.to.throw();
        });
        
        invalid.forEach(function(invalidParameter) {
            expect(function() {
                config.merge(invalidParameter);
            }).to.throw("Invalid Parameter. You must provide either an object or a function.");
        });
    });


    describe("examples (using objects)", function() {
        
        it("should successfully merge a simple configuration object", function() {
            var config = {
                entry: "./main.js",
                output: {
                    filename: "bundle.js"
                }
            };

            this.config.merge(config);

            // Shouldn't be a reference, just needs to deeply equal.
            expect(this.config.resolve()).to.eql(config);
        });

        it("should allow multiple calls to config.merge", function() {
            this.config.merge({
                entry: "./main.js",
                output: {
                    filename: "bundle.js"
                }
            });

            this.config.merge({
                output: {
                    path: __dirname + "/dist"
                }
            });
            
            expect(this.config.resolve()).to.eql({
                entry: "./main.js",
                output: {
                    path: __dirname + "/dist",
                    filename: "bundle.js"
                }
            });
        });

        it("should merge arrays using concatenation", function() {
            this.config.merge({
                entry: [
                    "screens/a.js",
                    "screens/b.js",
                    "screens/c.js"
                ],
                output: {
                    filename: "bundle.js"
                }
            });

            this.config.merge({
                entry: [
                    "screens/d.js",
                    "screens/e.js",
                    "screens/f.js"
                ]
            });
            
            expect(this.config.resolve()).to.eql({
                entry: [
                    "screens/a.js",
                    "screens/b.js",
                    "screens/c.js",
                    "screens/d.js",
                    "screens/e.js",
                    "screens/f.js"
                ],
                output: {
                    filename: "bundle.js"
                }
            });
        });
        
    });

});
