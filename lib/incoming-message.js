/* jshint node: true */
'use strict';

var _ = require('lodash');
var http = require('http');
var HttpStatusCodes = require('http-status-codes');

var incomingMessage = http.IncomingMessage.prototype;
var format = require('./utils/format');

_.forIn(HttpStatusCodes, function (value, key) {

  if (!_.isFunction(value)) {
    incomingMessage[format.conditionalMethod(key)] = function () {
      return this.statusCode === value;
    };
  }

});

var __between = function (lower, higher, value) {
  return lower <= value && value < higher;
};

incomingMessage.isInfo = function () {
  return __between(100, 200, this.statusCode);
};

incomingMessage.isSuccess = function () {
  return __between(200, 300, this.statusCode);
};

incomingMessage.isRedirect = function () {
  return __between(300, 400, this.statusCode);
};

incomingMessage.isClientError = function () {
  return __between(400, 500, this.statusCode);
};

incomingMessage.isServerError = function () {
  return __between(500, 600, this.statusCode);
};

incomingMessage.isError = function () {
  return __between(400, 600, this.statusCode);
};

module.exports = http.IncomingMessage;
