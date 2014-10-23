module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['build']
		},
		handlebars: {
			compile: {
				options: {
					namespace: 'JST',
					processName: function(filePath) {
						return filePath.split('/').pop().replace(/\.hbs$/, '');
					}
				},

				files: {
					'build/js/templates.js': (function getTemplate(files) {
						return ['templates/index/index.hbs', 'components/**/*.hbs'];
					})()

				}
			}
		},
		jasmine: {
			pivotal: {
				src: 'model/*.js',
				options: {
					helpers: 'lib/jquery-1.11.1.min.js',
					specs: 'Test/*.js'
				}
			}
		},
		concat: {
			'build/sass/index.scss': ['sass/color.scss', 'templates/index/index.scss', 'components/**/*.scss'], //order importent
			'build/js/index.js': ['model/*.js', 'controller/*.js'],
			'build/js/templates.js': ['build/js/templates.js', 'components/**/*.js']
		},
		uglify: {
			my_target: {
				files: {
					'build/js/index.min.js': ['build/js/templates.js', 'build/js/index.js']
				}
			}
		},
		sass: { // Task
			dist: { // Target
				options: { // Target options
					style: 'expanded'
				},
				files: {
					'build/style/index.css': 'build/sass/index.scss'
				}
			}
		},
		watch: {
			stylesheets: {
				files: ['sass/color.scss', 'templates/index/index.scss', 'components/**/*.scss'],
				tasks: ['concat', 'sass']
			},
			template: {
				files: ['templates/index/index.hbs', 'components/**/*.hbs'],
				tasks: ['handlebars', 'concat']
			},
			js: {
				files: ['model/*.js', 'controller/*.js', 'components/**/*.js'],
				tasks: ['concat', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['clean', 'handlebars', 'jasmine', 'concat', 'uglify', 'sass', 'watch']);
};