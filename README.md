# express-response

## How can I use it?...
It's very simple

```js

var express  = require('express');
var Response = require('express-response');

var app = express();

app.get('/', function (req, res) {
  Response.OK(res)({ message: 'Hello World!' })
});

```

## Using it with Bluebird

```js

var express  = require('express');
var Bluebird = require('bluebird');
var Response = require('express-response');

var app = express();

app.get('/', function (req, res) {
  Bluebird.resolve({ message: 'Hello World!' })
    .tap(__doSomething)
    .then(Response.OK(res))
    .catch(Response.INTERNAL_SERVER_ERROR(res));
});

```

## Express response errors handle

```js

var express  = require('express');
var Bluebird = require('bluebird');
var Response = require('express-response');

var ResponseError = Response.Error;

var app = express();

app.get('/', function (req, res) {
  Bluebird.resolve( req.body )
    .tap(function (body) {
      if (!body.value) {
        throw new ResponseError.BAD_REQUEST('Property "value" is mandatory')
      }
    })
    .get('value')
    .tap(function (value) {
      if (value !== 42) {
        throw new ResponseError.PAYMENT_REQUIRED('$$$$');
      }
    })
    .then(__doSomething)
    .then(Response.OK(res))
    .catch(ResponseError, Response.sendError(res));
});

```

## Available Status Codes

```
Response.CONTINUE send a response with status 100
Response.SWITCHING_PROTOCOLS send a response with status 101
Response.PROCESSING send a response with status 102

Response.OK send a response with status 200
Response.CREATED send a response with status 201
Response.ACCEPTED send a response with status 202
Response.NON_AUTHORITATIVE_INFORMATION send a response with status 203
Response.NO_CONTENT send a response with status 204
Response.RESET_CONTENT send a response with status 205
Response.PARTIAL_CONTENT send a response with status 206
Response.MULTI_STATUS send a response with status 207

Response.MULTIPLE_CHOICES send a response with status 300
Response.MOVED_PERMANENTLY send a response with status 301
Response.MOVED_TEMPORARILY send a response with status 302
Response.SEE_OTHER send a response with status 303
Response.NOT_MODIFIED send a response with status 304
Response.USE_PROXY send a response with status 305
Response.TEMPORARY_REDIRECT send a response with status 307

Response.BAD_REQUEST send a response with status 400
Response.UNAUTHORIZED send a response with status 401
Response.PAYMENT_REQUIRED send a response with status 402
Response.FORBIDDEN send a response with status 403
Response.NOT_FOUND send a response with status 404
Response.METHOD_NOT_ALLOWED send a response with status 405
Response.NOT_ACCEPTABLE send a response with status 406
Response.PROXY_AUTHENTICATION_REQUIRED send a response with status 407
Response.REQUEST_TIMEOUT send a response with status 408
Response.CONFLICT send a response with status 409
Response.GONE send a response with status 410
Response.LENGTH_REQUIRED send a response with status 411
Response.PRECONDITION_FAILED send a response with status 412
Response.REQUEST_TOO_LONG send a response with status 413
Response.REQUEST_URI_TOO_LONG send a response with status 414
Response.UNSUPPORTED_MEDIA_TYPE send a response with status 415
Response.REQUESTED_RANGE_NOT_SATISFIABLE send a response with status 416
Response.EXPECTATION_FAILED send a response with status 417
Response.INSUFFICIENT_SPACE_ON_RESOURCE send a response with status 419
Response.METHOD_FAILURE send a response with status 420
Response.UNPROCESSABLE_ENTITY send a response with status 422
Response.LOCKED send a response with status 423
Response.FAILED_DEPENDENCY  send a response with status 424

Response.INTERNAL_SERVER_ERROR send a response with status 500
Response.NOT_IMPLEMENTED send a response with status 501
Response.BAD_GATEWAY send a response with status 502
Response.SERVICE_UNAVAILABLE send a response with status 503
Response.GATEWAY_TIMEOUT send a response with status 504
Response.HTTP_VERSION_NOT_SUPPORTED send a response with status 505
Response.INSUFFICIENT_STORAGE send a response with status 507
```

## Available Errors

```
Response.Error = Response.Error.INTERNAL_SERVER_ERROR

Response.Error.BAD_REQUEST
Response.Error.UNAUTHORIZED
Response.Error.PAYMENT_REQUIRED
Response.Error.FORBIDDEN
Response.Error.NOT_FOUND
Response.Error.METHOD_NOT_ALLOWED
Response.Error.NOT_ACCEPTABLE
Response.Error.PROXY_AUTHENTICATION_REQUIRED
Response.Error.REQUEST_TIMEOUT
Response.Error.CONFLICT
Response.Error.GONE
Response.Error.LENGTH_REQUIRED
Response.Error.PRECONDITION_FAILED
Response.Error.REQUEST_TOO_LONG
Response.Error.REQUEST_URI_TOO_LONG
Response.Error.UNSUPPORTED_MEDIA_TYPE
Response.Error.REQUESTED_RANGE_NOT_SATISFIABLE
Response.Error.EXPECTATION_FAILED
Response.Error.INSUFFICIENT_SPACE_ON_RESOURCE
Response.Error.METHOD_FAILURE
Response.Error.UNPROCESSABLE_ENTITY
Response.Error.LOCKED
Response.Error.FAILED_DEPENDENCY

Response.Error.INTERNAL_SERVER_ERROR
Response.Error.NOT_IMPLEMENTED
Response.Error.BAD_GATEWAY
Response.Error.SERVICE_UNAVAILABLE
Response.Error.GATEWAY_TIMEOUT
Response.Error.HTTP_VERSION_NOT_SUPPORTED
Response.Error.INSUFFICIENT_STORAGE
```

## License

```
The MIT License (MIT)

Copyright (c) 2015 Federico Scarpa.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
