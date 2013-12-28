module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ["jquery.maskMoney.js"],
      options: {
        globals: {
          bitwise: true,
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    uglify: {
      options: {
        banner: '/*\n    <%= pkg.description %>\n    version: <%= pkg.version %>\n    <%= pkg.homepage %>\n    Copyright (c) 2009 - <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n    Licensed under the MIT license (https://github.com/plentz/jquery-maskmoney/blob/master/LICENSE)\n*/\n',
        preserveComments: 0,
        mangle: {
          except: ["jQuery", "$"]
        }
      },
      build: {
        files: [
          { src: "jquery.maskMoney.js", dest: "jquery.maskMoney.min.js" },
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("default", ["jshint", "uglify"]);
};