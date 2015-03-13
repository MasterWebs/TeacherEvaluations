describe('StudentController', function () {
	// this tests the logic of the StudentController
	var scope, createController;

	var mockLoginResourceWithToken = {
		getUser: function () { return 'user'; },
		getToken: function () { return 't0k3n'; },
		isLoggedIn: function () { return true; }
	};

	var mockLoginResourceNoToken = {
		getUser: function () { return ''; },
		getToken: function () { return ''; },
		isLoggedIn: function () { return false; }
	};

	var mockMyResource = {
		init: function (token) { },

		courses: function () {
			return {
				success: function (fn) {
					// fn() if success
					var response = [
						'Styrikerfi',
						'Vefforritun',
						'Gervigreind'
					];
					fn(response);
					return {
						error: function (errorFn) {
							// errorFn() if error
								// errorFn();
						}
					};
				}
			};
		},

		evaluations: function () {
			return {
				success: function (fn) {
					// fn() if success
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
					return {
						error: function (errorFn) {
							// errorFn() if error
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

		inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();

			createController = function (isToken) {
				var mockLogin;
				if (isToken) {
					mockLogin = mockLoginResourceWithToken;
				} else {
					mockLogin = mockLoginResourceNoToken;
				}
		
				return $controller('StudentController',
					{ $scope: 		 scope,
					  LoginResource: mockLogin,
					  MyResource: 	 mockMyResource,
					  $location: 	 mockLocation});
			};
		});

		spyOn(mockLoginResourceWithToken, 'getUser');
		spyOn(mockLoginResourceWithToken, 'getToken');
		spyOn(mockLoginResourceNoToken, 'getUser');
		spyOn(mockLoginResourceNoToken, 'getToken');
		spyOn(mockLocation, 'path');
		spyOn(mockMyResource, 'init');
		spyOn(mockMyResource, 'courses').and.callThrough();
		spyOn(mockMyResource, 'evaluations').and.callThrough();
		spyOn(toastr, 'error');
		spyOn(toastr, 'success');
	});

	describe('when the token is undefined', function () {

		it('should not get token from LoginResource', function () {
			var controller = createController(false);
			expect(mockLoginResourceNoToken.getToken).not.toHaveBeenCalled();
			expect(mockLoginResourceNoToken.getUser).not.toHaveBeenCalled();
		});

		it('should alert with toastr if token is undefined', function () {
			var controller = createController(false);
			// expect(scope.token).toEqual('');
			expect(toastr.error).toHaveBeenCalledWith('No user logged in!');
		});
	});

	describe('when the token is defined', function () {

		it('should call init with token if token is defined', function () {
			var controller = createController(true);
			expect(mockMyResource.init).toHaveBeenCalledWith(scope.token);
		});

		it('should call courses if token is defined', function () {
			var controller = createController(true);
			expect(mockMyResource.courses).toHaveBeenCalled();
			expect(scope.myCourses.length).toEqual(3);
			expect(toastr.success).toHaveBeenCalledWith('Fetched courses');
		});

		it('should call evaluations if token is defined', function () {
			var controller = createController(true);
			expect(mockMyResource.evaluations).toHaveBeenCalled();
			expect(scope.myEvaluations.length).toEqual(2);
			expect(toastr.success).toHaveBeenCalledWith('Fetched evaluations');
		});
	});
});