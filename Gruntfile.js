module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ["jquery.maskMoney.js"]
    },
    uglify: {
      options: {
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