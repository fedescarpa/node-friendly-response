/* jshint node: true */
/* global describe, context, it, after, before, afterEach, beforeEach */
'use strict';

require('should');

var _ = require('lodash');
var s = require('interpolate');
var http = require('http');
var express = require('express');
var Bluebird = require('bluebird');
var supertest = require('supertest');

var HttpServerResponse = require('../lib/server-response');
var format = require('../lib/utils/format');
var StatusCodes = require('./sort-http-status-codes');
var ResponseError = require('../lib/response-error');

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
      var methodName = format.method(status.key);
      var options = _.defaults(_.clone(status), { methodName: methodName });

      it(s('{methodName} call should responds with a {value} status code', options), function (done) {

        app.get('/', function (req, res) {
          res[methodName]();
        });

        request
          .get('/')
          .expect(status.value)
          .end(done);

      });

    });

  });

  context('#on event from status', function() {

    StatusCodes.forEach(function (status) {
      var methodName = format.listenerMethod(status.key);
      var options = _.defaults(_.clone(status), { methodName: methodName });

      it(s('{methodName} should emit an event and call listener', options), function (done) {

        HttpServerResponse[methodName](function (element) {
          HttpServerResponse.removeAllListeners([element.statusCode]);
          done();
        });

        app.get('/', function (req, res) {
          res[format.method(status.key)]();
        });

        request
          .get('/')
          .expect(status.value)
          .end(_.noop);
      });

    });
  });

  context('#onResponseError', function() {

    afterEach(function () {
      HttpServerResponse.removeAllListeners(['response_error', 200]);
    });

    it('should call listener when status code is greather than 400', function (done) {
      HttpServerResponse.onResponseError(function () {
        done();
      });

      app.get('/', function (req, res) {
        res.badRequest();
      });

      request
        .get('/')
        .expect(401)
        .end(_.noop);

    });

    it('should not call listener when status code is less than 400', function (done) {
      HttpServerResponse.onResponseError(function () {
        done('should not call');
      });

      HttpServerResponse.onOk(function () {
        done();
      });

      app.get('/', function (req, res) {
        res.ok();
      });

      request
        .get('/')
        .expect(200)
        .end(_.noop);

    });

  });

  context('#sendError', function () {

    context('#response error', function () {

      StatusCodes
        .filter(function (status) { return status.value >= 400; })
        .forEach(function (status) {
          status = _.defaults(_.clone(status), { exceptionName : format.exception(status.key)});

          it(s('should send {value} if {exceptionName} error was thrown', status), function (done) {

            app.get('/', function (req, res) {

              Bluebird
                .reject(new ResponseError[status.exceptionName]('foo bar'))
                .catch(function (err) {
                  res.sendError(err);
                });
            });

            request
              .get('/')
              .expect(status.value)
              .expect({
                error: {
                  name: status.exceptionName,
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
            res.ok(value);
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
            res.ok(value);
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
            res.ok(value);
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
