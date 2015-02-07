/* jshint node: true */
/* global describe, context, it, after, before, afterEach, beforeEach */
'use strict';

require('should');
require('../lib/server-response');

var _ = require('lodash');
var s = require('interpolate');
var http = require('http');
var express = require('express');
var Bluebird = require('bluebird');
var supertest = require('supertest');

var StatusCodes = require('./sort-http-status-codes');

describe('Server response', function () {

  var app, server, request;

  beforeEach(function (done) {
    app = express();
    server = app.listen(65000, done);
    request = supertest(app);
  });

  afterEach(function () {
    server.close();
  });

  context('#send from status', function () {

    StatusCodes.forEach(function (status) {

      it(s('{key} call should responds with a {value} status code', status), function (done) {

        app.get('/', function (req, res) {
          res[status.key]();
        });

        request
          .get('/')
          .expect(status.value)
          .end(done);

      });

    });

  });

  context('#sendError', function () {

    context('#response error', function () {

      StatusCodes.filter(function (status) { return status.value >= 400; }).forEach(function (status) {

        it(s('should send {value} if {key} error was thrown', status), function (done) {

          app.get('/', function (req, res) {
            Bluebird
              .reject(new res.Error[status.key]('foo bar'))
              .catch(function (err) {
                res.sendError(err);
              });
          });

          request
            .get('/')
            .expect(status.value)
            .expect({
              error: {
                name: status.key,
                message: 'foo bar'
              }
            })
            .end(done);
        });

      });

    });

    context('#other error', function () {

      it('should send 500 if other error was thrown', function (done) {

        app.get('/', function (req, res) {
          Bluebird
            .reject(new Error('foo bar'))
            .catch(function (err) {
              res.sendError(err);
            });
        });

        request
          .get('/')
          .expect(500)
          .expect({
            error: {
              name: 'Error',
              message: 'foo bar'
            }
          })
          .end(done);
      });

      it('should send correct status if other error\'s name contains an http status code', function (done) {

        var NewError = require('node-custom-errors').create('PaymentRequiredError');

        app.get('/', function (req, res) {
          Bluebird
            .reject(new NewError('foo bar'))
            .catch(function (err) {
              res.sendError(err);
            });
        });

        request
          .get('/')
          .expect(402)
          .expect({
            error: {
              name: 'PaymentRequiredError',
              message: 'foo bar'
            }
          })
          .end(done);
      });

    });

    context('#toJSON', function () {

      [ null, undefined, NaN ].forEach(function (value) {

        it(s('should send {} if nullable value like ({value}) is send', { value: value }), function (done) {

          app.get('/', function (req, res) {
            res.OK(value);
          });

          request
            .get('/')
            .expect(200)
            .expect({})
            .end(done);
        });

      });

      [ 1, 'hello', true ].forEach(function (value) {

        var options = { value: JSON.stringify(value), class: value.constructor.name };

        it(s('should send { data: {value} } if primitive value like a {class} is send', options), function (done) {

          app.get('/', function (req, res) {
            res.OK(value);
          });

          request
            .get('/')
            .expect(200)
            .expect({ data: value })
            .end(done);
        });

      });

      [ [ 'foo', 'bar' ], { baz: 1 } ].forEach(function (value) {

        var options = { value: JSON.stringify(value), class: value.constructor.name };

        it(s('should send {value} if a JSON value like an {class} is send', options), function (done) {

          app.get('/', function (req, res) {
            res.OK(value);
          });

          request
            .get('/')
            .expect(200)
            .expect(value)
            .end(done);
        });

      });

    });

  });

});
