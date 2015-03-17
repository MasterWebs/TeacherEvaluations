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
			console.log(response);
		})
		.error(function () {
			toastr.error("Could not fetch all evaluation templates");
		});

		$scope.createTemplate = function () {
			$location.path('/create-template');
		};

		$scope.getTemplate = function (template) {
			EvaluationTemplateResource.setTemplate(template);
			console.log(template);
			$location.path('/template/' + template.ID);
		};

		$scope.getEvaluation = function (evaluation) {
			EvaluationResource.setEvaluation(evaluation);
			$location.path('evaluation/' + evaluation.ID);
		};
	}
}]);