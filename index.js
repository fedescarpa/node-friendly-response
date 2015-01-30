/* jshint node: true */
'use strict';

var _                = require('lodash');
var HttpStatusCodes  = require('http-status-codes');
var NodeCustomErrors = require('node-custom-errors');

var Response   = {};
Response.Error = NodeCustomErrors.create('ResponseError');

var _getError = function (name, message) {
  return { error: {
    name: name instanceof Error ? name.name : HttpStatusCodes.getStatusText(HttpStatusCodes[name]),
    message: message
  }};
};

var _isResponseError = function (data) {
  return data instanceof Response.Error;
};

var _isJsonable = function (data) {
  return _.isObject(data) || _.isArray(data) || _.isPlainObject(data);
};

var _isNotJsonable = function (data) {
  return _.isBoolean(data) || _.isDate(data) || _.isFinite(data) ||
    (_.isNumber(data) && !_.isNaN(data)) || _.isRegExp(data) || _.isString(data);
};

var _payload = function(data) {
  if (_isJsonable(data)) {
    return data;
  } else if (_isNotJsonable(data)) {
    return { data: data };
  } else {
    return {};
  }
};

var _newResponse = function (statusCode) {
  return function (httpResponse) {
    return function (data) {
      httpResponse.status(statusCode);
      httpResponse.json(_payload(data));
    };
  };
};

_.forOwn(HttpStatusCodes, function (status, key) {
  if (key !== 'getStatusText') {
    Response[key] = _newResponse(status);
    if (status >= 400) {
      Response.Error[key] = NodeCustomErrors.create(key, Response.Error);
    }
  }
});

Response.ResponseError = Response.INTERNAL_SERVER_ERROR;
Response.sendError = function (res, name) {
  return _isResponseError(name) ?
    Response[name.name](res)(_getError(name.name, name.message)) :
    name instanceof Error ?
      Response.INTERNAL_SERVER_ERROR(res)(_getError(name, name.message)) :
      function (message) {
        Response[name](res)(_getError(name, message));
      };
};
Response.sendError = _.curry(Response.sendError);

module.exports = Response;
