var should = require('chai').should(),
    webrobot = require('../index'),
    create = webrobot.create;

describe('#create', function() {
  it('logs Hello world', function() {
    create().should.equal('hello world');
  });
});
