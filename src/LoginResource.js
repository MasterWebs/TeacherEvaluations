angular.module("EvalApp").factory("LoginResource", ['$http', 'SERVER_URL',
function ($http, SERVER_URL) {
	var user;
	var token;
	var role;

	return {
		login: function (user, pass) {
			var loginObj = {
				user: user,
				pass: pass
			};
			console.log('loginObj: ' + JSON.stringify(loginObj));
			$http.post(SERVER_URL + 'login', loginObj)
			.success(function (response) {
				token = response.Token;
				user = response.Username;
				role = response.Role;
				return 1;  // return success code (1)
			})
			.error(function () {
				console.log('login unsuccessful');
				return -1; // return error code (-1)
			});
		},
		logout: function () {  },
		isLoggedIn: function () {  },
		currentUser: function () { return user; },
		getToken: function ()    { return token; },
		getRole: function ()     { return role; }
	};
}]);