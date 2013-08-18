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
		uglify: {
			dist: {
				files: {
					'optimized.js': 'main.js'
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bytesize');
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask('default', ['jshint', 'uglify', 'zip', 'bytesize']);
};
