var expect = require('chai').expect;

var subject = require('../src/middleware');

describe('middleware', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});

