module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        meta: {
            banner: "/*\n" +
            " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
            " *  <%= pkg.description %>\n" +
            " *  <%= pkg.homepage %>\n" +
            " *\n" +
            " *  Made by <%= pkg.author.name %>\n" +
            " *  Under <%= pkg.licenses[0].type %> License (<%= pkg.licenses[0].url %>)\n" +
            " */\n"
        },
        jshint: {
            all: ["src/jquery.maskMoney.js", "Gruntfile.js"],
            options: {
                jshintrc: true
            }
        },
        concat: {
            dist: {
                src: ["src/jquery.maskMoney.js"],
                dest: "dist/jquery.maskMoney.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        uglify: {
            options: {
                banner: "<%= meta.banner %>",
                mangle: {
                    except: ["jQuery", "$"]
                }
            },
            build: {
                files: [
                { src: "src/jquery.maskMoney.js", dest: "dist/jquery.maskMoney.min.js" },
                ]
            }
        },
        jquerymanifest: {
            options: {
                source: grunt.file.readJSON("package.json"),
                overrides: {
                    "name": "maskMoney",
                    "title": "jQuery maskMoney",
                    "homepage": "http://plentz.github.com/jquery-maskmoney",
                    "download": "https://raw.github.com/plentz/jquery-maskmoney/master/dist/jquery.maskMoney.min.js",
                    "docs": "http://github.com/plentz/jquery-maskmoney",
                    "demo": "http://plentz.github.com/jquery-maskmoney",
                    "keywords": ["form", "input", "mask", "money"],
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jquerymanifest");

    grunt.registerTask("default", ["jshint", "concat", "uglify", "jquerymanifest"]);
    grunt.registerTask("travis", ["jshint"]);
};