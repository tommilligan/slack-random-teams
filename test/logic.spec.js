var expect = require('chai').expect;

var subject = require('../src/logic');

describe('logic', function() {
  it('pass', function() {
    expect(subject).to.be.a('object');
  });
});
