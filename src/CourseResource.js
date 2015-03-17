angular.module('EvalApp').factory('CourseResource', 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var config = '';
	var course = {};
	var evaluation = {};

	return {
		init: function (_token, course) {
			var token = 'Basic ' + _token;
			config = {headers:{'Authorization': token}};
		},
		getTeachers: function (course, semester) {
			return $http.get(SERVER_URL + 'courses/' + course + '/' + semester + '/teachers', config);
		},
		getEvaluation: function (course, semester, evalID) {
			return $http.get(SERVER_URL + 'courses/' + course + '/' + semester + '/evaluations/' + evalID, config);
		},
		saveEvaluation: function (course, semester, evalID, evaluation) {
			return $http.post(SERVER_URL + 'courses/' + course + '/' + semester + '/evaluations/' + evalID, config, evaluation);
		},
		getThisCourse: function () {
			return course;
		},
		setThisCourse: function (_course) {
			course = _course;
		},
		setEvaluation: function (_evaluation) {
			evaluation = _evaluation;
		},
		getThisEvaluation: function () {
			return evaluation;
		}

	};
}]);