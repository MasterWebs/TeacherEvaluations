describe('LoginController', function () {
	// this only tests the logic of the LoginController
	// if we want to test the logic of the LoginResource then
	// we will have to do that in a separate file
	beforeEach(module('EvalApp'));

	var $controller;

	/* var mockLoginResource = {
		login: function (user, pass) {
			return {
				success: function (fn) {
					if (user === 'snaebjorn13' && pass === '123456') {
						var response = {
							Token: 'ajfsjsafjab',
							User: 'snaebjorn13'
						};
						fn(response);
					}
					return {
						error: function (errorFn) {
							if (user !== 'snaebjorn13' && pass === '123456') {
								errorFn();
							}
						}
					};
				}
			};
		}
	}; */

	var mockLoginResource = {
		user: '',
		pass: '',

		login: function (user, pass) {
			this.user = user;
			this.pass = pass;
			console.log(this.user + ' ' + this.pass);
			return this;
		},

		success: function (fn) {
			if (this.user === 'snaebjorn13' && this.pass === '123456') {
				var response = {
					Token: 'ajfsjsafjab',
					User: 'snaebjorn13'
				};
				fn(response);
				return this;
			}
		},

		error: function (errorFn) {
			if (this.user !== 'snaebjorn13' && this.pass !== '123456') {
				errorFn();
				return this;
			}
		}
	};

	beforeEach(inject(function (_$controller_) {
		$controller = _$controller_;
	}));

	describe('$scope.login', function () {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};

			spyOn(mockLoginResource, 'login');
			spyOn(toastr, 'error');
			spyOn(toastr, 'success');

			controller = $controller('LoginController', 
				{ $scope:        $scope,
				  LoginResource: mockLoginResource });
		});

		it('should reject login when username is empty', function () {
			$scope.user = '';
			$scope.pass = '123456';
			$scope.login();
			expect(mockLoginResource.login).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		it('should reject login when password is empty', function () {
			$scope.user = 'snaebjorn13';
			$scope.pass = '';
			$scope.login();
			expect(mockLoginResource.login).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		it('should reject login when both password and username are empty', function () {
			$scope.user = '';
			$scope.pass = '';
			$scope.login();
			expect(mockLoginResource.login).not.toHaveBeenCalled();
			expect(toastr.error).toHaveBeenCalled();
		});

		/*it('should allow login when password and username are non-empty', function () {
			$scope.user = 'snaebjorn13';
			$scope.pass = '123456';
			$scope.login();
			expect(mockLoginResource.login).toHaveBeenCalled();
		});*/
	});
});