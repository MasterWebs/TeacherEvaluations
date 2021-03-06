module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');

	var taskConfig = {
		concat: {
			options: {
				separator: '\n\n'
			},
			dist: {
				src: ['src/EvalApp.js', 'src/*.js'],
				dest: 'dist/app.js'
			}
		},
		uglify: {
			my_target: {
				files: {
					'dist/app.min.js': ['dist/app.js']
				}
			}
		},
		jshint: {
			// run jshint on all files in src and test
			src: [ 'src/*.js', 'test/*.js'],
			gruntfile: ['Gruntfile.js'],
			options: {
				curly: 	true,
				immed: 	true,
				newcap: true,
				noarg: 	true,
				sub: 	true,
				boss: 	true,
				eqnull: true,
				node: 	true,
				undef:  true,
				globals: {
					_: 		 	false,
					jQuery:  	false,
					angular: 	false,
					moment:  	false,
					console: 	false,
					$: 		 	false,
					toastr:   	false,
					// globals for unit testing
					beforeEach: false,
					afterEach: 	false,
					spyOn: 		false,
					it:  		false,
					expect: 	false,
					describe: 	false,
					inject: 	false
				} 
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				backGround: true,
				singleRun: true
			}
		}
	};
	grunt.initConfig(taskConfig);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};