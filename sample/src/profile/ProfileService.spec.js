describe('ProfileService', function() {
	var mockedProfileId = '123abc';

	beforeEach(module('profile'));

	describe('#findOne', function() {
		it('should find a profile by id', function(done) {
			inject(function(ProfileService, $rootScope, $httpBackend) {
				expect(typeof ProfileService.findOne).to.be('function');

				var found = false,
					notFound = false,

					responseProfile = {
						id: mockedProfileId,
						name: 'John Doe',
						email: 'john@doe.com'
					};

				$httpBackend.whenGET('/user/' + mockedProfileId).respond(responseProfile);

				$httpBackend.whenGET(/\/user\/.+/).respond(404);

				ProfileService.findOne(mockedProfileId)
					.then(function(profile) {
						found = true;

						expect(profile).not.to.be(undefined);
						expect(profile.id).to.be(responseProfile.id);
						expect(profile.name).to.be(responseProfile.name);
						expect(profile.email).to.be(responseProfile.email);
					});

				ProfileService.findOne(1)
					.then(null, function(response) {
						expect(response.status).to.be(404);
						notFound = true;
					});

				$rootScope.$digest();
				$httpBackend.flush();
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();

				expect(found && notFound).to.be(true);
				done();
			});
		});
	});

	describe('#update', function() {
		it('should save profile changes', function(done) {
			inject(function(ProfileService, $rootScope, $httpBackend) {
				expect(typeof ProfileService.update).to.be('function');

				var postedProfile = null;

				$httpBackend.whenPOST('/user').respond(function(method, url, payload) {
					var profile = payload ? JSON.parse(payload) : null;
					postedProfile = profile;
					return 200;
				});

				var profile = {
					id: mockedProfileId
				};

				ProfileService.update(profile).then(function(response) {
					expect(response.status).to.be(200);
					expect(postedProfile.id).to.be(profile.id);
				});

				$httpBackend.flush();
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();
				done();
			});
		});
	});
});
