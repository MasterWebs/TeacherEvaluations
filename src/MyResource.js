angular.module("EvalApp").factory("MyResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var token = '';
	var config = '';
	return {
		init: function (tok) {
			token = 'Basic ' + tok;
			config = {headers:{'Authorization': token}};
		},
		courses: function () { 
			return $http.get(SERVER_URL + 'my/courses', config); }		

	};
}]);