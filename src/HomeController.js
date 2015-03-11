angular.module('EvalApp').controller('HomeController',
function ($scope, LoginResource, MyResource, $location) {
	var token = LoginResource.getToken();
	var courses = [];

	
	if(token !== undefined) {
		console.log(token);

		MyResource.courses(token)
		.success(function (response) {
			toastr.success("Fetched courses");

		})
		.error(function () {
			toastr.error("Something went wrong");
		});
	} else {
		toastr.error("Token undefined");
	}
});