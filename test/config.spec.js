var expect = require('chai').expect;

var subject = require('../src/config');

describe('config', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});
