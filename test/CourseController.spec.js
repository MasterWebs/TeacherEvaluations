describe('CourseController', function () {
	var scope, controller, createController;

	var mockLoginResource = {
		getRole: function () { return 'student'; }
	};

	var mockLoginResourceNoToken = {
		getRole: function () { return ''; }
	};

	var mockCourseResource = {
		getThisCourse: function () {
			return { CourseID: 1 };
		},
		getTeachers: function () {
			return {
				success: function (fn) {
					fn([]);
					return {
						error: function (errorFn) { }
					};
				}
			};
		}
	};

	var mockCourseResourceError = {
		getThisCourse: function () {
			return { CourseID: 1 };
		},
		getTeachers: function () {
			return {
				success: function (fn) {
					return {
						error: function (errorFn) {
							errorFn();
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

			createController = function (isToken, isError) {
				var mockLogin;
				var mockCourse;

				if (isToken) {
					mockLogin = mockLoginResource;
				} else {
					mockLogin = mockLoginResourceNoToken;
				}

				if (isError) {
					mockCourse = mockCourseResourceError;
				} else {
					mockCourse = mockCourseResource;
				}
		
				return $controller('CourseController',
					{ $scope: 		  scope,
					  $location:      mockLocation,
					  CourseResource: mockCourse,
					  LoginResource:  mockLogin });
			};
		});

		spyOn(mockLoginResource, 'getRole').and.callThrough();
		spyOn(mockLoginResourceNoToken, 'getRole').and.callThrough();
		spyOn(mockCourseResource, 'getThisCourse').and.callThrough();
		spyOn(mockCourseResource, 'getTeachers').and.callThrough();
		spyOn(mockCourseResourceError, 'getThisCourse').and.callThrough();
		spyOn(mockCourseResourceError, 'getTeachers').and.callThrough();
		spyOn(mockLocation, 'path');
		spyOn(toastr, 'error');
	});

	describe('when the user is not logged in', function () {
		beforeEach(function () {
			controller = createController(false, false);
		});

		it('should call LoginResource for user role', function () {
			expect(mockLoginResourceNoToken.getRole).toHaveBeenCalled();
		});

		it('should alert user that he is not a student, and redirect him to login', function () {
			expect(toastr.error).toHaveBeenCalledWith('You are not a student');
			expect(mockLocation.path).toHaveBeenCalledWith('/login');
		});
	});

	describe('when the user is logged in', function () {
		describe('when CourseResource returns success', function () {
			beforeEach(function () {
				controller = createController(true, false);
			});

			it('should get current course from CourseResource', function () {
				expect(mockCourseResource.getThisCourse).toHaveBeenCalled();
			});

			it('should get teachers from CourseResource and assign scope.teachers as response', function () {
				expect(mockCourseResource.getTeachers).toHaveBeenCalledWith(1, '1');
				expect(scope.teachers).toEqual([]);
			});
		});

		describe('when CourseResource returns error', function () {
			beforeEach(function () {
				controller = createController(true, true);
			});

			it('should alert user with toastr', function () {
				expect(toastr.error).toHaveBeenCalledWith('Could not get teachers');
			});
		});
	});
});