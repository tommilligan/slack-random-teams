var expect = require('chai').expect;

var subject = require('../../src/services/storage');

describe('services/storage', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});
