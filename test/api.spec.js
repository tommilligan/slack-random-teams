var expect = require('chai').expect;

var subject = require('../src/api');

describe('api', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});
