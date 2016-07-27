module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      jshintrc: ".jshintrc",
      files: ["Gruntfile.js", "src/js/*.js", "test/specs/*.js"],
    },
    jasmine: {
      simple: {
        options: {
          specs: "test/specs/*.spec.js",
          outfile: "test/jasmine/_SpecRunner.html"
        },
        src: "src/js/*.js"
      },
      coverage: {
        options: {
          specs: "test/specs/*.spec.js",
          outfile: "test/jasmine/_SpecRunner.html",
          template: require("grunt-template-jasmine-istanbul"),
          templateOptions: {
              coverage: "test/jasmine/coverage/coverage.json",
              report: "test/jasmine/coverage",
              thresholds: {
                  lines: 75,
                  statements: 75,
                  branches: 75,
                  functions: 90
              }
          }
        },
        src: "src/js/*.js"
      }
    },
    jscs: {
      options: {
        config: ".jscsrc"
      },
      files: {
        src: ["src/js/*.js"]
      }
    },
    uglify: {
      minified: {
        options: {
          sourceMaps: true,
          sourceMapName: "dist/hermes.min.js.map"
        },
        files: {
          "dist/hermes.min.js" : ["src/js/*.js"]
        }
      },
      compressed: {
        options: {
          mangle: false,
        },
        files: {
          "dist/hermes.comp.js" : ["src/js/*.js"]
        }
      },
      beautified: {
        options: {
          beautify: true
        },
        files: {
          "dist/hermes.js" : ["src/js/*.js"]
        }
      }
    }
  });

  require("load-grunt-tasks")(grunt);

  grunt.registerTask("test", ["jshint", "jscs", "jasmine"]);

};