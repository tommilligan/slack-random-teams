var expect = require('chai').expect;

var subject = require('../src/formats');

describe('formatTeams', function() {
  it('should output format correctly', function() {
    var input = [['foo', ['a', 'b']], ['bar', ['c', 'd']]];
    var actual = subject.formatTeams(input);
    expect(actual).to.equal(`_Your teams are:_
*foo*
a
b
*bar*
c
d`);
  });
});
