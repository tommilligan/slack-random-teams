var expect = require('chai').expect;

var subject = require('../src/utils');

describe('shuffle', function() {
  it('should contain same elements', function() {
    var input = [0, 1, 2, 3];
    var actual = subject.shuffle(input);
    expect(actual).to.have.all.members(input);
  });
});