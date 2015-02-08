/* jshint node: true */
'use strict';

var _                = require('lodash');
var HttpStatusCodes  = require('http-status-codes');

module.exports = _(HttpStatusCodes)
  .map(function (value, key) {
    return { key: key, value: value };
  })
  .filter(function (val) {
    return !_.isFunction(val.value) && val.value !== 100;
    // CONTINUE is not tested because it's need to be sent with Expect: 100-continue header
  })
  .sortBy('value')
  .value();