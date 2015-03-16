angular.module('EvalApp').controller('StudentEvaluationController',
['$scope', '$location', 'LoginResource',
function ($scope, $location, LoginResource) {
	$scope.role = LoginResource.getRole();




	if($scope.role !== 'student') {
		$location.path('/login');
	}
}]);