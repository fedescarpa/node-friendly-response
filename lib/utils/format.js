/* jshint node: true */
'use strict';

var S = require('string');

var __toLower = function (key) {
  return key.toLowerCase();
};

var Format = {

  method: function(key) {
    return S(__toLower(key)).camelize().s;
  },

  listenerMethod: function (key) {
    return 'on' + S(__toLower(key)).capitalize().camelize().s;
  },

  conditionalMethod: function(key) {
    return 'is' + S(__toLower(key)).capitalize().camelize().s;
  },

  exception: function (key) {
    return S(__toLower(key)).capitalize().camelize().s;
  },

  exceptionToMethod: function(key) {
    return S(key).underscore().camelize().s;
  }

};

module.exports = Format;
