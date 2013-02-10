module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({
		pkg:'<json:package.json>',
		meta:{
//			banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
//				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
//				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
//				'* Copyright (c) <%= grunt.template.today("yyyy") %> */'
		},
		clean:{
		},
		lint:{
			src:'app**/*.js',
			grunt:['grunt.js']
		},
		watch:{
			files: ['app/**/*'],
			tasks:'lint'
		},
		jshint:{
			options:{
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				unused: true,
				browser: true,
				strict: true,
				jquery: true
			},
			globals:{
				angular:true,
				moment:true,
				console: true,
				define: true,
				require: true
			}
		},
		server: {
			port: 8000,
			base: 'app'
		}
	});

	grunt.registerTask('default', 'lint');

	//Tasks für lokale Entwicklung
	grunt.registerTask('web', 'server watch');
};