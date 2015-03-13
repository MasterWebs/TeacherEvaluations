angular.module('EvalApp').controller('AdminController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource) {
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


}]);