angular.module('EvalApp').controller('AdminController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource) {
	$scope.user = LoginResource.getUser();
	$scope.token = LoginResource.getToken();
	$scope.evaluationTemplates = [];

	EvaluationTemplateResource.init($scope.token);

	EvaluationTemplateResource.getTemplates()
	.success(function (response) {
		toastr.success("Fetched all templates");
		$scope.evaluationTemplates = response;
	})
	.error(function () {
		toastr.error("Could not fetch all evaluation templates");
	});

	$scope.redirect = function (route) {
		if (route === 'create') {
			$location.path('/create-template');
		}
	};

	$scope.getTemplate = function (template) {
		EvaluationTemplateResource.getTemplate(template.ID)
		.success(function (response) {
			EvaluationTemplateResource.setTemplate(response);
			$location.path('/template/' + response.ID);
			//TODO Send to factory or route params


		})
		.error(function () {
			toastr.error("Could not fetch template");
		});
	};


}]);