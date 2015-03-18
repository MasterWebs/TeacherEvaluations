describe('StudentController', function () {
	// this tests the logic of the StudentController
	var controller, scope, createController;

	var mockLoginResourceWithToken = {
		getUser: function () { return 'user'; },
		getRole: function () { return 'student'; },
		getToken: function () { return 't0k3n'; },
		isLoggedIn: function () { return true; }
	};

	var mockLoginResourceNoToken = {
		getUser: function () { return ''; },
		getRole: function () { return ''; },
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

	var mockMyResourceError = {
		init: function (token) { },

		courses: function () {
			return {
				success: function (fn) {
					// fn() if success
					return {
						error: function (errorFn) {
							// errorFn() if error
								errorFn();
						}
					};
				}
			};
		},

		evaluations: function () {
			return {
				success: function (fn) {
					// fn() if success
					return {
						error: function (errorFn) {
							// errorFn() if error
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

	var mockCourseResource = {
		init: function (token, course) { },
		setEvaluation: function (evalu) { }
	};

	beforeEach(function () {
		module('EvalApp');

		inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();

			createController = function (isToken, isError) {
				var mockLogin;
				var mockMy;

				if (isToken) {
					mockLogin = mockLoginResourceWithToken;
				} else {
					mockLogin = mockLoginResourceNoToken;
				}

				if (isError) {
					mockMy = mockMyResourceError;
				} else {
					mockMy = mockMyResource;
				}
		
				return $controller('StudentController',
					{ $scope: 		  scope,
					  $location:      mockLocation,
					  LoginResource:  mockLogin,
					  MyResource: 	  mockMy,
					  CourseResource: mockCourseResource});
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
		spyOn(mockCourseResource, 'init');
		spyOn(mockCourseResource, 'setEvaluation');
		spyOn(toastr, 'error');
		spyOn(toastr, 'success');
	});

	describe('when the user is not logged in as student', function () {
		it('should alert with toastr and redirect user to login', function () {
			controller = createController(false, false);
			expect(toastr.error).toHaveBeenCalledWith('You are not a student');
			expect(mockLocation.path).toHaveBeenCalledWith('/login');
		});
	});

	describe('when the token is defined', function () {
		beforeEach(function () {
			controller = createController(true, false);
		});

		it('should call init with token if token is defined', function () {
			expect(scope.role).toEqual('student');
			expect(mockMyResource.init).toHaveBeenCalledWith(scope.token);
		});

		it('should call courses if token is defined', function () {
			expect(mockMyResource.courses).toHaveBeenCalled();
			expect(scope.myCourses.length).toEqual(3);
		});

		it('should call evaluations if token is defined', function () {
			expect(mockMyResource.evaluations).toHaveBeenCalled();
			expect(scope.myEvaluations.length).toEqual(2);
		});

		it('should redirect user to correct course', function () {
			var course = {
				ID: 1,
				CourseID: 1,
				Name: 'Vefforritun',
				NameEN: 'Web Programming'
			};
			scope.route(course);
			expect(mockLocation.path).toHaveBeenCalledWith('/course/1');
		});

		it('should redirect user to correct evaluation and set evaluation in CourseResource', function () {
			var evalu = {
				ID: 1,
				CourseID: 1,
				CourseName: 'WEPO',
				Questions: []
			};

			scope.evaluation(evalu);
			expect(mockCourseResource.setEvaluation).toHaveBeenCalledWith(evalu);
			expect(mockLocation.path).toHaveBeenCalledWith('/student-evaluation/1');
		});
	});

	describe('when myResource returns an error', function () {
		it('should alert that courses and evaluations could not be fetched', function () {
			var controller = createController(true, true);
			expect(toastr.error).toHaveBeenCalledWith('Could not fetch your courses');
			expect(toastr.error).toHaveBeenCalledWith('Could not fetch your evaluations');
		});
	});
});