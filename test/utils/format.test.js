/* jshint node: true */
/* global describe, context, it, after, before, afterEach, beforeEach */
'use strict';

require('should');

var Format = require('../../lib/utils/format');


describe('#Format', function() {

  it('#method', function() {
    Format.method('OK').should.be.eql('ok');
    Format.method('NOT_FOUND').should.be.eql('notFound');
  });

  it('#exception', function() {
    Format.exception('ERROR').should.be.eql('Error');
    Format.exception('NOT_FOUND').should.be.eql('NotFound');
  });

  it('#exceptionToMethod', function() {
    Format.exceptionToMethod('Ok').should.be.eql('ok');
    Format.exceptionToMethod('NotFound').should.be.eql('notFound');
  });

  it('#conditionalMethod', function() {
    Format.conditionalMethod('OK').should.be.eql('isOk');
    Format.conditionalMethod('NOT_FOUND').should.be.eql('isNotFound');
  });

});
