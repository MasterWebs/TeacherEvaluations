angular.module('EvalApp').controller('AdminController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource) {
	$scope.user = LoginResource.getUser();
	$scope.token = LoginResource.getToken();
	$scope.role = LoginResource.getRole();
	$scope.evaluationTemplates = [];
	
	if($scope.role !== 'admin') {
		$location.path('/login');
	} else {
	
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
			} else if (route === 'evaluation') {
				$location.path('create-evaluation');
			}
		};

		$scope.getTemplate = function (template) {
			EvaluationTemplateResource.getTemplate(template.ID)
			.success(function (response) {
				EvaluationTemplateResource.setTemplate(response);
				$location.path('/template/' + response.ID);

			})
			.error(function () {
				toastr.error("Could not fetch template");
			});
		};

	}
}]);