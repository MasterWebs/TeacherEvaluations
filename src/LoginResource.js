angular.module("EvalApp").factory("LoginResource", function () {
	var currentUser;
	var token;

	return {
		login: function (user, pass) {  },
		logout: function () {  },
		isLoggedIn: function () {  },
		currentUser: function () { return currentUser; },
		getToken: function () { return token; }
	};
});