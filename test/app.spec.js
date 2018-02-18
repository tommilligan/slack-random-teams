var expect = require('chai').expect;

var subject = require('../src/app');

describe('app', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});
