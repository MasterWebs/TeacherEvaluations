describe('StudentController', function () {
	// this tests the logic of the StudentController

	var $controller, $scope;

	var mockLoginResource = {
		getUser: function (user) { },
		getToken: function (token) { }
	};

	var mockMyResource = {
		definedToken: false,

		init: function (token) {
			if (token !== '') {
				this.definedToken = true;
			}
		},

		courses: function () {
			return {
				success: function (fn) {
					// fn() if success
					if (this.definedToken) {
						var response = [
							'Styrikerfi',
							'Vefforritun',
							'Gervigreind'
						];
						fn(response);
					}
					return {
						error: function (errorFn) {
							// errorFn() if error
							if (!this.definedToken) {
								errorFn();
							}
						}
					};
				}
			};
		},

		evaluations: function () {
			return {
				success: function (fn) {
					// fn() if success
					if (this.definedToken) {
						var response = [
							{ ID: 1,
							  CourseID: 1,
							  CourseName: 'Vefforritun',
							  CourseNameEN: 'Web Programming',
							  SemesterID: 1 },
							{ ID: 2,
							  CourseID: 2,
							  CourseName: 'Styrikerfi',
							  CourseNameEN: 'Operating Systems',
							  SemesterID: 1 }
						];
						fn(response);
					}
					return {
						error: function (errorFn) {
							// errorFn() if error
							if (!this.definedToken) {
								errorFn();
							}
						}
					};
				}
			};
		}
	};

	var mockLocation = {
		path: function (location) { }
	};

	beforeEach(function () {
		module('EvalApp');

		inject(function (_$controller_) {
			$controller = _$controller_;
		});
	});

	describe('when the token is undefined', function () {
		beforeEach(function () {
			$scope = { };

			spyOn(mockLoginResource, 'getUser');
			spyOn(mockLoginResource, 'getToken');
			spyOn(mockLocation, 'path');
			spyOn(mockMyResource, 'init');
			spyOn(mockMyResource, 'courses').and.callThrough();
			spyOn(mockMyResource, 'evaluations').and.callThrough();
			spyOn(toastr, 'error');
			spyOn(toastr, 'success');

			$scope.token = '';

			$controller = $controller('StudentController',
				{ $scope:        $scope,
				  LoginResource: mockLoginResource,
				  MyResource:    mockMyResource,
				  $location:     mockLocation });
		});

		it('should get token and from LoginResource', function () {
			expect(mockLoginResource.getToken).toHaveBeenCalled();
			expect(mockLoginResource.getUser).toHaveBeenCalled();
		});

		/* it('should alert with toastr if token is undefined', function () {
			expect(toastr.error).toHaveBeenCalledWith('Token undefined');
		}); */
	});

	/* describe('when toastr is defined', function () {

		it('should call init with token if token is defined', function () {
			$scope.token = 't0k3n';
			expect(mockMyResource.init).toHaveBeenCalled();
		});

		it('should call courses if token is defined', function () {
			expect(mockMyResource.courses).toHaveBeenCalled();
		});

		it('should call evaluations if token is defined', function () {
			expect(mockMyResource.evaluations).toHaveBeenCalled();
		});
	}); */
});