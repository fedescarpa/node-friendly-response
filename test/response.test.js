/* jshint node:true */
/* global describe, context, it, beforeEach */
'use strict';

var s = require('interpolate');
var should = require('should');
var Bluebird = require('bluebird');

var Response = require('../');

describe('Response', function () {

  var res;

  beforeEach(function () {
    res = {
      json: function (json) { this._json = json; },
      status: function (status) { this._status = status; }
    };
  });

  context('#status', function () {

    [ NaN, null, undefined ].forEach(function (value) {
      it(s('should respond an empty JSON if value is {VALUE}', { VALUE: value }), function () {
        Response.OK(res)(value);
        res._json.should.be.eql({});
      });
    });

    [ 1, 'Hola', true ].forEach(function (value) {
      it(s('should respond a JSON with data property if value is a {VALUE}', { VALUE: value.constructor.name }), function () {
        Response.CREATED(res)(value);
        res._json.should.be.eql({ data: value });
      });
    });

    [ { foo: 'bar' }, ['foo', 'bar'] ].forEach(function (value) {
      it(s('should respond a JSON if value is an {VALUE}', { VALUE: value.constructor.name }), function () {
        Response.INTERNAL_SERVER_ERROR(res)(value);
        res._json.should.be.eql(value);
      });
    });

  });

  context('#sendError', function () {

    it('should respond with an error JSON if an error occurs', function () {
      Response.sendError(res)(new Error('Ups!'));
      res._status.should.be.eql(500);
      res._json.should.be.eql({ error: { name: 'Error', message: 'Ups!' }});
    });

    it('should respond with an error JSON if a response error occurs', function () {
      Response.sendError(res)(new Response.Error.BAD_REQUEST('Ups!'));
      res._status.should.be.eql(400);
      res._json.should.be.eql({ error: { name: 'Bad Request', message: 'Ups!' }});
    });

    it('should respond with an error JSON without error', function () {
      Response.sendError(res,'NOT_FOUND')('Ups!');
      res._status.should.be.eql(404);
      res._json.should.be.eql({ error: { name: 'Not Found', message: 'Ups!' }});
    });

  });

  context('#bluebird', function () {

    var ResponseError = Response.Error;

    var flow = function (req) {
      return Bluebird.resolve( req.body )
        .tap(function (body) {
          if (!body.value) {
            throw new ResponseError.BAD_REQUEST('No value');
          }
        })
        .get('value')
        .tap(function (value) {
          if (value !== 42) {
            throw new ResponseError.PAYMENT_REQUIRED('$$$$');
          }
        })
        .thenReturn(req.body)
        .then(Response.OK(res))
        .catch(ResponseError, Response.sendError(res));
    };

    it('should send the resolved JSON if no error', function (done) {
      flow({ body: { value: 42 } })
        .then(function () {
          res._status.should.be.eql(200);
          res._json.should.be.eql({ value: 42 });
        })
        .then(done, done);
    });

    it('should send bad request if value field is missing', function (done) {
      flow({ body: {} })
        .then(function () {
          res._status.should.be.eql(400);
          res._json.should.be.eql({ error: { name: 'Bad Request', message: 'No value' }});
        })
        .then(done, done);
    });

    it('should send payment required if value field is missing', function (done) {
      flow({ body: { value: 30 } })
        .then(function () {
          res._status.should.be.eql(402);
          res._json.should.be.eql({ error: { name: 'Payment Required', message: '$$$$' }});
        })
        .then(done, done);
    });

  });

});
