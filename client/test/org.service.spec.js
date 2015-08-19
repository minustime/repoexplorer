describe('Org Service', function() {

    var $scope,
        $httpBackend,
        Org,
        json;

    beforeEach(module('app'));

    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _Org_) {
        $scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        Org = _Org_;
    }));

    beforeEach(function() {
        json = {
            org_profile_valid: window.__html__['test/fixtures/org_profile_valid.json']
        };
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('should be registered', function() {
        expect(Org).not.equal(null);
    });

    describe('getProfile()', function() {

        it('should fail if the organization name is not provided', function() {
            Org.getProfile().catch(function(err) {
                expect(err.status).to.equal(0);
            });
            $scope.$apply();
        });

        it('should return a valid organization profile', function() {

            $httpBackend.whenGET('https://api.github.com/orgs/ibm').respond(200, json.org_profile_valid);

            Org.getProfile('ibm').then(function(profile) {
                expect(profile.id).to.exist;
            });

            $httpBackend.flush();
        });

        it('should return 404 if the organization is not found', function() {

            $httpBackend.whenGET('https://api.github.com/orgs/ibmx').respond(404, {});

            Org.getProfile('ibmx').catch(function(err) {
                expect(err.status).to.equal(404);
            });

            $httpBackend.flush();
        });

        it('should return error due to rate limit reached', function() {

            $httpBackend.whenGET('https://api.github.com/orgs/ibmz').respond(403, {});

            Org.getProfile('ibmz').catch(function(err) {
                expect(err.status).to.equal(403);
            });

            $httpBackend.flush();
        });


        it('should return unknown error', function() {

            $httpBackend.whenGET('https://api.github.com/orgs/undefined').respond(0, {});

            Org.getProfile('undefined').catch(function(err) {
                expect(err.status).to.equal(0);
            });

            $httpBackend.flush();
        });

    });
});