angular.module('EvalApp').controller('AdminController', 
['$scope', '$location', 'LoginResource', 'EvaluationTemplateResource', 'EvaluationResource',
function ($scope, $location, LoginResource, EvaluationTemplateResource, EvaluationResource) {
	$scope.user = LoginResource.getUser();
	$scope.token = LoginResource.getToken();
	$scope.role = LoginResource.getRole();
	$scope.evaluationTemplates = [];
	$scope.evaluations = [];
	
	if($scope.role !== 'admin') {
		$location.path('/login');
	} else {
	
		EvaluationTemplateResource.init($scope.token);
		EvaluationResource.init($scope.token);

		EvaluationResource.getEvaluations()
		.success(function (response) {
			$scope.evaluations = response;
		})
		.error( function () {
			toastr.error("Could not fetch evaluations");
		});

		EvaluationTemplateResource.getTemplates()
		.success(function (response) {
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

		$scope.getEvaluation = function (evaluation) {
			console.log(evaluation.ID);
			EvaluationResource.setEvaluation(evaluation);

			$location.path('evaluation/' + evaluation.ID);
		};

	}
}]);