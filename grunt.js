
module.exports = function ( grunt ) {
  var path = 'lightplayer/media/lightplayer',
      url = 'http://localhost:8088/media/lightplayer/tests/runner.html';

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
    
    imagescopy: {
      src: path+'/imgs',
      dest: path+'/build'
    },
    server: {
      port: 8088,
      base: './lightplayer'
    }
  });

  grunt.loadNpmTasks('grunt-css');

  grunt.registerTask('ci', 'testem');
  /* Aliased just for readability purposes on "build" task */
  grunt.registerTask('jsmin', 'min');
  grunt.registerTask('jslint', 'lint');
  grunt.registerTask('build', 'testem jslint concat jsmin cssmin imagescopy');
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
