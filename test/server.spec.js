var expect = require('chai').expect;

var subject = require('../src/server');

describe('server', function() {
  it('should export an app', function() {
    expect(subject).to.be.instanceof(Object);
  });
});