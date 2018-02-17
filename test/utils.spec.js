var expect = require('chai').expect;

var subject = require('../src/utils');

describe('shuffle', function() {
  it('should contain same elements', function() {
    var input = [0, 1, 2, 3];
    var actual = subject.shuffle(input);
    expect(actual).to.have.all.members(input);
  });
});

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