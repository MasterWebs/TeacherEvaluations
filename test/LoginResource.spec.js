describe('LoginResource', function () {
	// this tests the logic of the factory LoginResource
	var $httpBackend, factory;
	var LOGIN_URL = 'http://dispatch.ru.is/h22/api/v1/login';

	beforeEach(function() {
		module('EvalApp');

		inject(function ($injector) {
			factory = $injector.get('LoginResource');
		});
	});

	it('isLoggedIn should return false for empty username', function () {
		expect(factory.isLoggedIn()).toEqual(false);
	});

	it('isLoggedIn should return true for non-empty username', function () {
		factory.setUser('user');
		expect(factory.isLoggedIn()).toEqual(true);
	});

	it('should return correct user', function () {
		factory.setUser('user');
		expect(factory.getUser()).toEqual('user');
	});

	it('should return correct token', function () {
		factory.setToken('token');
		expect(factory.getToken()).toEqual('token');
	});

	it('should return correct role', function () {
		factory.setRole('student');
		expect(factory.getRole()).toEqual('student');
	});

	describe('login', function () {
		beforeEach(inject(function ($injector) {
			$httpBackend = $injector.get('$httpBackend');
		}));

		afterEach(function () {
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();
		});

		it('should send login request to server', function()  {
			factory.login('user', 'pass');
			$httpBackend.expectPOST(LOGIN_URL, {user: 'user', pass: 'pass'})
			.respond(200, {});
		});
	});
});