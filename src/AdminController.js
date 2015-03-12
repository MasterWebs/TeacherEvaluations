angular.module('EvalApp').controller('AdminController', 
['$scope', 'LoginResource', 'MyResource', '$location',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();


	$scope.redirect = function (route) {
		if (route === 'create') {
			$location.path('/create-template');
		}
	};
}]);