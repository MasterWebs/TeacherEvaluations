angular.module("EvalApp").factory("MyResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {

	return {
		courses: function (token) { return $http.get(toke, SERVER_URL + 'my/courses'); }		

	};
}]);