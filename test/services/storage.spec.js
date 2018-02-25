var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
// Chai as promised should be applied last
chai.use(chaiAsPromised);
var expect = chai.expect;

var subject = require('../../src/services/storage');

describe('services/storage', function() {
  describe('serialize', function() {
    it('save to db', function() {
      var user = {
        team_id: 'save_to_db_once',
        access_token: 'spam'
      };
      return expect(subject.serializeUser(user)).to.be.fulfilled;
    });
  });

  describe('deserialize', function() {
    it('load nonexisting', function() {
      var team_id = 'does_not_exist';
      return expect(subject.deserializeUser(team_id)).to.be.rejected;
    });
  });

  describe('serde', function() {
    it('save and reload', function() {
      var user = {
        team_id: 'save_and_reload',
        access_token: 'spam'
      };
      var serde = subject.serializeUser(user)
        .then(function() {
          return subject.deserializeUser(user.team_id);
        });
      return expect(serde).to.eventually.containSubset(user);
    });
  });
});
