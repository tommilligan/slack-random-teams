var expect = require('chai').expect;

var subject = require('../../src/services/slack');

describe('services/slack', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});
