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
var HttpStatusCodes = require('http-status-codes');

Bluebird.promisifyAll(request);

var StatusCodes = _(HttpStatusCodes)
  .map(function (value, key) {
    return { key: key, value: value };
  })
  .filter(function (val) {
    return !_.isFunction(val.value) && val.value !== 100;
    // CONTINUE is not tested because it's need to be sent with Expect: 100-continue header
  })
  .sortBy('value')
  .value();

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

    it(s('is{key} should be truth if response status is {value}', status), function (done) {

      app.get('/', function (req, res) {
        res.status(status.value).end();
      });

      request
        .getAsync({ uri: 'http://localhost:65000' })
        .spread(function (res, body) {
          res['is' + status.key]().should.be.eql(true);
        })
        .then(done, done);

    });

  });

});
