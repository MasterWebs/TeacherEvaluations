angule.module('EvalApp').factory('EvaluationTemplateResource', 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {


	return {
		getTemplates: function () {
			return $http.get(SERVER_URL)
		},
		getTemplate: function (id) {

		},
		createTemplate: function (template) {

		}

	};
}]);