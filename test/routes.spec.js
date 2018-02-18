var expect = require('chai').expect;

var subject = require('../src/routes');

describe('routes', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});
