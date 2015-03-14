angular.model('EvalApp').factory('CourseResource', 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var config = '';

	return {
		init: function (_token) {
			var token = 'Basic ' + _token;
			config = {headers:{'Authorization': token}};
		},
		getTeacher: function (course, semester) {
			return $http.get(SERVER_URL + 'courses/' + course + '/' + semester + '/teachers', config);
		},
		getEvaluation: function (course, semester, evalID) {
			return $http.get(SERVER_URL + 'courses/' + course + '/' + semester + '/evaluations/' + evalID, config);
		},
		saveEvaluation: function (course, semester, evalID, evaluation) {
			return $http.post(SERVER_URL + 'courses/' + course + '/' + semester + '/evaluations/' + evalID, config, evaluation);
		}
	};
}]);