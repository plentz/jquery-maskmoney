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
            " *  Under <%= pkg.license %> License\n" +
            " */\n"
        },
        jshint: {
            all: ["Gruntfile.js", "src/**/*.js", "test/**/*.js", "!test/util.js"],
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
                    reserved: ["jQuery", "$"]
                }
            },
            build: {
                files: [
                { src: "src/jquery.maskMoney.js", dest: "dist/jquery.maskMoney.min.js" },
                ]
            }
        },
        qunit: {
          all: ["test/*.html"]
        },
        jquerymanifest: {
            options: {
                source: grunt.file.readJSON("package.json"),
                overrides: {
                    "name": "maskMoney",
                    "title": "jQuery maskMoney",
                    "download": "https://raw.github.com/plentz/jquery-maskmoney/master/dist/jquery.maskMoney.min.js",
                    "docs": "http://github.com/plentz/jquery-maskmoney",
                    "demo": "http://plentz.github.com/jquery-maskmoney",
                    "keywords": ["form", "input", "mask", "money"]
                }
            }
        },
        watch: {
          files: ["test/*.html", "test/*.js", "src/*.js"],
          tasks: ["jshint", "qunit"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jquerymanifest");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("test", ["jshint", "qunit"]);
    grunt.registerTask("default", ["jshint", "qunit", "concat", "uglify", "jquerymanifest"]);
};
