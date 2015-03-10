angular.module("LoginResource", function () {
	var currentUser;
	var token;

	return {
		login: function () {  },
		logout: function () {  },
		isLoggedIn: function () {  },
		currentUser: function () { return currentUser; },
		getToken: function () { return token; }
	};
});