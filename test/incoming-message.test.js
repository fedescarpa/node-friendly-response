/* jshint node: true */
/* global describe, context, it, after, before, afterEach, beforeEach */
'use strict';

require('should');
require('../lib/incoming-message');

var _ = require('lodash');
var s = require('interpolate');
var express = require('express');
var request = require('request');
var Bluebird = require('bluebird');
var StatusCodes = require('./sort-http-status-codes');

var format = require('../lib/utils/format');

Bluebird.promisifyAll(request);

describe('Incoming message response', function () {

  var app, server;

  beforeEach(function (done) {
    app = express();
    server = app.listen(65000, done);
  });

  afterEach(function () {
    server.close();
  });

  var fixtures = [
    { name: 'info', status: 101, values: '1xx', method: 'isInfo' } ,
    { name: 'success', status: 202, values: '2xx', method: 'isSuccess' } ,
    { name: 'redirect', status: 303, values: '3xx', method: 'isRedirect' } ,
    { name: 'server error', status: 404, values: '4xx', method: 'isClientError' } ,
    { name: 'server error', status: 505, values: '5xx', method: 'isServerError' } ,
    { name: 'error', status: 499, values: '4xx or 5xx', method: 'isError' } ,
  ];

  fixtures.forEach(function (fixture) {

    it(s('should be {name} if status code is {values}', fixture), function (done) {

      app.get('/', function (req, res) {
        res.status(fixture.status).end();
      });

      request
        .getAsync({ uri: 'http://localhost:65000' })
        .spread(function (res, body) {
          res[fixture.method]().should.be.eql(true);
        })
        .then(done, done);

    });

  });

  StatusCodes.forEach(function (status) {
    var methodName = format.conditionalMethod(status.key);
    var options = _.defaults(_.clone(status), { methodName: methodName });

    it(s('{methodName} should be truth if response status is {value}', options), function (done) {

      app.get('/', function (req, res) {
        res.status(status.value).end();
      });

      request
        .getAsync({ uri: 'http://localhost:65000' })
        .spread(function (res, body) {
          res[methodName]().should.be.eql(true);
        })
        .then(done, done);

    });

  });

});
