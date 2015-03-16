angular.module('EvalApp').factory('EvaluationResource', 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var config = '';
	var evaluation = {};

	return {
		init: function (_token) {
			var token = 'Basic ' + _token;
			config = {headers:{'Authorization': token}};
		},
		getEvaluations: function () {
			return $http.get(SERVER_URL + 'evaluations', config);
		},
		getEvaluation: function (id) {
			return $http.get(SERVER_URL + 'evaluations/' + id, config);
		},
		createEvaluation: function (evaluation) {
			return $http.post(SERVER_URL + 'evaluations', evaluation, config);
		},
		setEvaluation: function (_evaluation) {
			evaluation = _evaluation;
		},
		getThisEvaluation: function () {
			return evaluation;
		}
	};
}]);