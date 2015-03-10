module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	var taskConfig = {
		jshint: {
			// run jshint on all files in js folder
			src: [ 'src/*.js' ],
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
					$: 		 	false
				} 
			}
	};
	grunt.initConfig(taskConfig);
	grunt.registerTask('default', ['jshint']);
};