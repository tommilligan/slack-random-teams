var expect = require('chai').expect;

var subject = require('../src/utils');

describe('chunkArray', function() {
  it('should distribute elements', function() {
    var input = [0, 1, 2, 3];
    var actual = subject.chunkArray(input, 2);
    expect(actual).to.deep.equal([[0, 2], [1, 3]]);
  });
  it('should handle unequal sizes rationally', function() {
    var input = [0, 1, 2, 3, 4];
    var actual = subject.chunkArray(input, 3);
    expect(actual).to.deep.equal([[0, 3], [1, 4], [2]]);
  });
});

describe('splitWords', function() {
  it('should split command into word', function() {
    var input = 'foo bar spam';
    var expected = ['foo', 'bar', 'spam'];
    var actual = subject.splitWords(input);
    expect(actual).to.deep.equal(expected);
  });
  it('should handle unusual whitespace', function() {
    var input = 'foo  bar\tspam';
    var expected = ['foo', 'bar', 'spam'];
    var actual = subject.splitWords(input);
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
