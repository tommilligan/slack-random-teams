var expect = require('chai').expect;

var subject = require('../src/responses');

var url = 'http://spam';
var body = {foo: 'bar'};
var options = {
  method: 'POST',
  uri: url,
  body: body,
  json: true
};

describe('response', function() {
  it('should return a simple requests config', function() {
    var actual = subject.response(url, body);
    expect(actual).to.deep.equal(options);
  });
});

describe('delayedResponder', function() {
  it('should return a function', function() {
    var actual = subject.delayedResponder(url);
    expect(actual).to.be.a('function');
  });
  it('returned function generate responses ', function() {
    var delayedResponse = subject.delayedResponder(url);
    var actual = delayedResponse(body);
    expect(actual).to.deep.equal(options);
  });
});
