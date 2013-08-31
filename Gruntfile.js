module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ["dist/"],
		copy: {
			dist: {
				expand: true,
				dest: 'dist/',
				src: '*.ogg'
			}
		},
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
		compress: {
			dist: {
				options: {
					archive: 'dist/<%= pkg.name %>.zip',
					mode: "zip",
					pretty: true,
					level: 9,
				},
				files: [
					{
						cwd: 'dist',
						src:['*.js', '*.html', '*.ogg']
					}
				]
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['copy', 'htmlmin', 'jshint', 'uglify', 'compress']);
};
