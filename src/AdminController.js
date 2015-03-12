angular.module('EvalApp').controller('AdminController', 
['$scope', 'LoginResource', 'MyResource', '$location',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();
}]);