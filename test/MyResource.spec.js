describe('MyResource', function () {
	// this tests the logic of the factory MyResource
	var $httpBackend, factory;
	var SERVER_URL = 'http://dispatch.ru.is/h22/api/v1/';

	beforeEach(function () {
		module('EvalApp');

		inject(function ($injector) {
			factory = $injector.get('MyResource');
			$httpBackend = $injector.get('$httpBackend');
		});
	});

	afterEach(function () {
		$httpBackend.flush();
		$httpBackend.verifyNoOutstandingRequest();
		$httpBackend.verifyNoOutstandingExpectation();
	});

	it('should call my/courses with correct token when courses is called', function () {
		factory.init('t0k3n');
		factory.courses();
		$httpBackend.expectGET(SERVER_URL + 'my/courses',
		{ 'Authorization': 'Basic t0k3n', 
		  'Accept': 'application/json, text/plain, */*'})
		.respond(200, []);
	});

	it('should call my/evaluations with correct token when evaluations is called', function () {
		factory.init('sirTokeAlot');
		factory.evaluations();
		$httpBackend.expectGET(SERVER_URL + 'my/evaluations',
		{ 'Authorization': 'Basic sirTokeAlot',
	 	  'Accept' : 'application/json, text/plain, */*'})
		.respond(200, []);
	});

});