module.exports = function(grunt) {
	grunt.initConfig({
		clean: ["optimized.js"],
		jshint: {
			all: ['Gruntfile.js', 'main.js'],
			options: {
				browser: true
			}
		},
		requirejs: {
			compile: {
				options: {
					baeUrl: "./",
					name: "main",
					out: "optimized.js"
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['jshint', 'requirejs']);
};
