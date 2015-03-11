angular.module('EvalApp').controller('HomeController',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();
	$scope.courses = [];

	
	if(token !== undefined) {
		console.log(token);

		MyResource.courses(token)
		.success(function (response) {
			console.log(response);
			$scope.courses = response;
			toastr.success("Fetched courses");

		})
		.error(function () {
			toastr.error("Something went wrong");
		});
	} else {
		toastr.error("Token undefined");
	}
});