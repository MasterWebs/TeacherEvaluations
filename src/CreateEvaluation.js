angular.module('EvalApp').controller('CreateEvaluation', 
['$scope', '$location', 'LoginResource',
function ($scope, $location, LoginResource) {
	$scope.role = LoginResource.getRole();
	
	if($scope.role !== 'admin') {
		$location.path('/login');
	}
}]);