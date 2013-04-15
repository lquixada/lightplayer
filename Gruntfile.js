module.exports = function (grunt) {
	grunt.initConfig({
		projectName: 'lightplayer',

		jasmine: {
			pivotal: {
				src: 'js/**/*.src.js',
				options: {
					styles: ['style/**/*.src.css'],
					vendor: [
						'vendor/o.src.js',
						'vendor/litemq.min.js',
						'vendor/jquery-1.4.3.min.js',
						'vendor/api.min.js'
					],
					helpers: 'spec/helpers/buttons.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-o-bundle');
};
