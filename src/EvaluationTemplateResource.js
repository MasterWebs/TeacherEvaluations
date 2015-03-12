angular.module('EvalApp').factory('EvaluationTemplateResource', 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {


	return {
		getTemplates: function () {
			
		},
		getTemplate: function (id) {

		},
		create: function (template) {
			return $http.post(SERVER_URL + 'evaluationtemplates', template);
		}

	};
}]);