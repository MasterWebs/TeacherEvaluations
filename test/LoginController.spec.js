describe('LoginController', function () {
	// this only tests the logic of the LoginController
	// if we want to test the logic of the LoginResource then
	// we will have to do that in a separate file
	beforeEach(module('EvalApp'));

	var $controller;

	var mockLoginResource = {
		login: function (user, pass) {
			return {
				success: function (fn) {
					var response = {};
					if (user === 'snaebjorn13' && pass === '123456') {
						response = {
							Token: 'ajfsjsafjab',
							User: {
								Username: 'snaebjorn13',
								Role: 'student'
							}
						};
						fn(response);
					} else if (user === 'admin' && pass === '123456') {
						response = {
							Token: 'jafjsaja',
							User: {
								Username: 'admin',
								Role: 'admin'
							}
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
		},

		setUser: function (user) { },
		setRole: function (pass) { },
		setToken: function (token) { }
	};

	var mockLocation = {
		path: function (location) { }
	};

	beforeEach(inject(function (_$controller_) {
		$controller = _$controller_;
	}));

	describe('$scope.login', function () {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};

			spyOn(mockLoginResource, 'login').and.callThrough();
			spyOn(mockLoginResource, 'setUser');
			spyOn(mockLoginResource, 'setToken');
			spyOn(mockLoginResource, 'setRole');
			spyOn(mockLocation, 'path');
			spyOn(toastr, 'error');
			spyOn(toastr, 'success');

			controller = $controller('LoginController', 
				{ $scope:        $scope,
				  LoginResource: mockLoginResource,
				  $location:     mockLocation  });
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

		it('it should redirect student to student front page, when he logs in', function () {
			$scope.user = 'snaebjorn13';
			$scope.pass = '123456';
			$scope.login();
			expect(mockLoginResource.login).toHaveBeenCalledWith('snaebjorn13', '123456');
			expect(mockLoginResource.setUser).toHaveBeenCalledWith('snaebjorn13');
			expect(mockLoginResource.setToken).toHaveBeenCalled();
			expect(mockLoginResource.setRole).toHaveBeenCalledWith('student');
			expect(toastr.success).toHaveBeenCalled();
			expect(mockLocation.path).toHaveBeenCalledWith('/student');
		});

		it('should redirect admin to admin front page, when he logs in', function () {
			$scope.user = 'admin';
			$scope.pass = '123456';
			$scope.login();
			expect(mockLoginResource.login).toHaveBeenCalledWith('admin', '123456');
			expect(mockLoginResource.setUser).toHaveBeenCalledWith('admin');
			expect(mockLoginResource.setToken).toHaveBeenCalled();
			expect(mockLoginResource.setRole).toHaveBeenCalledWith('admin');
			expect(toastr.success).toHaveBeenCalled();
			expect(mockLocation.path).toHaveBeenCalledWith('/admin');
		});
	});
});