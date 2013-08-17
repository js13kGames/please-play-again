module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bytesize: {
			dist: {
				src: ['<%= pkg.name %>.zip']
			}
		},
		clean: ["optimized.js", '<%= pkg.name %>.zip'],
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
		},
		zip: {
			dist: {
				src: ['main.js', 'index.html'],
				dest: '<%= pkg.name %>.zip'
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-bytesize');
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask('default', ['jshint', 'requirejs', 'zip', 'bytesize']);
};
