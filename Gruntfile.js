module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bytesize: {
			dist: {
				src: ['dist/<%= pkg.name %>.zip']
			}
		},
		clean: ["dist/"],
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhiteSpace: true,
					removeAttributeQuotes: true,
				},
				files: {
					'dist/index.html': 'index.html'
				}
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'main.js'],
			options: {
				browser: true
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/main.js': 'main.js'
				}
			}
		},
		zip: {
			dist: {
				cwd: 'dist/',
				src: ['dist/main.js', 'dist/index.html'],
				dest: 'dist/<%= pkg.name %>.zip'
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bytesize');
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask('default', ['htmlmin', 'jshint', 'uglify', 'zip', 'bytesize']);
};
