/* jshint node: true */
'use strict';

var _                = require('lodash');
var http             = require('http');
var humanizeString   = require('humanize-string');
var HttpStatusCodes  = require('http-status-codes');

var format        = require('./utils/format');
var statusCodes   = require('./utils/http-status-codes');
var ResponseError = require('./response-error');

var apply = function (v) {
  return function (f) {
    return f(v);
  };
};

var __isNullable = function (raw) {
  return [_.isNull, _.isNaN, _.isUndefined].some(apply(raw));
};

var __isError = function (raw) {
  return raw instanceof Error;
};

var __isJsonable = function (raw) {
  return [_.isArray, _.isPlainObject, _.isObject].some(apply(raw));
};

var __toJSON = function (raw) {
  if (__isNullable(raw)) {
    return {};
  } else if (__isError(raw)) {
    return { error: _.pick(raw, ['name', 'message']) };
  } else if (__isJsonable(raw)) {
    return raw;
  } else {
    return { data: raw };
  }
};

var __send = function (response, statusCode, json) {
  var body = JSON.stringify(json);
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Content-Length', body.length);
  response.write(body);
  response.end();
};

var __getName = function (name) {
  return humanizeString(name)
    .split(' ')
    .filter(function(s) {
      return !new RegExp('Error|Exception', 'i').test(s);
    })
    .map(function(s) {
      return s.trim().toUpperCase();
    })
    .join('_');
};

var response = http.ServerResponse.prototype;

response.sendError = function (error) {
  if (!__isError(error)) {
    throw new Error("#sendError argument is not an Error's instance");
  }
  if (error instanceof ResponseError) {
    this[format.exceptionToMethod(error.name)](__toJSON(error));
  } else {
    var statusCode = HttpStatusCodes[__getName(error.name)] || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    __send(this, statusCode, __toJSON(error));
  }
};

statusCodes(format.method).forEach(function (status) {

  var key   = status.key;
  var value = status.value;

  response[key] = function (raw) {
    __send(this, value, __toJSON(raw));
  };

});

module.exports = http.ServerResponse;
