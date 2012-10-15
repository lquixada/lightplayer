
module.exports = function ( grunt ) {

  grunt.initConfig({
    concat: {
      dist: {
        src: ['js/*.js'],
        dest: 'build/src.js'
      },

      css: {
        src: ['css/*.css'],
        dest: 'build/src.css'
      }
    },

    lint: {
      files: ['js/*.js']
    },

    csslint: {
      dist: {
        src: 'css/*.css',
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
        src: ['build/src.js'],
        dest: 'build/min.js'
      }
    },

    cssmin: {
      dist: {
        src: ['build/src.css'],
        dest: 'build/min.css'
      }
    },
    
    imagescopy: {
      src: 'imgs',
      dest: 'build'
    },
    server: {
      port: 8088,
      base: '.'
    }
  });

  grunt.loadNpmTasks('grunt-css');

  /* Aliased just for readability purposes on "build" task */
  grunt.registerTask('build', 'testem jslint concat jsmin cssmin imagescopy');
  grunt.registerTask('ci', 'testem');
  grunt.registerTask('jsmin', 'min');
  grunt.registerTask('jslint', 'lint');
  grunt.registerTask('jasmine:browser', 'server browser');

  grunt.registerTask('imagescopy', 'Copy images to the build/', function () {
      var done = this.async(),
          src = grunt.config('imagescopy.src'),
          dest = grunt.config('imagescopy.dest');

      grunt.utils.spawn( { cmd: 'cp', args: ['-R', src, dest] }, function ( err, result, code ) {
          if ( result.stderr ) {
              grunt.log.writeln( '\n'+result.stderr+'\n' );
          } else {
              grunt.log.writeln( 'Image files copied on "'+dest+'/".' );
          }
          
          done( code>0? false: true );
      } );
  } );

  grunt.registerTask('testem', 'Run testem on command line using phantomjs.', function () {
    var done = this.async();

    grunt.utils.spawn( { cmd: 'testem', args: [ 'ci', '--launch', 'phantomjs' ] }, function ( err, result, code ) {
        grunt.log.writeln( result.stdout );

        if ( result.stdout.search(/# ok/) > -1 ) {
            done( true );
        } else {
            done( false );
        }
    } );
  });

  grunt.registerTask('browser', 'Run Jasmine tests on default browser. Usage: grunt jasmine-browser', function () {
    var url = 'http://localhost:8088/specs/runner.html';

    this.requires( 'server' );

    this.async();

    grunt.utils.spawn( { cmd: 'open', args: [ url ] }, function ( err, result, code ) {
      grunt.log.writeln( 'Opening browser to run the test suite.' );
      
      if ( code ) {
        grunt.warn( 'erro', code );
      }
    });
  });
};
