
module.exports = function ( grunt ) {
    var path = 'lightplayer/media/lightplayer';

    grunt.initConfig({
      concat: {
        dist: {
          src: [path+'/js/*.js'],
          dest: path+'/build/src.js'
        },

        css: {
          src: [path+'/css/*.css'],
          dest: path+'/build/src.css'
        }
      },

      lint: {
        files: [path+'/js/*.js']
      },

      csslint: {
        dist: {
          src: path+'/css/*.css',
          rules: {
            "import": false,
            "overqualified-elements": false,
            "star-property-hack": false,
            "box-model": false,
            "adjoining-classes": false
          }
        }
      },

      min: {
        dist: {
          src: [path+'/build/src.js'],
          dest: path+'/build/min.js'
        }
      },

      cssmin: {
        dist: {
          src: [path+'/build/src.css'],
          dest: path+'/build/min.css'
        }
      },

      server: {
        debug: true,
        port: 8088,
        base: './lightplayer'
      }
    });

  grunt.loadNpmTasks('grunt-css');

  /* Aliased just for readability purposes on "build" task */
  grunt.registerTask('jsmin', 'min');
  grunt.registerTask('jslint', 'lint');
  /* Still testing the csslint workflow */
  grunt.registerTask('build', 'jasmine jslint concat jsmin cssmin');
  grunt.registerTask('jasmine', 'jasmine-phantom');
  grunt.registerTask('jasmine-phantom', 'server phantom');
  grunt.registerTask('jasmine-browser', 'server browser');

  grunt.registerTask('phantom', 'Run Jasmine tests on phantomjs. Usage: grunt jasmine-phantom', function () {
    var phantom,
        url = 'http://localhost:8088/media/lightplayer/tests/runner.html',
        done = this.async();

    grunt.utils.spawn( { cmd : 'phantomjs', args: ['./scripts/jasmine.js', url] }, function ( err, result, code ) {
        grunt.log.writeln( result.stdout );
        
        done( code>0? false: true );
    });
  });

  grunt.registerTask('browser', 'Run Jasmine tests on default browser. Usage: grunt jasmine-browser', function () {
    var url = 'http://localhost:8088/media/lightplayer/tests/runner.html';

    this.async();

    grunt.utils.spawn( { cmd : 'open', args: [ url ] }, function ( err, result, code ) {
        grunt.log.writeln( 'Opening browser to run the test suite.' );
        
        if ( code ) {
            grunt.warn( 'erro', code );
        }
    });
  });

};
