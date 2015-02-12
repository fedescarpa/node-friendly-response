/* jshint node: true */
'use strict';

var _ = require('lodash');
var HttpStatusCodes = require('http-status-codes');

module.exports = function (mapper) {
  return _(HttpStatusCodes)
    .omit(_.isFunction)
    .map(function(value, key) {
      return {
        key: mapper ? mapper(key) : key,
        value: value
      };
    })
    .sortBy('value')
    .value();
};
