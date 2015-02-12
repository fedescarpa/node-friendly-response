/* jshint node: true */
'use strict';

var NodeCustomErrors = require('node-custom-errors');

var format      = require('./utils/format');
var statusCodes = require('./utils/http-status-codes');

var ResponseError = NodeCustomErrors.create('InternalServerError');

statusCodes(format.exception).forEach(function (status) {

  var key   = status.key;
  var value = status.value;

  if (value >= 400) {
    ResponseError[key] = NodeCustomErrors.create(key, ResponseError);
  }

});

module.exports = ResponseError;

