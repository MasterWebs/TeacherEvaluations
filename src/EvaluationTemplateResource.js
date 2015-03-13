angular.module('EvalApp').factory('EvaluationTemplateResource', 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var config = '';

	return {
		init: function (_token) {	//initializes the config
			var token = 'Basic ' + _token; 
			config = {headers: {'Authorization': token}};
		},
		getTemplates: function () {	// returns a list of all evaluation templates
			return $http.get(SERVER_URL + 'evaluationtemplates', config);
		},
		getTemplate: function (id) {	//returns specific evaluation template

		},
		create: function (template) {	//creates a new evaluation template
			return $http.post(SERVER_URL + 'evaluationtemplates', template, config);
		}

	};
}]);