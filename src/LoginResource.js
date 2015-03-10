angular.module("EvalApp").factory("LoginResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var currentUser;
	var token;

	return {
		login: function (user, pass) {
			var loginObj = {
				user: user,
				pass: pass
			};
			console.log('loginObj' + loginObj);
			$http.post(SERVER_URL + 'login', loginObj)
			.success(function (response) {
				console.log('login success, data:' + response);
			})
			.error(function () {
				console.log('login unsuccessful');
			});
		},
		logout: function () {  },
		isLoggedIn: function () {  },
		currentUser: function () { return currentUser; },
		getToken: function () { return token; }
	};
}]);