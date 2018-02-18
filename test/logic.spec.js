var expect = require('chai').expect;

var subject = require('../src/logic');

describe('parseCommandText', function() {
  it('should split command into word', function() {
    var input = 'foo bar spam';
    var expected = ['foo', 'bar', 'spam'];
    var actual = subject.parseCommandText(input);
    expect(actual).to.deep.equal(expected);
  });
  it('should handle unusual whitespace', function() {
    var input = 'foo  bar\tspam';
    var expected = ['foo', 'bar', 'spam'];
    var actual = subject.parseCommandText(input);
    expect(actual).to.deep.equal(expected);
  });
});

describe('randomlyAssign', function() {
  it('should return an array of (string, array) tuples', function() {
    var actual = subject.randomlyAssign(['foo', 'bar'], ['spam', 'eggs']);
    expect(actual[0][0]).to.be.a('string');
    expect(actual[0][1]).to.be.instanceof(Array);
  });
});
