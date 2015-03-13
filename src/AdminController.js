angular.module('EvalApp').controller('AdminController', 
['$scope', 'LoginResource', 'MyResource', '$location',
function ($scope, LoginResource, MyResource, $location, EvaluationTemplateResource) {
	$scope.token = LoginResource.getToken();
	$scope.evaluationTemplates = [];

	if($scope.token === undefined) {
		toastr.error("YOU SHALL NOT PASS");
	}else {
		EvaluationTemplateResource.init($scope.token);
	}

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