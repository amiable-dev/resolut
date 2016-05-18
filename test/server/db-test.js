var expect = require('chai').expect;
describe('util-test', function() {
    it('should pass this canary test', function() {
    expect(true).to.eql(true); 
    });
});

it('It should return a null connection by default', function() {
    expect(db.get()).to.be.null;
});