angular.module("EvalApp").factory("MyResource", 
['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var config = '';
	
	return {
		init: function (_token) {
			var token = 'Basic ' + _token;
			config = {headers:{'Authorization': token}};
		},
		courses: function () { 
			return $http.get(SERVER_URL + 'my/courses', config); 
		},
		evaluations: function () { 
			return $http.get(SERVER_URL + 'my/evaluations', config); 
		}		
	};
}]);