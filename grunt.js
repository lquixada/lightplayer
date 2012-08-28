
module.exports = function ( grunt ) {
    var path = 'lightplayer/media/lightplayer';

    grunt.initConfig({
      concat: {
        dist: {
          src: [path+'/src/*.js'],
          dest: path+'/src.js'
        }
      },

      lint: {
        files: [path+'/src/*.js']
      },

      min: {
        dist: {
          src: [path+'/src/*.js'],
          dest: path+'/min.js'
        }
      },

      server: {
        debug: true,
        port: 8088,
        base: './lightplayer'
      }
    });

  grunt.registerTask('build', 'lint concat min');

  grunt.registerTask('test', 'server');

  grunt.registerTask('phantom', function () {
    var url = 'http://localhost:8088/media/lightplayer/runner.html',
        done = this.async();

    grunt.utils.spawn( { cmd : 'phantomjs', args: ['./scripts/jasmine.js', url] }, function (e,result,code) {
        grunt.log.writeln( e );
        grunt.log.writeln( result );
        
        if ( code ) {
            grunt.warn("erro", code);
        }

        done();
    });
  });

  grunt.registerTask('browser', function () {
    var url = 'http://localhost:8088/media/lightplayer/runner.html';

    this.async();

    grunt.utils.spawn( { cmd : 'open', args: [ url ] }, function () {});
  });
};
